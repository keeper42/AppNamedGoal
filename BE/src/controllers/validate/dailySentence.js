import DailySentence from '../../models/DailySentence'

let codeMsg = {
	10000: 'create successfully',
	10200: 'params error',
	10400: 'sentence error',
	10401: 'background image error',
	10404: 'unkown error'
}

exports.create = data => new Promise((resolve, reject) => {
	let {sentence, backImg} = data;
	if (!sentence || !backImg) {
		return reject({code: 10200, msg: 'params error'});
	}
	let promises = [];
	promises.push(Csentence(sentence));
	promises.push(Cimage(backImg));
	Promise.all(promises).then(() => {
		resolve();
	}, err => {
		reject(err);
	})
})

exports.update = (id, data) => new Promise((resolve, reject) => {
	DailySentence.findById(id, (err, dailySentence) => {
		if (err || !dailySentence) {
			return reject({code: 10200, msg: '参数错误:未找到该用户'});
		}
		let {sentence, backImg} = data;
		if (!sentence || !backImg) {
			return reject({code: 10200, msg: 'params error'});
		}
		let promises = [];
		promises.push(Csentence(sentence));
		promises.push(Cimage(backImg));
		Promise.all(promises).then(() => {
			resolve(dailySentence);
		}, err => {
			reject(err);
		})
	})
})

let Csentence = _sentence => new Promise((resolve, reject) => {
	if (_sentence.length > 0) {
		return resolve();
	}
	reject({code: 10400, msg: 'sentence error'});
})

let Cimage = _backImg => new Promise((resolve, reject) => {
	if (_backImg.length > 0) {
		return resolve();
	}
	reject({code: 10401, msg: 'background image error'});
})