import GoalUserMap from '../models/GoalUserMap'
import Goal from '../models/Goal'

let codeMsg = {

}

exports.get_current_user_goals = (req, res, next) => {
	let userId = req.user._id;
	GoalUserMap.find({user: userId}).populate({path: 'goal', populate: {path: 'user', select: {name: 1, avatar: 1}}}).exec((err, goalUserMaps) => {
		if (err) return res.json({code: 10500, msg: '数据库查询错误'});
		res.json({code: 10000, msg: '', data: goalUserMaps});
	})
}

exports.index = (req, res, next) => {
	let userId = req.params.id;
	GoalUserMap.find({user: userId, public: true}).populate({path: 'goal', populate: {path: 'user', select: {name: 1, avatar: 1}}}).exec((err, goalUserMaps) => {
		if (err) return res.json({code: 10500, msg: '数据库查询错误'});
		// 获取每个目标的关注人数
		let promises = [];
		for (let i = 0; i < goalUserMaps.length; i++) {
			promises.push(new Promise((resolve, reject) => {
				goalUserMaps[i] = goalUserMaps[i].toJSON();
				GoalUserMap.count({goal: goalUserMaps[i].goal}, (err, count) => {
					if (err) count = 0;
					goalUserMaps[i].numberOfPeople = count;
					resolve();
				})
			}))
		}
		Promise.all(promises).then(() => {
			res.json({code: 10000, msg: '', data: goalUserMaps});
		}, err => {
			console.log(err);
			res.json({code: 10500, msg: '服务器出错'});
		})
	})
}

exports.save = (req, res, next) => {
	let goalId = req.params.id,
			userId = req.user._id;
	let {begin, plan, isPublic} = req.body;

	GoalUserMap.findOne({user: userId, goal: goalId}, (err, doc) => {
		if (err) return res.json({code: 10500, msg: '数据库查询失败'});
		if (doc) return res.json({code: 10000, msg: '', data: doc._id}); // 已添加则直接返回

		let goalUserMap = new GoalUserMap;
		goalUserMap.user = userId;
		goalUserMap.goal = goalId;
		goalUserMap.begin = begin;
		goalUserMap.end = 0;
		goalUserMap.plan = plan;
		goalUserMap.public = isPublic;
		goalUserMap.save((err, product) => {
			if (err) return res.json({code: 10500, msg: '添加目标失败,请检查参数是否合法'});
			res.json({code: 10000, msg: '', data: product._id});
		})
	})
}

exports.update = (req, res, next) => {
	let id = req.params.id,
			userId = req.user._id;
	let {begin, plan, isPublic} = req.body;
	GoalUserMap.findById(id, (err, goalUserMap) => {
		if (err) return res.json({code: 10500, msg: '数据库查询失败'});
		if (!goalUserMap) return res.json({code: 10200, msg: '要更新目标不存在或已被删除'});
		goalUserMap.begin = begin;
		goalUserMap.plan = plan;
		goalUserMap.public = isPublic;
		goalUserMap.save(err => {
			if (err) return res.json({code: 10500, msg: '更新目标失败,请检查参数是否合法'});
			res.json({code: 10000, msg: ''});
		})
	})
}

exports.delete = (req, res, next) => {
	let id = req.params.id,
			userId = req.user._id;
	GoalUserMap.remove({_id: id, user: userId}, err => {
		if (err) return res.json({code: 10500, msg: '删除失败'});
		res.json({code: 10000, msg: ''});
	})
}

exports.finish = (req, res, next) => {
	let id = req.params.id;
	GoalUserMap.findById(id, (err, goalUserMap) => {
		if (err) return res.json({code: 10500, msg: '数据库查询失败'});
		if (!goalUserMap) return res.json({code: 10200, msg: '未找到目标'});
		goalUserMap.finish = true;
		goalUserMap.end = Date.now();
		goalUserMap.save(err => {
			if (err) return res.json({code: 10500, msg: '数据库出错,请重新尝试'});
			res.json({code: 10000, msg: ''});
		})
	})
}

exports.unfinish = (req, res, next) => {
	let id = req.params.id;
	GoalUserMap.findById(id, (err, goalUserMap) => {
		if (err) return res.json({code: 10500, msg: '数据库查询失败'});
		if (!goalUserMap) return res.json({code: 10200, msg: '未找到目标'});
		goalUserMap.finish = false;
		goalUserMap.end = 0;
		goalUserMap.save(err => {
			if (err) return res.json({code: 10500, msg: '数据库出错,请重新尝试'});
			res.json({code: 10000, msg: ''});
		})
	})
}