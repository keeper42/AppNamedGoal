import React, {Component, PropTypes} from 'react'
// redux
import {connect} from 'react-redux'

import * as serverActions from './actions/server'

class Server extends Component {

	render() {

		return (
			<div>Server</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		server: state.server
	}
}

export default connect(
	mapStateToProps,
	serverActions
)(Server)