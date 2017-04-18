import { combineReducers } from 'redux'
import admin from './admin'
import commonModule from './commonModule'
import sideBar from './sideBar'
import feedback from './feedback'
import server from './server'

const rootReducer = combineReducers({
	admin,
	commonModule,
	sideBar,
	feedback,
	server
})

export default rootReducer