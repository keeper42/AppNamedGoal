import mongoose from 'mongoose'
import path from 'path'
import bcrypt from 'bcrypt-nodejs'

let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let UserSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	email: {
		type: String,
		unique: true,
		sparse: true
	},
	phone: {
		type: String,
		unique: true,
		sparse: true
	},
	avatar: {
		type: String,
		default: '/public/avatar/default.png'
	},
	meta: {
		createAt: {
			type: Number,
			default: Date.now()
		},
		updateAt: {
			type: Number,
			default: Date.now()
		}
	},
	description: {
		type: String,
		default: "你永远不知道自己可以做得多好"
	},
	authority: {
		type: Number,
		default: 0
	},
	focus: {
		type: Number,
		default: 0
	}
})

UserSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	if (!this.isModified('password')) {
		return next();
	}

	let hash = bcrypt.hashSync(this.password);
	this.password = hash;

	next();
})

UserSchema.methods = {
	auth: function (_password) {
		return new Promise((resolve, reject) => {
			let hash = this.password;
			let isMatch = bcrypt.compareSync(_password, hash);
			if (isMatch) {
				resolve();
			} else {
				reject({code: 10404, msg: "账号或密码错误"});
			}
		})
	}
}

let User = mongoose.model('User', UserSchema, 'user')

module.exports = User;