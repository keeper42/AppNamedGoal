import {fromJS} from 'immutable'

const initialState = {
	data: [
		{
			_id: '123123123',
			content: "反馈内容反馈内容反馈内容反馈内反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容容",
			contact: '13043406606',
			createAt: '2015-05-05',
			hasRead: false
		},
		{
			_id: '123123123',
			content: "反馈内容反馈内容反馈内容反馈内反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容容",
			contact: '13043406606',
			createAt: '2015-05-05',
			hasRead: true
		}
	]
}

let generate_new_state = (state) => {
	let newState = fromJS(state);
	return newState.toJS();
}

let update_data = (state, data) => {
	let newState = generate_new_state(state);
	newState.data = data;
	return newState;
}

let delete_data = (state, id) => {
	let newState = generate_new_state(state);
	newState.data = newState.data.filter(row => row._id != id);
	return newState;
}

let mark_read = (state, id) => {
	let newState = generate_new_state(state);
	for (var i = 0; i < newState.data.length; i++) {
		if (newState.data[i]._id == id) {
			newState.data[i].hasRead = true;
			break;
		}
	}
	return newState;
}

let mark_unread = (state, id) => {
	let newState = generate_new_state(state);
	for (var i = 0; i < newState.data.length; i++) {
		if (newState.data[i]._id == id) {
			newState.data[i].hasRead = false;
			break;
		}
	}
	return newState;
}

const FETCH_DATA = "FETCH_DATA"
const DELETE_DATA = "DELETE_DATA"
const MARK_READ = "MARK_READ"
const MARK_UNREAD = "MARK_UNREAD"

export default function server(state = initialState, action) {
	switch (action.type) {
		case FETCH_DATA:
			return update_data(state, action.data);
		case DELETE_DATA:
			return delete_data(state, action.data);
		case MARK_READ:
			return mark_read(state, action.data);
		case MARK_UNREAD:
			return mark_unread(state, action.data);
		default :
			return state;
	}
}