import {
	baseUrl,
	feedbackDataUrl,
	feedbackMarkReadUrl
} from './../../config'

const FETCH_DATA = "FETCH_DATA"
const DELETE_DATA = "DELETE_DATA"
const MARK_READ = "MARK_READ"
const MARK_UNREAD = "MARK_UNREAD"

export function fetch_data() {
	return (dispatch, getState) => {
		window.fetch(`${baseUrl}${feedbackDataUrl}`, {
			method: 'GET',
			headers: {
				authorization: window.localStorage.getItem('token')
			}
		}).then(response => {
			if (response.ok) {
				response.json().then(data => {
					if (data.code == 10000) {
						dispatch({
							type: FETCH_DATA,
							data: data.data
						})
					}
				})
			}
		})
	}
}

export function delete_feedback(id) {
	return (dispatch, getState) => {
		window.fetch(`${baseUrl}${feedbackDataUrl}/${id}`, {
			method: 'DELETE',
			headers: {
				authorization: window.localStorage.getItem('token')
			}
		}).then(response => {
			if (response.ok) {
				response.json().then(data => {
					if (data.code == 10000) {
						dispatch({
							type: DELETE_DATA,
							data: id
						})
					}
				})
			}
		})
	}
}

export function mark_read(id) {
	return (dispatch, getState) => {
		window.fetch(`${baseUrl}${feedbackMarkReadUrl}/${id}`, {
			method: 'POST',
			headers: {
				authorization: window.localStorage.getItem('token')
			}
		}).then(response => {
			if (response.ok) {
				response.json().then(data => {
					if (data.code == 10000) {
						dispatch({
							type: MARK_READ,
							data: id
						})
					}
				})
			}
		})
	}
}

export function mark_unread(id) {
	return (dispatch, getState) => {
		window.fetch(`${baseUrl}${feedbackMarkReadUrl}/${id}`, {
			method: 'DELETE',
			headers: {
				authorization: window.localStorage.getItem('token')
			}
		}).then(response => {
			if (response.ok) {
				response.json().then(data => {
					if (data.code == 10000) {
						dispatch({
							type: MARK_UNREAD,
							data: id
						})
					}
				})
			}
		})
	}
}