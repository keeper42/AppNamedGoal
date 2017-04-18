import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import './style/Menu.scss'

class Menu extends Component {

	handleFocus(e) {
		e.target.blur();
	}

	render() {
		const { link, icon, description, style } = this.props
		const linkStyle = {
			textDecoration: 'none'
		}
		return (
			<li className="list" style={style}>
				<Link style={linkStyle} onFocus={this.handleFocus} onlyActiveOnIndex={true} to={link} activeClassName="menu-focus">
					<i className={"fa " + icon}></i>
					<span>{description}</span>
				</Link>
			</li>
		)
	}
}

Menu.PropTypes = {
	link: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired
}

export default Menu