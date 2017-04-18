import {fromJS} from 'immutable'

const initialState = {
	pagination: {
		currentPage: 1,
		totlePage: 1,
		rows: 10
	},
	showInfoTable: {
		data: [
		  {
		    loading: "loading...",
		  }
		],
		filterShow: ['loading'],
		selectedAll: false,
		showCheckBox: false
	},
	moduleName: '',
	addContent: false,
	editContent: false,
	delConfirm: false,
	form: {
		formComponent: null,
		data: {},
		formAction: ""
	},
	snackbar: {
		message: "Saving",
		open: false,
		action: "Close",
		autoHideDuration: 3000
	}
}

function generator_new_state(state) {
	let newState = fromJS(state);
	return newState.toJS();
}

function change_select(state, e, isInputChecked) {
	let newState = generator_new_state(state)
	let id = e.target.dataset.id;
	newState.showInfoTable.data[id]._selected = isInputChecked;
	return newState;
}

function selected_all(state, isInputChecked) {
	let newState = generator_new_state(state)
	newState.showInfoTable.data.map((row) => {row._selected = isInputChecked; return row});
	newState.showInfoTable.selectedAll = isInputChecked;
	return newState;
}

function change_page_finish(state, page) {
	let newState = generator_new_state(state)
	// check current page
	let totlePage = newState.pagination.totlePage
	if (totlePage > 0 && page > totlePage) {
		page = totlePage;
	}
	if (page < 1) {
		page = 1;
	}
	newState.pagination.currentPage = page;
	return newState;
}

function toggle_checkbox(state) {
	let newState = generator_new_state(state)
	newState.showInfoTable.showCheckBox = newState.showInfoTable.showCheckBox ? false : true;
	return newState;
}

function delete_selected_finish(state, data) {
	let newState = generator_new_state(state)
	newState.snackbar.open = true;
	newState.snackbar.message = data.msg;
	newState.showInfoTable.showCheckBox = false;
	return newState;
}

function add_content(state) {
	let newState = generator_new_state(state)
	newState.form.formAction = "Publish";
	newState.addContent = true;
	return newState;
}

function close_add_content(state) {
	let newState = generator_new_state(state)
	newState.addContent = false;
	return newState;
}

function edit_form(state, e) {
	let newState = generator_new_state(state)
	newState.form.data[e.target.dataset.name] = e.target.value;
	return newState;
}

function update_table_data(state, data) {
	let newState = generator_new_state(state)
	newState.showInfoTable.data = data;
	return newState;
}

function update_pagination_totlepage(state, page) {
	if (state.pagination.totlePage == page) {
		return state;
	}
	let newState = generator_new_state(state)
	newState.pagination.totlePage = page;
	// check current page
	let totlePage = newState.pagination.totlePage;
	let currentPage = newState.pagination.currentPage;
	if (totlePage > 0 && totlePage < currentPage) {
		newState.pagination.currentPage = totlePage;
	}
	return newState;
}

function saving_form(state) {
	let newState = generator_new_state(state)
	newState.snackbar.open = true;
	newState.snackbar.message = "Saving...";
	return newState;
}

function save_form_finish(state, data) {
	let newState = generator_new_state(state)
	newState.snackbar.open = true;
	newState.snackbar.message = data.msg;
	return newState;
}

function close_snackbar(state) {
	if (state.snackbar.open == false) {
		return state;
	}
	let newState = generator_new_state(state)
	newState.snackbar.open = false;
	return newState;
}

function show_snackbar(state, msg) {
	let newState = generator_new_state(state);
	newState.snackbar.open = true;
	newState.snackbar.message = msg;
	return newState;
}

function close_del_confirm(state) {
	let newState = generator_new_state(state)
	newState.delConfirm = false;
	return newState;
}

function show_del_confirm(state) {
	let newState = generator_new_state(state)
	// 检查是否有选中要删除的数据
	if (state.showInfoTable.data.some(row => row._selected)) {
		newState.delConfirm = true;
		return newState;
	} else {
		newState.snackbar.open = true;
		newState.snackbar.message = "Please select the data to delete";
		return newState;
	}
}

function show_edit_data(state, index) {
	let newState = generator_new_state(state)
	newState.editContent = true;
	newState.form.formAction = "Edit";
	newState.form.data = newState.showInfoTable.data[index];
	return newState;
}

function close_edit_data(state) {
	let newState = generator_new_state(state)
	newState.editContent = false;
	newState.form.data = {};
	return newState;
}

const CHANGE_SELECTED = "CHANGE_SELECTED"
const SELECTED_ALL = "SELECTED_ALL"
const CHANGE_PAGE_FINISH = "CHANGE_PAGE_FINISH"
const TOGGLE_CHECKBOX = "TOGGLE_CHECKBOX"
const DELETE_SELECTED_FINISH = "DELETE_SELECTED_FINISH"
const ADD_CONTENT = "ADD_CONTENT"
const CLOSE_ADD_CONTENT = "CLOSE_ADD_CONTENT"
const EDIT_FORM = "EDIT_FORM"
const UPDATE_TABLE_DATA = "UPDATE_TABLE_DATA"
const UPDATE_PAGINATION_TOTLEPAGE = "UPDATE_PAGINATION_TOTLEPAGE"
const SAVING_FORM = "SAVING_FORM"
const SAVE_FORM_FINISH = "SAVE_FORM_FINISH"
const CLOSE_SNACKBAR = "CLOSE_SNACKBAR"
const SHOW_SNACKBAR = "SHOW_SNACKBAR"
const CLOSE_DEL_CONFIRM = "CLOSE_DEL_CONFIRM"
const SHOW_DEL_CONFIRM = "SHOW_DEL_CONFIRM"
const SHOW_EDIT_DATA = "SHOW_EDIT_DATA"
const CLOSE_EDIT_DATA = "CLOSE_EDIT_DATA"
const UPDATE_STATE = "UPDATE_STATE"

export default function article (state = initialState, action) {
	switch (action.type) {
		case CHANGE_SELECTED:
			return change_select(state, action.e, action.isInputChecked)
		case SELECTED_ALL:
			return selected_all(state, action.isInputChecked)
		case CHANGE_PAGE_FINISH:
			return change_page_finish(state, action.page)
		case TOGGLE_CHECKBOX:
			return toggle_checkbox(state)
		case DELETE_SELECTED_FINISH:
			return delete_selected_finish(state, action.data)
		case ADD_CONTENT:
			return add_content(state)
		case CLOSE_ADD_CONTENT:
			return close_add_content(state)
		case EDIT_FORM:
			return edit_form(state, action.event)
		case UPDATE_TABLE_DATA:
			return update_table_data(state, action.data)
		case UPDATE_PAGINATION_TOTLEPAGE:
			return update_pagination_totlepage(state, action.page)
		case SAVING_FORM:
			return saving_form(state)
		case SAVE_FORM_FINISH:
			return save_form_finish(state, action.data)
		case CLOSE_SNACKBAR:
			return close_snackbar(state)
		case SHOW_SNACKBAR:
			return show_snackbar(state, action.msg)
		case CLOSE_DEL_CONFIRM:
			return close_del_confirm(state)
		case SHOW_DEL_CONFIRM:
			return show_del_confirm(state)
		case SHOW_EDIT_DATA:
			return show_edit_data(state, action.index)
		case CLOSE_EDIT_DATA:
			return close_edit_data(state)
		case UPDATE_STATE:
			return action.state
		default:
			return state
	}
}