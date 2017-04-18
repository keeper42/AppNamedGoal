import {
	baseUrl
} from './../../config'

const CHANGE_SELECTED = "CHANGE_SELECTED"
const SELECTED_ALL = "SELECTED_ALL"
const CHANGE_PAGE = "CHANGE_PAGE"
const CHANGE_PAGE_FINISH = "CHANGE_PAGE_FINISH"
const TOGGLE_CHECKBOX = "TOGGLE_CHECKBOX"
const DELETE_SELECTED_FINISH = "DELETE_SELECTED_FINISH"
const DELETE_SELECTED = "DELETE_SELECTED"
const ADD_CONTENT = "ADD_CONTENT"
const CLOSE_ADD_CONTENT = "CLOSE_ADD_CONTENT"
const EDIT_FORM = "EDIT_FORM"
const FETCH_TABLE_DATA = "FETCH_TABLE_DATA"
const UPDATE_TABLE_DATA = "UPDATE_TABLE_DATA"
const FETCH_PAGINATION_TOTLEPAGE = "FETCH_PAGINATION_TOTLEPAGE"
const UPDATE_PAGINATION_TOTLEPAGE = "UPDATE_PAGINATION_TOTLEPAGE"
const SAVE_FORM = "SAVE_FORM"
const SAVING_FORM = "SAVING_FORM"
const SAVE_FORM_FINISH = "SAVE_FORM_FINISH"
const SHOW_SNACKBAR = "SHOW_SNACKBAR"
const CLOSE_SNACKBAR = "CLOSE_SNACKBAR"
const CLOSE_DEL_CONFIRM = "CLOSE_DEL_CONFIRM"
const SHOW_DEL_CONFIRM = "SHOW_DEL_CONFIRM"
const SHOW_EDIT_DATA = "SHOW_EDIT_DATA"
const CLOSE_EDIT_DATA = "CLOSE_EDIT_DATA"
const EDIT_DATA = "EDIT_DATA"
const UPDATE_STATE = "UPDATE_STATE"
const UPDATE_STATE_AND_DATA = "UPDATE_STATE_AND_DATA"

export function update_state(state) {
	return {
		type: UPDATE_STATE,
		state: state
	}
}
export function update_state_and_data(state) {
	return (dispatch, getState) => {
		dispatch(update_state(state));
		dispatch(fetch_pagination_totlepage());
	}
}

export function close_edit_data() {
	return {
		type: CLOSE_EDIT_DATA
	}
}

export function show_edit_data(index) {
	return {
		type: SHOW_EDIT_DATA,
		index: index
	}
}

export function edit_data() {
	return (dispatch, getState) => {
		let url = getState().commonModule.tableDataUrl;
		let param = getState().commonModule.form.data;
		let articleId = param._id;
		dispatch(close_edit_data());
		dispatch(saving_form());
		// 拼接参数
		let paramStr ="";
		for (let key in param) {
			let value = encodeURIComponent(param[key]);
			paramStr += `${key}=${value}&`;
		}
		window.fetch(`${baseUrl}${url}/${articleId}`, {
			method: "PUT",
			headers: {
	      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
	      authorization: window.localStorage.getItem('token')
			},
			body: paramStr
		}).then((response) => {
			if (response.ok) {
				response.json().then(data => {
					if (data.code == 10000) {
						dispatch(save_form_finish(data));
						dispatch(fetch_table_data());
					} else {
						dispatch(show_snackbar(data.msg));
					}
				})
			} else {
				dispatch(save_form_finish({msg: 'response: error in edit data'}));
			}
		}, (err) => {
			dispatch(save_form_finish({msg: 'error in edit data'}));
		})
	}
}

export function show_del_confirm() {
	return {
		type: SHOW_DEL_CONFIRM
	}
}

export function close_del_confirm() {
	return {
		type: CLOSE_DEL_CONFIRM
	}
}

export function show_snackbar(data) {
	return {
		type: SHOW_SNACKBAR,
		msg: data
	}
}

export function close_snackbar() {
	return {
		type: CLOSE_SNACKBAR
	}
}

export function save_form_finish(data) {
	return {
		type: SAVE_FORM_FINISH,
		data: data
	}
}

export function saving_form() {
	return {
		type: SAVING_FORM
	}
}

