import Message from '../models/Message'
import User from '../models/User'

/*
	获取用户消息
 */
exports.get_message = (req, res, next) => {
	let userId = req.user._id;
	Message.find({user: userId}, null, {sort: {hasRead: 1, createAt: -1}})
		.populate({path: 'sender', select: {name: 1, avatar: 1}})
		.exec((err, messages) => {
			if (err) return res.json({code: 10500, msg: '查询失败'});
			res.json({code: 10000, msg: '', data: messages});
		})
}

/*
	发送消息
 */
exports.send_message = (req, res, next) => {
	let sender = req.user._id,
			userId = req.params.id,
			content = req.body.content;
	if (sender == userId) {
		return res.json({code: 10200, msg: '不能给自己发消息'});
	}
	User.findById(userId, (err, user) => {
		if (err) return res.json({code: 10500, msg: '查询失败，请检查参数是否合法'});
		if (!user) return res.json({code: 10200, msg: '用户不存在'});
		let message = new Message;
		message.user = userId;
		message.sender = sender;
		message.content = content;
		message.save(err => {
			if (err) return res.json({code: 10500, msg: '发送消息失败，请重新尝试'});
			res.json({code: 10000, msg: ''});
		})
	})
}

/*
	标记已读
 */
exports.mark_read = (req, res, next) => {
	let userId = req.user._id,
			id = req.params.id;
	Message.findOne({_id: id, user: userId}, (err, message) => {
		if (err) return res.json({code: 10500, msg: '标记失败'});
		message.hasRead = true;
		message.save(err => {
			if (err) return res.json({code: 10500, msg: '标记失败'});
			res.json({code: 10000, msg: ''});
		})
	})
}

/*
	删除消息
 */
exports.delete = (req, res, next) => {
	let userId = req.user._id,
			id = req.params.id;
	Message.remove({_id: id, user: userId}, err => {
		if (err) {
			console.log(err);
			return res.json({code: 10500, msg: '删除失败'});
		}
		res.json({code: 10000, msg: ''});
	})
}