import React, { Component, PropTypes } from 'react'
import Menu from './Menu'
import PersonInfo from './PersonInfo'

import './style/MenuList.scss'

class MenuList extends Component {

	render() {
		const { user, menuList } = this.props
		const {login, logout} = this.props;

		return (
			<ul className="list-group" id="nav-list">
				<PersonInfo login={login} logout={logout} user={user} />
				{menuList.map((menu, key) => <Menu key={key} focus={menu.focus} link={menu.link} icon={menu.icon} description={menu.description} />
				)}
			</ul>
		)
	}
}

export default MenuList