import mongoose from 'mongoose'

let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

let FollowSchema = new Schema({
	user: {
		type: ObjectId,
		ref: 'User'
	},
	follower: {
		type: ObjectId,
		ref: 'User'
	},
	createAt: {
		type: Number,
		default: Date.now()
	}
})

FollowSchema.pre('save', function(next) {
	if (this.isNew) {
		this.createAt = Date.now();
	}
	next();
})

let Follow = mongoose.model('Follow', FollowSchema, 'follow');

module.exports = Follow;