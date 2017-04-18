import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'

import Admin from './containers/Admin'
import ModuleController from './containers/ModuleController'

module.exports = (
	<Route path='admin' component={Admin}>
		<IndexRedirect to="Server"/>
		<Route path="Server" component={ModuleController} />
		<Route path="User" component={ModuleController} />
		<Route path="DailySentence" component={ModuleController} />
		<Route path="Feedback" component={ModuleController} />
	</Route>
)