import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import MenuList from './components/MenuList'
import MenuControl from './components/MenuControl'

import './style/SideBar.scss'

import { Link } from 'react-router'

import * as sideBarActions from './actions/sideBar'

class SideBar extends Component {
	componentWillMount() {
		this.props.update_menu_list();
	}

	componentWillReceiveProps(nextProps) {
		let nextUser = nextProps.user;
		let user = this.props.user;
		if (this.props.authList != nextProps.authList || nextUser.login != user.login || nextUser.username != user.username) {
			this.props.update_menu_list(this.props.authList);
		}
	}

	render() {
		const {user, menuList, menuMin} = this.props
		const {switchMenuView, login, logout} = this.props;

		return (
			<nav className={menuMin?"min-nav":""}>
				<MenuControl switchMenuView={switchMenuView} />
				<MenuList login={login} logout={logout} user={user} menuList={menuList} />
			</nav>
		)
	}
}

SideBar.PropTypes = {
	switchMenuView: PropTypes.func.isRequired,
	menuList: PropTypes.array.isRequired
}

function mapStateToProps(state) {
	return {
		menuList: state.sideBar.menuList
	}
}

export default connect(
	mapStateToProps,
	sideBarActions,
	null,
	{pure: false}
)(SideBar)