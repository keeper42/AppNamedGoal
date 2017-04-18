import mongoose from 'mongoose'

let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let NoteSchema = new Schema({
	user: {
		type: ObjectId,
		ref: 'User'
	},
	content: {
		type: String
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
	delete: {
		type: Boolean,
		default: false
	}
})

NoteSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	next();
})

let Note = mongoose.model('Note', NoteSchema, 'note');

module.exports = Note;