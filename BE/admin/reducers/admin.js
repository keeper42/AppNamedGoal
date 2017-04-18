import { fromJS } from 'immutable'

const initialState = {
	baseUrl: 'http://192.168.199.66:8000',
	loginUrl: '/api/login',
	logoutUrl: '/api/logout',
	authListUrl: '/api/authentication/auth',
	userInfoUrl: '/api/authentication/user',
	menuMin: false,
	loginState: {
		open: false,
		username: "",
		password: ""
	},
	user: {
		login: false,
		avatar: "/images/avatar.png",
		username: "loading..."
	},
	snackbar: {
		open: false,
		message: '',
		autoHideDuration: 2000
	}
}

let generate_new_state = (state) => {
	let newState = fromJS(state);
	return newState.toJS();
}

let switchMenuView = (state) => {
	let containerMax = state.menuMin?false:true
	let newState = generate_new_state(state)
	newState.menuMin = containerMax
	return newState
}

let show_login = (state) => {
	let newState = generate_new_state(state)
	newState.loginState.open = true;
	return newState;
}

let hide_login = (state) => {
	let newState = generate_new_state(state)
	newState.loginState.open = false;
	return newState;
}

let change_username = (state, username) => {
	let newState = generate_new_state(state);
	newState.loginState.username = username;
	return newState;
}

let change_password = (state, password) => {
	let newState = generate_new_state(state);
	newState.loginState.password = password;
	return newState;
}

let login = (state, data) => {
	let newState = generate_new_state(state);
	if (data.state) {
		newState.user = {
			login: true,
			avatar: data.avatar,
			username: data.username
		}
	} else {
		newState.snackbar.message = data.msg;
		newState.snackbar.open = true;
		newState.loginState.open = true;
	}
	return newState;
}

let logout = (state) => {
	let newState = generate_new_state(state);
	newState.user = {
		login: false,
		avatar: "",
		username: ""
	}
	return newState;
}

let close_admin_snackbar = (state) => {
	let newState = generate_new_state(state);
	newState.snackbar.open = false;
	return newState;
}

let show_admin_snackbar = (state, msg) => {
	let newState = generate_new_state(state);
	newState.snackbar.open = true;
	newState.snackbar.message = msg;
	return newState;
}

let initial_state_finish = (state, data) => {
	let newState = generate_new_state(state);
	if (data.user) {
		newState.user = data.user;
	} else {
		newState.user = {
			login: false,
			username: '',
			avatar: ''
		};
		newState.loginState.open = true;
	}
	return newState;
}

const SWITCH_MENU_VIEW = "SWITCH_MENU_VIEW"
const LOGIN_FINISH = "LOGIN_FINISH"
const LOGOUT_FINISH = "LOGOUT_FINISH"
const SHOW_LOGIN = "SHOW_LOGIN"
const HIDE_LOGIN = "HIDE_LOGIN"
const CHANGE_USERNAME = "CHANGE_USERNAME"
const CHANGE_PASSWORD = "CHANGE_PASSWORD"
const CLOSE_ADMIN_SNACKBAR = "CLOSE_ADMIN_SNACKBAR"
const SHOW_ADMIN_SNACKBAR = "SHOW_ADMIN_SNACKBAR"
const INITIAL_STATE_FINISH = "INITIAL_STATE_FINISH"

export default function admin (state = initialState, action) {
	switch (action.type) {
		case SWITCH_MENU_VIEW:
			return switchMenuView(state)
		case SHOW_LOGIN:
			return show_login(state)
		case HIDE_LOGIN:
			return hide_login(state)
		case CHANGE_USERNAME:
			return change_username(state, action.data)
		case CHANGE_PASSWORD:
			return change_password(state, action.data)
		case LOGIN_FINISH:
			return login(state, action.data)
		case LOGOUT_FINISH:
			return logout(state)
		case CLOSE_ADMIN_SNACKBAR:
			return close_admin_snackbar(state);
		case SHOW_ADMIN_SNACKBAR:
			return show_admin_snackbar(state, action.msg);
		case INITIAL_STATE_FINISH:
			return initial_state_finish(state, action.data);
		default:
			return state
	}
}