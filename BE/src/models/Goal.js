import mongoose from 'mongoose'

let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let GoalSchema = new Schema({
	user: { // 创建该目标的用户
		type: ObjectId,
		ref: 'User'
	},
	title: { // 目标标题
		type: String
	},
	content: { // 目标内容
		type: String
	},
	createAt: {
		type: Number,
		default: Date.now()
	}
})

GoalSchema.pre('save', function(next) {
	if (this.isNew) this.createAt = Date.now();
	next();
})

let Goal = mongoose.model('Goal', GoalSchema, 'goal')

module.exports = Goal;