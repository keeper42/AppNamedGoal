import { fromJS } from 'immutable'

const initialState = {
	menuList: []
}

let generate_new_state = (state) => {
	let newState = fromJS(state);
	return newState.toJS();
}

let update_user_info = (state, data) => {
	let newState = generate_new_state(state);
	newState.user = data;
	return newState;
}

let update_menu_list = (state, data) => {
	let newState = generate_new_state(state);
	newState.menuList = data;
	return newState;
}

const UPDATE_MENU_LIST = "UPATE_MENU_LIST"
const UPDATE_USER_INFO = "UPDATE_USER_INFO"

export default function sideBar(state = initialState, action) {
	switch (action.type) {
		case UPDATE_USER_INFO:
			return update_user_info(state, action.data);
		case UPDATE_MENU_LIST:
			return update_menu_list(state, action.data);
		default:
			return state
	}
}