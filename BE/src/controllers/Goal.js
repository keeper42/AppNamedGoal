import Goal from '../models/Goal'
import Comment from '../models/Comment'
import CommentLikeMap from '../models/CommentLikeMap'
import validate from './validate/goal'

import {getCommentsOtherInfo} from './Comment'

let codeMsg = {
	10000: 'success',
	10404: 'unkown error'
}

/**
 * 获取所有目标列表
 */
exports.index = (req, res, next) => {
	Goal.find().populate({path: 'user', select: {name: 1, avatar: 1}}).exec((err, goals) => {
		if (err) return res.json({code: 10500, msg: '数据库查询失败'});
		res.json({code: 10000, msg: '', data: goals});
	})
}

/**
 * 创建目标
 */
exports.save = (req, res, next) => {
	let userId = req.user._id;
	let {title, content} = req.body;
	let goal = new Goal;
	goal.user = userId;
	goal.title = title;
	goal.content = content;
	goal.save((err, product) => {
		if (err) return res.json({code: 10500, msg: '创建目标失败，请检查数据是否合法'});
		res.json({code: 10000, msg: '', data: product._id});
	})
}

/**
 * 获取目标所有信息及该目标下的所有直接评论信息
 */
exports.read = (req, res, next) => {
	let goalId = req.params.id;
	Goal.findById({_id: goalId}, (err, goal) => {
		if (err) return res.json({code: 10500, msg: '数据库查询失败'});
		if (!goal) return res.json({code: 10200, msg: '未找到要查询的goal信息'});
		// 查询goal的所有直接评论信息
		Comment.find({goal: goalId}).populate({path: 'user', select: {name: 1, avatar: 1}}).exec((err, comments) => {
			if (err) return res.json({code: 10500, msg: '数据库查询失败'});

			getCommentsOtherInfo(comments).then(() => {
				goal = goal.toJSON();
				goal.comments = comments;
				res.json({code: 10000, msg: '', data: goal});
			}, err => {
				res.json({code :10500, msg: '服务器出错'});
				console.log(err);
			})

		})
	})
}