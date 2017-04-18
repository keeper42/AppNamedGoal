import Note from '../models/Note'
import validate from './validate/note'

let codeMsg = {
	10000: 'success',
	10404: 'unkown error'
}

exports.index = (req, res, next) => {
	let userId = req.user._id;
	Note.find({user: userId, delete: false}, (err, notes) => {
		if (err) {
			console.log(err);
			return res.json({code: 10404, msg: '未找到当前用户便签'});
		}
		res.json({code: 10000, msg: '查找成功', data: notes.map(note => {
			return {
				content: note.content,
				createAt: note.meta.createAt,
				updateAt: note.meta.updateAt
			}
		})});
	})
}

exports.save = (req, res, next) => {
	validate.create(req.body).then(() => {
		const {content} = res.body;
		let note = new Note();
		note.user = req.user._id;
		note.content = content;
		note.save((err, product) => {
			if (err) {
				return res.json({code: 10404, msg: '保存便签失败'});
			}
			res.json({code: 10000, msg: '', data: product._id});
		})
	}, err => {
		res.json(err);
	})
}

exports.read = (req, res, next) => {
	let userId = req.user._id,
			id = req.params.id;
	Note.findOne({user: userId, _id: id, delete: false}, (err, note) => {
		if (err || !note) {
			return res.json({code: 10404, msg: '未找到便签'});
		}
		res.json({code: 10000, msg: '', data: {
			content: note.content,
			createAt: note.meta.createAt,
			updateAt: note.meta.updateAt
		}});
	})
}

exports.update = (req, res, next) => {
	let userId = req.user._id,
			id = req.body.id;
	validate.update(userId, id, req.body).then(note => {
		const {content} = req.body;
		note.content = content;
		note.save(err => {
			if (err) {
				return res.json({code: 10404, msg: '保存失败'});
			}
			res.json({code: 10000, msg: '保存成功'});
		})
	}, err => {
		res.json(err);
	})
}

exports.delete = (req, res, next) => {
	let userId = req.user._id,
			id = req.params.id;
	Note.remove({user: userId, _id: id}, err => {
		if (err) {
			return res.json({code: 10404, msg: '删除失败'});
		}
		res.json({code: 10000, msg: '删除成功'});
	})
}