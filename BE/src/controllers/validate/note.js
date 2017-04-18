import Note from '../../models/Note'

let codeMsg = {
	10000: 'create successfully',
	10200: 'params error',
	10400: 'content error',
	10404: 'unkown error'
}

let create = data => new Promise((resolve, reject) => {
	const {content} = data;
	if (!content) {
		return reject({code: 10200, msg: 'params error'});
	}
	if (content.length === 0) {
		return reject({code: 10400, msg: '内容不能为空'});
	}
	resolve();
})
exports.create = create;

exports.update = (userId, id, data) => new Promise((resolve, reject) => {
	create(data).then(() => {
		Note.findOne({_id: id, user: userId, delete: false}, (err, note) => {
			if (err || !note) {
				return reject({code: 10404, msg: 'params error'});
			}
			resolve(note);
		})
	}, err => {
		reject(err);
	})
})