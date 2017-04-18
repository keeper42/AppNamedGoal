import mongoose from 'mongoose'

let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

let FocusTimeSchema = new Schema({
	user: {
		type: ObjectId
	},
	begin: {
		type: Number
	},
	length: {
		type: Number
	}
})

let FocusTime = mongoose.model('FocusTime', FocusTimeSchema, 'focusTime');

module.exports = FocusTime;