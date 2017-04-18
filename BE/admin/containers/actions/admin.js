import {
	baseUrl,
	userInfoUrl,
	loginUrl,
	logoutUrl
} from './../../config'

const SWITCH_MENU_VIEW = "SWITCH_MENU_VIEW"
const LOGIN = "LOGIN"
const LOGIN_FINISH = "LOGIN_FINISH"
const LOGOUT = "LOGOUT"
const LOGOUT_FINISH = "LOGOUT_FINISH"
const SHOW_LOGIN = "SHOW_LOGIN"
const HIDE_LOGIN = "HIDE_LOGIN"
const CHANGE_USERNAME = "CHANGE_USERNAME"
const CHANGE_PASSWORD = "CHANGE_PASSWORD"
const CLOSE_ADMIN_SNACKBAR = "CLOSE_ADMIN_SNACKBAR"
const SHOW_ADMIN_SNACKBAR = "SHOW_ADMIN_SNACKBAR"
const INITIAL_STATE = "INITIAL_STATE"
const INITIAL_STATE_FINISH = "INITIAL_STATE_FINISH"

export function initial_state_finish(data) {
	return {
		type: INITIAL_STATE_FINISH,
		data: data
	}
}

export function initial_state() {
	return (dispatch, getState) => {
		let token = window.localStorage.getItem('token');
		if (token === null) {
			dispatch(initial_state_finish({}))
			dispatch(show_login());
			return ;
		}
		window.fetch(`${baseUrl}${userInfoUrl}`, {
			method: 'get',
			headers: {
	    	authorization: token
			}
		}).then(response => {
			if (response.ok) {
				response.json().then(data => {
					if (data.code == 10000) {
						let user = data.data;
						if (user.authority == 666) {
							dispatch(initial_state_finish({
								user: {
									login: true,
									username: user.username,
									avatar: user.avatar
								}
							}));
						} else {
							window.localStorage.removeItem('token');
							dispatch(show_snackbar("当前用户权限不足"));
							dispatch(initial_state_finish({}));
						}
					} else {
						console.log(data);
						window.localStorage.removeItem('token');
						dispatch(show_snackbar("登录超时，请重新登录"));
						dispatch(initial_state_finish({}))
					}
				})
			} else {
				dispatch(show_snackbar("response error"));
			}
		}, err => {
			dispatch(show_snackbar("连接服务器失败"));
		})
	}
}

export function show_snackbar(msg) {
	return {
		type: SHOW_ADMIN_SNACKBAR,
		msg: msg
	}
}

export function close_snackbar() {
	return {
		type: CLOSE_ADMIN_SNACKBAR
	}
}

export function logout_finish() {
	return {
		type: LOGOUT_FINISH
	}
}

export function logout() {
	return (dispatch, getState) => {
		let token = window.localStorage.getItem('token');
		window.fetch(`${baseUrl}${logoutUrl}`, {
			method: 'get',
			headers: {
				authorization: token
			}
		}).then(response => {
			window.localStorage.removeItem('token');
			dispatch(initial_state_finish({})); // login again
		}, err => {
			console.log(err);
		}).then(() => {
			dispatch(logout_finish());
		})
	}
}

export function login_finish(data) {
	return {
		type: LOGIN_FINISH,
		data: data
	}
}

export function login() {
	return (dispatch, getState) => {
		dispatch(hide_login());
		let result = {
			state: false,
			msg: ''
		};
		let username = getState().admin.loginState.username;
		let password = getState().admin.loginState.password;
		let paramStr = `account=${username}&password=${password}`;
		window.fetch(`${baseUrl}${loginUrl}`, {
			method: 'POST',
			headers: {
	      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
			},
			body: paramStr
		}).then(response => {
			let token = response.headers.get('authorization');
			if (response.ok) {
				response.json().then(data => {
					if (data.code == 10000) {
						let user = data.data;
						if (user.authorization != 666) {
							result.msg = "当前用户权限不足";
							dispatch(login_finish(result));
						} else {
							result.state = true;
							result.username = user.username;
							result.avatar = user.avatar;
							result.msg = "登录成功";
							dispatch(login_finish(result));
							window.localStorage.setItem('token', token);
						}
					} else {
						result.msg = data.msg;
						dispatch(login_finish(result));
					}
				})
			} else {
				result.msg = "连接服务器失败";
				dispatch(login_finish(result));
			}
		}, err => {
			result.msg = "连接服务器失败";
			dispatch(login_finish(result));
		})
	}
}

export function change_username(e) {
	return {
		type: CHANGE_USERNAME,
		data: e.target.value
	}
}

export function change_password(e) {
	return {
		type: CHANGE_PASSWORD,
		data: e.target.value
	}
}

export function show_login() {
	return {
		type: SHOW_LOGIN
	}
}

export function hide_login() {
	return {
		type: HIDE_LOGIN
	}
}

export function switchMenuView() {
	return {
		type: SWITCH_MENU_VIEW
	}
}	