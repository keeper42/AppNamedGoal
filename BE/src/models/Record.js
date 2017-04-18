import mongoose from 'mongoose'

let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let RecordSchema = new Schema({
	user: {
		type: ObjectId,
		ref: 'User'
	},
	date: {
		type: Number
	},
	dailySentence: {
		type: ObjectId,
		ref: 'DailySentence'
	},
	goalsFinished: {
		type: Array,
		default: []
	}
})

let Record = mongoose.model('Record', RecordSchema, 'record');

module.exports = Record;