import User from '../../models/User'

let codeMsg = {
	10000: 'create successfully',
	10200: 'params error',
	10400: 'name error',
	10401: 'password error',
	10402: 'email error',
	10403: 'phone error',
	10404: 'unkown error'
}

/**
 * 创建账号
 * @param  {json} data 要验证的数据
 * @return {boolean}      若注册账号为邮箱，返回true,反之返回false
 */
exports.create = data => new Promise((resolve, reject) => {
	const {account, password} = data;
	if (!account || !password) {
		return reject({code: 10200, msg: 'params error'});
	}
	new Promise((resolve, reject) => {
		CemailFormat(account).then(() => {
			// 注册账号名为邮箱
			resolve(true);
		}, err => {
			CphoneFormat(account).then(() => {
				// 注册账号为手机号
				resolve(false);
			}, err => {
				reject();// 注册账号格式不符合
			})
		})
	}).then(isEmail => {
		new Promise((resolve, reject) => {
			if (isEmail) {
				// 检查邮箱是否被注册
				Cemail(account).then(() => {
					resolve(isEmail);
				}, err => {
					reject(err)
				});
			} else {
				// 检查手机号是否被注册
				Cphone(account).then(() => {
					resolve(isEmail);
				}, err => {
					reject(err);
				})
			}
		}).then(isEmail => {
			// 判断密码格式是否正确
			Cpassword(password).then(() => {
				resolve(isEmail); // 数据验证成功
			}, err => {
				// 密码格式错误
				reject(err);
			})
		}, err => {
			// 邮箱或手机号已被注册
			reject(err);
		})
	}, err => {
		reject({code: 10402, msg: "账号格式不符合"});
	})
})

exports.update = (id, data) => new Promise((resolve, reject) => {
	User.findOne({_id: id}, (err, user) => {
		if (err) return reject({code: 10200, msg: '数据库查询错误'});
		if (!user) return reject({code: 10200, msg: 'parmas error'});
		resolve(user);
	})
})

let CemailFormat = _email => new Promise((resolve, reject) => {
	let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	reg.test(_email) ? resolve() : reject();
})
exports.CemailFormat = CemailFormat;

let Cemail = _email => new Promise((resolve, reject) => {
	User.findOne({email: _email.toLowerCase()}, (err, user) => {
		if (err) return reject({code: 10500, msg: '数据库查询错误'});
		if (user) return reject({code: 10402, msg: '邮箱已被注册'});
		resolve();
	})
})
exports.Cemail = Cemail;

let CphoneFormat = _phone => new Promise((resolve, reject) => {
	let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
	reg.test(_phone) ? resolve() : reject();
})
exports.CphoneFormat = CphoneFormat;

let Cphone = _phone => new Promise((resolve, reject) => {
	User.findOne({phone: _phone}, (err, user) => {
		if (err) return reject({code: 10500, msg: '数据库查询错误'});
		if (user) return reject({code: 10402, msg: '手机号已被注册'});
		resolve();
	})
})
exports.Cphone = Cphone;

let Cpassword = _password => new Promise((resolve, reject) => {
	if (_password.length > 5) {
		resolve();
	} else {
		reject({code: 10401, msg: '密码长度过短'});
	}
})
exports.Cpassword = Cpassword;