export function save_form() {
	return (dispatch, getState) => {
		dispatch(close_add_content());
		dispatch(saving_form());
		let url = getState().commonModule.tableDataUrl;
		let param = getState().commonModule.form.data;
		// 拼接参数
		let paramStr ="";
		for (let key in param) {
			let value = encodeURIComponent(param[key]);
			paramStr += `${key}=${value}&`;
		}
		paramStr = paramStr.substr(0, paramStr.length - 1);
		window.fetch(baseUrl + url, {
			method: 'POST',
			headers: {  
	      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
	      authorization: window.localStorage.getItem('token')
			},
			body: paramStr
		}).then((response) => {
			if (response.ok) {
				response.json().then(data => {
					dispatch(save_form_finish(data));
					if (data.code == 10000) {
						dispatch(fetch_pagination_totlepage());
						dispatch(fetch_table_data());
						// fetch_pagination_totlepage()(dispatch, getState)();
						// fetch_table_data()(dispatch, getState)();
					} else if (data.code == 10031) {
						dispatch(show_snackbar(data.msg));
					}
				})
			} else {
				dispatch(save_form_finish({msg: 'response: save failed'}));
			}
		}, err => {
			dispatch(save_form_finish({msg: 'save failed'}));
		})
	}
}

export function update_pagination_totlepage(page) {
	return {
		type: UPDATE_PAGINATION_TOTLEPAGE,
		page: page
	}
}

let fetch_pagination_totlepage = () => {
	return (dispatch, getState) => {
		let rows = getState().commonModule.pagination.rows;
		let url = getState().commonModule.dataCountUrl;
		window.fetch(baseUrl + url, {
			headers: {
	      authorization: window.localStorage.getItem('token')
			}
		}).then((response) => {
			if (response.ok) {
				response.json().then(data => {
					if (data.code == 10000) {
						dispatch(update_pagination_totlepage(Math.ceil(parseInt(data.data) / rows)));
						dispatch(fetch_table_data());
					} else {
						dispatch(show_snackbar(data.msg));						
					}
				})
			} else {
				console.log("error in fetch pagination totlepage");
			}
		},
		err => {
			console.log(err);
		})
	}
}
exports.fetch_pagination_totlepage = fetch_pagination_totlepage;

export function update_table_data(data) {
	return {
		type: UPDATE_TABLE_DATA,
		data: data
	}
}

let fetch_table_data = () => {
	return (dispatch, getState) => {
		let page = getState().commonModule.pagination.currentPage;
		let rows = getState().commonModule.pagination.rows;
		let url = getState().commonModule.tableDataUrl;
		if (window.localStorage.getItem('token') === null) {
			return ;
		}
		window.fetch(`${baseUrl}${url}?page=${page}&rows=${rows}`, {
			headers: {
	      authorization: window.localStorage.getItem('token')
			}
		}).then((response) => {
			if (response.ok) {
				response.json().then((data) => {
					if (data.code == 10031) {
						dispatch(show_snackbar(data.msg));
					} else {
						dispatch(update_table_data(data.data));							
					}
				})
			} else {
				console.log("error in fetch table data");
			}
		},
		err => {
			console.log(err);
		})
	}
}
exports.fetch_table_data = fetch_table_data;

export function edit_form(event) {
	return {
		type: EDIT_FORM,
		event: event
	}
}

export function change_selected(e, isInputChecked) {
	return {
		type: CHANGE_SELECTED,
		e: e,
		isInputChecked: isInputChecked
	}
}

export function selected_all(e, isInputChecked) {
	return {
		type: SELECTED_ALL,
		isInputChecked: isInputChecked
	}
}

export function change_page_finish(page) {
	return {
		type: CHANGE_PAGE_FINISH,
		page: page
	}
}
export function change_page(page) {
	return (dispatch, getState) => {
		dispatch(change_page_finish(page));
		dispatch(fetch_table_data());
	}
}

export function toggle_checkbox() {
	return {
		type: TOGGLE_CHECKBOX
	}
}

export function delete_selected_finish(data) {
	return {
		type: DELETE_SELECTED_FINISH,
		data: data
	}
}

export function delete_selected() {
	return (dispatch, getState) => {
		dispatch(close_del_confirm());
		let url = getState().commonModule.tableDataUrl;
		let checkBox = getState().commonModule.showInfoTable.data;
		let promiseList = [];
		checkBox.map(row => {
			if (row._selected) {
				let rowId = row._id;
				promiseList.push(
					new Promise((resolve, reject) => {
						window.fetch(`${baseUrl}${url}/${rowId}`, {
							method: 'DELETE',
							headers: {
					      authorization: window.localStorage.getItem('token')
							}
						}).then((response) => {
							if (response.ok) {
								response.json().then((data) => {
									if (data.code == 10031) {
										dispatch(show_snackbar(data.msg));
									} else {
										dispatch(delete_selected_finish(data));						
									}
								})
								resolve();
							} else {
								dispatch(delete_selected_finish({msg: `error in delete ${rowId}`}));
								resolve();
							}
						},
						err => {
							dispatch(delete_selected_finish({msg: err}));
							resolve();
						})
					})
				)
			}
		})
		if (promiseList.length != 0) {
			// update table and pagination data
			Promise.all(promiseList).then(() => {
				dispatch(fetch_pagination_totlepage());
			})
		}
	}
}

export function add_content() {
	return {
		type: ADD_CONTENT
	}
}

export function close_add_content() {
	return {
		type: CLOSE_ADD_CONTENT
	}
}