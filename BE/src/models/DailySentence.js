import mongoose from 'mongoose'

let Schema = mongoose.Schema

let DailySentenceSchema = new Schema({
	sentence: {
		type: String
	},
	backImg: {
		type: String
	}
})

let DailySentence = mongoose.model('DailySentence', DailySentenceSchema, 'dailySentence')

module.exports = DailySentence