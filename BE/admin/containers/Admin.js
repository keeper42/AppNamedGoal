import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { connect } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

import Snackbar from 'material-ui/Snackbar'
import Login from './components/Login'
import SideBar from './SideBar'
import * as adminActions from './actions/admin'

injectTapEventPlugin();

import './style/Admin.scss'

class Admin extends Component {
	componentWillMount() {
		this.props.initial_state();
	}

	render() {
		window.document.title = "Goal - 后台管理";
		const {menuMin, history, loginState, user, snackbar} = this.props;
		const {switchMenuView
			, change_username
			, change_password
			, show_login
			, login
			, logout
			, hide_login
			, close_snackbar} = this.props;
		const { isActive } = history;
		return (
			<MuiThemeProvider>
				<div>
					<Snackbar
						open={snackbar.open}
						message={snackbar.message}
						autoHideDuration={snackbar.autoHideDuration}
						onRequestClose={close_snackbar}
					/>
					{user.login ? 
						<div>
							<SideBar login={show_login} logout={logout} user={user} menuMin={menuMin} switchMenuView={switchMenuView} />
							<div className={menuMin?"container max":"container"}>
								{this.props.children}
							</div>
						</div> : 
						<Login {...loginState} onChangeUserName={change_username} onChangePassword={change_password} handleLogin={login} handleCloseLogin={hide_login}/>
					}
				</div>
			</MuiThemeProvider>
		)
	}
}

function mapStateToProps(state) {
	return {
		menuMin: state.admin.menuMin,
		loginState: state.admin.loginState,
		user: state.admin.user,
		snackbar: state.admin.snackbar,
		auth: state.admin.auth
	}
}

export default connect(
	mapStateToProps,
	adminActions
)(Admin)