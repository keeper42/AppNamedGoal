import mongoose from 'mongoose'

let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let AuthenticationOauthSchema = new Schema({
	user: {
		type: ObjectId,
		ref: 'User'
	},
	oauthName: {
		type: String
	},
	oauthToken: {
		type: String
	},
	oauthAccessToken: {
		type: String
	},
	oauthExpires: {
		type: String
	}
})

let AuthenticationOauth =  mongoose.model('AuthenticationOauth', AuthenticationOauthSchema, 'authenticationOauth');

module.exports = AuthenticationOauth;