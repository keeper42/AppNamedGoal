import fs from 'fs'
import crypto from 'crypto'
import path from 'path'
import formidable from 'formidable'

import User from '../models/User'
import FocusTime from '../models/FocusTime'
import Follow from '../models/Follow'
import GoalUserMap from '../models/GoalUserMap'
import validate from './validate/user'

const uploadConfig = {
	distDir: '/public/avatar'
}

exports.index = (req, res, next) => {
	const {page, rows} = req.query;
	// 分页查询
	if (page && rows) {
		User.find({}, {password: 0})
				.skip((page - 1) * rows)
				.limit(rows)
				.exec((err, users) => {
					if (err) {
						res.json({code: 10404, msg: 'params error'});
					} else {
						res.json({code: 10000, msg: '', data: users});
					}
				})
	} else {
		User.find({}, {password: 0}, (err, users) => {
			if (err || !users) {
				res.json({code: 10404, msg: 'not found users'});
			} else {
				res.json({code: 10000, data: users});
			}
		})
	}
}

exports.save = (req, res, next) => {
	validate.create(req.body).then(isEmail => {
		let {account, password} = req.body;
		let user = new User;

		if (isEmail) {
			account = account.toLowerCase();
			user.email = account;
		}
		else user.phone = account;

		user.name = account;
		user.password = password;
		user.save((err, product) => {
			if (err) {
				console.log(err);
				res.json({code: 10500, msg: '用户创建失败'});
			} else {
				res.json({code: 10000, msg: '注册成功', data: product._id});
			}
		})
	}, err => {
		res.json(err);
	})
}

exports.read = (req, res, next) => {
	User.findById(req.params.id, (err, user) => {
		if (err || !user) {
			res.json({code: 10404, msg: 'not found'});
		} else {
			res.json({code: 10000, data: user});
		}
	})
}

exports.get_user_info = (req, res, next) => {
	let user = req.user;
	res.json({code: 10000, msg: '', data: {
		_id: user._id,
		username: user.name,
		avatar: user.avatar,
		email: user.email || null,
		phone: user.phone || null,
		description: user.description,
		authority: user.authority
	}});
}

exports.get_other_user_info = (req, res, next) => {
	let id = req.params.id;
	User.findById(id, (err, user) => {
		if (err) return res.json({code: 10500, msg: '查询用户信息失败'});
		if (!user) return res.json({code: 10200, msg: '查询用户不存在'});
		user = {
			description: user.description
		};
		let promises = [];
		// 获取专注时长
		promises.push(new Promise((resolve, reject) => {
			FocusTime.find({user: id}, (err, focusTimes) => {
				if (err) return reject();
				user.focusTime = focusTimes.reduce((totle, focusTime) => totle + focusTime.length, 0);
				resolve();
			})
		}))
		// 获取关注他的人
		promises.push(new Promise((resolve, reject) => {
			Follow.find({user: id}).populate({path: 'follower', select: {name: 1, avatar: 1, description: 1}}).exec((err, follows) => {
				if (err) reject();
				user.followers = follows.map(follow => follow.follower);
				resolve();
			})
		}))
		// 获取他的目标个数
		promises.push(new Promise((resolve, reject) => {
			GoalUserMap.count({user: id, public: true}, (err, count) => {
				if (err) return reject();
				user.numOfGoal = count;
				resolve();
			})
		}))

		Promise.all(promises).then(() => {
			res.json({code: 10000, msg: '', data: user});
		}, err => {
			res.json({code: 10200, msg: '查询失败'})
		})
	})
}

exports.update_user_info = (req, res, nect) => {
	let user = req.user;
	const {name, avatar, description} = req.body;
	user.name = name;
	user.avatar = avatar;
	user.description = description;
	user.save(err => {
		if (err) {
			console.log(err)
			return res.json({code: 10404, msg: '更新信息失败，请重新尝试'})
		};
		res.json({code: 10000, msg: '更新信息成功'});
	})
}

