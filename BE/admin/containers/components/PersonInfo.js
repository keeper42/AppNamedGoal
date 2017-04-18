import React, { Component, PropTypes } from 'react'
import Avatar from 'material-ui/Avatar'
import { Link } from 'react-router'
import {baseUrl} from '../../config'

import './style/PersonInfo.scss'

class PersonInfo extends Component {
	render() {
		const { user } = this.props;
		const {login, logout} = this.props
		const avatarStyle = {
			maxWidth: '80%',
			height: 'auto',
			margin: '0 auto',
			border: '0.2rem solid rgba(255,255,255,0.5)'
		}
		if (!user.login) {
			user.username = "",
			user.avatar = ""
		}
		return (
			<li className="person-info">
				<Avatar src={baseUrl + user.avatar} style={avatarStyle} size={100} />
				<p id="username"><a href="#">{user.username}</a></p>
				{user.login ? 
				<Link id="logout" onTouchTap={logout}>logout</Link> :
				<Link id="login" onTouchTap={login}>login</Link>
				}
			</li>
		)
	}
}

PersonInfo.PropTypes = {
	avatar: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired
}

export default PersonInfo