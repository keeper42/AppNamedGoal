import Goal from '../../models/Goal'

let codeMsg = {
	10000: 'create successfully',
	10200: 'params error',
	10400: 'title error',
	10401: 'content error',
	10402: 'time error',
	10404: 'unkown error'
}

let create = data => new Promise((resolve, reject) => {
	const {title, content, begin, plan} = data;
	if (!title || !content || !begin || !plan) {
		return reject({code: 10200, msg: 'params error'});
	}
	if (title.length === 0) {
		return reject({code: 10400, msg: '标题不能为空'});
	}
	if (content.length === 0) {
		return reject({code: 10401, msg: '目标内容不能为空'});
	}
	let beginInt = parseInt(begin),
			planInt = parseInt(plan);
	if (beginInt == NaN || planInt == NaN || beginInt >= planInt) {
		return reject({code: 10402, msg: '时间非法'});
	}
	resolve();
})
exports.create = create;

exports.update = (userId, id, data) => new Promise((resolve, reject) => {
	create(data).then(() => {
		Goal.findOne({_id: id, user: userId}, (err, goal) => {
			if (err || !goal) {
				return reject({code: 10404, msg: 'params error'});
			}
			resolve(goal);
		})
	}, err => {
		reject(err);
	})
})