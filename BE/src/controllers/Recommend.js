import Comment from '../models/Comment'
import Follow from '../models/Follow'
import CommentLikeMap from '../models/CommentLikeMap'

/**
 * 获取推荐
 */
exports.get_recommend = (req, res, next) => {
	let userId = req.user._id;
	Comment.find({user: {$ne: userId}, goal: {$ne: null}})
		.populate({path: 'user', select: {name: 1, avatar: 1}})
		.populate({path: 'goal', populate: {path: 'user', select: {name: 1, avatar: 1}}})
		.exec((err, comments) => {
			if (err) return res.json({code: 10500, msg: '查询失败'});

			let promises = [];

			for (let i = 0; i < comments.length; ++i) {
				comments[i] = comments[i].toJSON();
				promises.push(new Promise((resolve, reject) => {
					/*
						获取关注指定用户的用户id数组
					 */
					Follow.find({user: comments[i].user._id}, (err, follows) => {
						if (err) return reject();
						comments[i].follower = follows.map(follow => follow.follower);
						resolve();
					})
				}))
				promises.push(new Promise((resolve, reject) => {
					/*
						获取指定评论的点赞用户数组
					 */
					CommentLikeMap.find({comment: comments[i]._id}, (err, commentLikeMaps) => {
						if (err) return reject();
						comments[i].like = commentLikeMaps.map(commentLikeMap => commentLikeMap.user);
						resolve();
					})
				}))	
			}

			Promise.all(promises).then(() => {
				res.json({code: 10000, msg: '', data: comments});
			}, err => {
				res.json({code: 10500, msg: '查询失败'});
			})
		})
}