exports.update_password = (req, res, next) => {
	let user = req.user;
	const {oldPassword, password} = req.body;
	validate.Cpassword(password).then(() => {
		// 检查oldPassword是否正确
		user.auth(oldPassword).then(() => {
			user.password = password;
			user.save(err => {
				if (err) res.json({code: 10404, msg: '密码更新失败，请重新尝试'});
				else res.json({code: 10000, msg: '密码更新成功'});
			})
		}, err => {
			// 密码验证失败
			res.json(err);
		})
	}, err => {
		// 新密码格式不正确
		res.json(err);
	})
}

exports.update = (req, res, next) => {
	// 不支持更改密码
	validate.update(req.params.id, req.body).then(user => {
		const {name, avatar, email, phone, description} = req.body;
		user.name = name;
		user.avatar = avatar;
		if (email != "null") user.email = email;
		if (phone != "null") user.phone = phone;
		user.description = description;
		user.save(err => {
			if (err) {
				console.log(err);
				return res.json({code: 10404, msg: '修改信息失败'});
			}
			res.json({code: 10000, msg: '修改信息成功'});
		})
	}, err => {
		res.json(err);
	})
}

exports.update_email = (req, res, next) => {
	// 暂不加入邮箱验证功能
	let user = req.user;
	const {email} = req.body;
	if (user.email == email) {
		return res.json({code: 10402, msg: '原邮箱与当前邮箱相同'});
	}
	validate.CemailFormat(email).then(() => {
		validate.Cemail(email).then(() => {
			user.email = email;
			user.save(err => {
				if (err) {
					return res.json({code: 10404, msg: '邮箱绑定失败，请重新尝试'});
				}
				res.json({code: 10000, msg: '邮箱绑定成功'});
			})
		}, err => {
			// 邮箱已被注册
			res.json(err);
		})
	}, err => {
		// 邮箱格式不正确
		res.json({code: 10402, msg: '邮箱格式不正确'});
	})
}
 
exports.update_phone = (req, res, next) => {
	// 暂不加入手机验证功能
	let user = req.user;
	const {phone} = req.body;
	if (user.phone == phone) {
		return res.json({code: 10403, msg: '原手机号与当前手机号相同'});
	}
	validate.CphoneFormat(phone).then(() => {
		validate.Cphone(phone).then(() => {
			user.phone = phone;
			user.save(err => {
				if (err) {
					return res.json({code: 10404, msg: '手机号绑定失败，请重新尝试'});
				}
				res.json({code: 10000, msg: '手机号绑定成功'});
			})
		}, err => {
			// 手机号已被注册
			res.json(err);
		})
	}, err => {
		// 手机号格式不正确
		res.json({code: 10403, msg: '手机号格式不正确'});
	})
}

exports.delete = (req, res, next) => {
	User.remove({_id: req.params.id}, err => {
		if (err) {
			res.json({code: 10404, msg: '删除失败: 未找到要删除的用户'});
		} else {
			res.json({code: 10000, msg: '删除成功'});
		}
	})
}

exports.upload_img = (req, res, next) => {
	let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, file) => {
  	if (err) {
  		console.log(err);
  		return res.json({code: 10500, msg: '解析上传文件失败'});
  	}
  	if (!file || !file.avatar) {
  		return res.json({code: 10200, msg: 'params error'});
  	}
  	file = file.avatar;
  	let tmpPath = file.path;
  	// get md5 of the upload file
  	let rs = fs.createReadStream(tmpPath),
  			hash = crypto.createHash('md5');
  	rs.on('data', hash.update.bind(hash));
  	rs.on('end', function () {
  		let md5 = hash.digest('hex');
  		let newPath = path.join(__dirname, '../../public/avatar', md5);
  		fs.rename(tmpPath, newPath, err => {
  			if (err) {
  				console.log(err);
  				return res.json({code: 10404, msg: '上传图片失败，请尝试重新上传'});
  			}
  			res.json({code: 10000, msg: '上传图片成功', data: `/public/avatar/${md5}`});
  		})
  	});
  });
}

exports.count = (req, res, next) => {
	User.count({}, (err, count) => {
		if (err) {
			console.log(err);
			return res.json({code: 10404, msg: '查询失败'});
		}
		res.json({code: 10000, msg: '', data: count});
	})
}