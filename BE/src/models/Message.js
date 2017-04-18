import mongoose from 'mongoose'

let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

let MessageSchema = new Schema({
	user: {
		type: ObjectId,
		ref: 'User'
	},
	sender: {
		type: ObjectId,
		ref: 'User'
	},
	content: {
		type: String,
		default: ''
	},
	createAt: {
		type: Number,
		default: Date.now()
	},
	hasRead: {
		type: Boolean,
		default: false
	}
})

MessageSchema.pre('save', function(next) {
	if (this.isNew) {
		this.createAt = Date.now();
	}
	next();
})

let Message = mongoose.model('Message', MessageSchema, 'message');

module.exports = Message;