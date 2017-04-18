import mongoose from 'mongoose'

let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

let CommentLikeMapSchema = new Schema({
	user: {
		type: ObjectId,
		ref: 'User'
	},
	comment: {
		type: ObjectId,
		ref: 'Comment'
	}
})

let CommentLikeMap = mongoose.model('CommentLikeMap', CommentLikeMapSchema, 'commentLikeMap');

module.exports = CommentLikeMap;