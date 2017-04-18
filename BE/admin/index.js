import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'

import routes from './routes'
import configureStore from './store/configureStore'

const store = configureStore()

if (module.hot) {
	module.hot.accept();
}

render(
	<Provider store={store}>
		<Router routes={routes} history={browserHistory}/>
	</Provider>,
	document.getElementById('app')
)