import mongoose from 'mongoose'

let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let TokenSchema = new Schema({
	token: {
		type: String,
		require: true,
		unique: true
	},
	expire: {
		type: Number,
		require: true
	},
	user: {
		type: ObjectId,
		ref: 'User',
		require: true
	},
	used: {
		type: Boolean,
		require: true,
		default: false
	}
})

let Token =  mongoose.model('Token', TokenSchema, 'token')

module.exports = Token;