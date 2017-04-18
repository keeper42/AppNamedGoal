import mongoose from 'mongoose'

let Schema = mongoose.Schema;

let FeedbackSchema = new Schema({
	content: {
		type: String
	},
	contact: {
		type: String
	},
	hasRead: {
		type: Boolean,
		default: false
	},
	createAt: {
		type: Number,
		default: Date.now()
	}
})

FeedbackSchema.pre('save', function(next) {
	if (this.isNew) {
		this.createAt = Date.now();
	}
	
	next();
})

let Feedback = mongoose.model('Feedback', FeedbackSchema, 'feedback');

module.exports = Feedback;