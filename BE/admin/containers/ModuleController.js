// react
import React, {Component, PropTypes} from 'react'
// redux
import {connect} from 'react-redux'

import CommonModule from './CommonModule'
import Server from './Server'
import Feedback from './Feedback'

import UserForm from './components/UserForm'
import SentenceForm from './components/SentenceForm'

import {
	userTableDataUrl,
	userDataCountUrl,

	sentenceTableDataUrl,
	sentenceDataCountUrl
} from './../config'

class ModuleController extends Component {
	componentWillMount() {
		this.moduleState = {
			User: {
				pagination: {
					currentPage: 1,
					totlePage: 1,
					rows: 10
				},
				showInfoTable: {
					data: [
						{
							name: "loading...",
							descriptioin: 'loading...'
						}
					],
					filterShow: ['name', 'description'],
					selectedAll: false,
					showCheckBox: false
				},
				moduleName: 'User',
				tableDataUrl: userTableDataUrl,
				dataCountUrl: userDataCountUrl,
				addContent: false,
				editContent: false,
				delConfirm: false,
				form: {
					formComponent: UserForm,
					data: {},
					formAction: "Publish"
				},
				snackbar: {
					message: "Saving",
					open: false,
					action: "Close",
					autoHideDuration: 3000
				}
			},
			DailySentence: {
				pagination: {
					currentPage: 1,
					totlePage: 1,
					rows: 10
				},
				showInfoTable: {
					data: [
						{
							sentence: "loading...",
							backImg: 'loading...'
						}
					],
					filterShow: ['sentence', 'backImg'],
					selectedAll: false,
					showCheckBox: false
				},
				moduleName: 'Sentence',
				tableDataUrl: sentenceTableDataUrl,
				dataCountUrl: sentenceDataCountUrl,
				addContent: false,
				editContent: false,
				delConfirm: false,
				form: {
					formComponent: SentenceForm,
					data: {},
					formAction: "Publish"
				},
				snackbar: {
					message: "Saving",
					open: false,
					action: "Close",
					autoHideDuration: 3000
				}
			}
		}

		this.module = {
			Server: <Server />,
			Feedback: <Feedback />,
			CommonModule: <CommonModule 
				updateModuleState={(state) => this.moduleState[state.moduleName] = state} 
				changeStateMethod={(method) => this.changeModule = method} 
				/>
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		let path = nextProps.route.path;
		return (path != this.props.route.path);
	}

	updateCommonModuleState() {
		let path = this.props.route.path;
		if (path in this.moduleState) {
			this.changeModule(this.moduleState[path]);
		}
	}

	componentDidUpdate() {
		this.updateCommonModuleState();
	}

	componentDidMount() {
		this.updateCommonModuleState();
	}

	render() {
		let path = this.props.route.path;
		let module;
		switch (path) {
			case 'User':
				module = 'CommonModule'
				break;
			case 'DailySentence':
				module = 'CommonModule'
				break;
			default:
				module = path
		}

		if (module in this.module) {
			return this.module[module];
		} else {
			return <p>404 Not found</p>
		}
	}
}

export default ModuleController;