import Feedback from '../models/Feedback'

let codeMsg = {

}

exports.index = (req, res, next) => {
	Feedback.find({}, {password: 0}, {sort: {hasRead: 1}}, (err, feedbacks) => {
		if (err) return res.json({code: 10500, msg: '数据库查询错误'});
		if (!feedbacks) {
			res.json({code: 10404, msg: 'not found feedbacks'});
		} else {
			res.json({code: 10000, data: feedbacks});
		}
	})
}

exports.save = (req, res, next) => {
	let {content, contact} = req.body;
	let feedback = new Feedback;
	feedback.contact = contact;
	feedback.content = content;
	feedback.save(err => {
		if (err) return res.json({code: 10500, msg: '数据库保存失败,请重新尝试'});
		res.json({code: 10000, msg: '反馈成功'});
	})
}

exports.mark_read = (req, res, next) => {
	let id = req.params.id;
	Feedback.findById(id, (err, feedback) => {
		if (err) return res.json({code: 10500, msg: '数据库查询错误'});
		if (!feedback) return res.json({code: 10200, msg: '反馈不存在'});
		if (!feedback.hasRead) {
			feedback.hasRead = true;
			feedback.save(err => console.log(err));
		}
		res.json({code: 10000, msg: ''});
	})
}

exports.mark_unread = (req, res, next) => {
	let id = req.params.id;
	Feedback.findById(id, (err, feedback) => {
		if (err) return res.json({code: 10500, msg: '数据库查询错误'});
		if (!feedback) return res.json({code: 10200, msg: '反馈不存在'});
		if (feedback.hasRead) {
			feedback.hasRead = false;
			feedback.save(err => console.log(err));
		}
		res.json({code: 10000, msg: ''});
	})
}

exports.delete = (req, res, next) => {
	let id = req.params.id;
	Feedback.remove({_id: id}, err => {
		if (err) return res.json({code: 10500, msg: '删除失败'});
		res.json({code: 10000, msg: ''});
	})
}