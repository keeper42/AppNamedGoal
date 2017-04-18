import Follow from '../models/Follow'
import User from '../models/User'

/*
	获取关注当前用户的人
 */
exports.get_followers = (req, res, next) => {
	getFollowers(req.user._id).then(data => {
		res.json({code: 10000, msg: '', data: data});
	}, err => {
		res.json({code: 10500, msg: '查询错误'});
	})
}

/*
	获取关注指定用户的人
 */
exports.get_user_followers = (req, res, next) => {
	getFollowers(req.params.id).then(data => {
		res.json({code: 10000, msg: '',  data: data});
	}, err => {
		res.json({code: 10500, msg: '查询错误'});
	})
}

/*
	关注指定用户
 */
exports.follow = (req, res, next) => {
	let follower = req.user._id,
			userId = req.params.id;
	if (follower == userId) {
		return res.json({code: 10200, msg: '不能关注自己'});
	}

	Follow.findOne({user: userId, follower: follower}, (err, follow) => {
		if (err) return res.json({code: 10500, msg: '查询失败'});
		if (follow) return res.json({code: 10000, msg: '', data: follow._id}); // 已关注则直接返回关注成功

		// 查找是否存在要关注的用户
		User.findById(userId, (err, user) => {
			if (err) return res.json({code: 10500, msg: '关注失败，请检查参数是否合法'});
			if (!user) return res.json({code: 10200, msg: '关注用户不存在'});

			let follow = new Follow;
			follow.user = userId;
			follow.follower = follower;
			follow.save((err, product) => {
				if (err) return res.json({code: 10200, msg: '关注失败'});
				res.json({code: 10000, msg: '', data: product._id});
			})
		})
	})
}

/*
	取消关注指定用户
 */
exports.unfollow = (req, res, next) => {
	let follower = req.user._id,
			userId = req.params.id;

	Follow.remove({user: userId, follower: follower}, err => {
		if (err) return res.json({code: 10200, msg: '请检查参数是否合法'});
		res.json({code: 10000, msg: ''});
	})
}

let getFollowers = userId => new Promise((resolve, reject) => {
	Follow.find({user: userId}).populate({path: 'follower', select: {name: 1, avatar: 1}}).exec((err, follows) => {
		if (err) reject();
		resolve(follows.map(follow => follow.follower));
	})
})