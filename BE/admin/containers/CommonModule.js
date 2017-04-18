// react
import React, { Component, PropTypes } from 'react'
// redux
import { connect } from 'react-redux'
import * as commonModuleActions from './actions/commonModule'
// material ui
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import Snackbar from 'material-ui/Snackbar'

import TextField from 'material-ui/TextField'
import AutoComplete from 'material-ui/AutoComplete'

import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ContentDelete from 'material-ui/svg-icons/action/delete-forever';

import ShowInfoTable from './components/ShowInfoTable'
import Pagination from './components/Pagination'

const floatRightDown = {
	position: 'fixed',
	bottom: '5em',
	right: '5em'
}

const floatingButtonStyle = {
	margin: '1em'
}

class CommonModule extends Component {
	componentWillMount() {
		this.props.changeStateMethod(this.props.update_state_and_data);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.state.moduleName != '') {
			this.props.updateModuleState(this.props.state);
		}
	}

	render() {
		const {showInfoTable, moduleName, pagination, addContent, form, filterShow, snackbar, delConfirm, editContent} = this.props.state;
		const {change_selected, selected_all, change_page, toggle_checkbox, delete_selected, add_content, close_add_content,
		 edit_form, fetch_table_data, save_form, close_snackbar, show_del_confirm, close_del_confirm, show_edit_data, close_edit_data, edit_data} = this.props;

		if (form.formComponent == null) {
			return (<p>initial...</p>)
		}

		const actions = [
			<FlatButton
				label="CANCEL"
				secondary={true}
				onTouchTap={editContent ? close_edit_data : close_add_content}
			/>,
			<FlatButton
				label="SAVE"
				primary={true}
				onTouchTap={editContent ? edit_data : save_form}
			/>,
		]

		const delConfirmActoins = [
			<FlatButton
				label="CANCEL"
				primary={true}
				onTouchTap={close_del_confirm}
			/>,
			<FlatButton
				label="DELETE"
				secondary={true}
				onTouchTap={delete_selected}
			/>,
		]

		const dialogContentStyle = {
		  width: '100%',
		  maxWidth: 'none'
		};

		const floatRightDownButtons = [];
		floatRightDownButtons.push(
			<FloatingActionButton key="ADD" onTouchTap={add_content} style={floatingButtonStyle}>
	  		<ContentAdd />
	  	</FloatingActionButton>
	  );
		if (!showInfoTable.showCheckBox) {
			floatRightDownButtons.push(
				<FloatingActionButton 
				 	key="DELETE"
					style={floatingButtonStyle}
					onTouchTap={showInfoTable.showCheckBox ? show_del_confirm : toggle_checkbox}
					secondary={true}
				>
					<ContentRemove />
				</FloatingActionButton>
			)
		} else {
			floatRightDownButtons.push(
				<FloatingActionButton 
				 	key="DELETE"
					style={floatingButtonStyle}
					onTouchTap={showInfoTable.showCheckBox ? show_del_confirm : toggle_checkbox}
					secondary={true}
				>
					<ContentDelete />
				</FloatingActionButton>
			);
			floatRightDownButtons.push(
				<FloatingActionButton 
				 	key="RETURN"
					style={floatingButtonStyle} 
					onTouchTap={toggle_checkbox} 
					mini={true} 
					secondary={true} 
				>
					<ContentClear />
				</FloatingActionButton>
			)
		}

		return (
			<div>
				<h3>{moduleName}</h3>
				<Snackbar
					open={snackbar.open}
					message={snackbar.message}
					action={snackbar.action}
					autoHideDuration={snackbar.autoHideDuration}
					onActionTouchTap={close_snackbar}
					onRequestClose={close_snackbar}
				/>
				<Dialog
					title={`Delete ${moduleName}`}
					open={delConfirm}
					actions={delConfirmActoins}
				>
				<p>Delete all the selected data?</p>
				</Dialog>
				<Dialog
					title={`${form.formAction} ${moduleName}`}
					open={addContent || editContent}
					actions={actions}
					contentStyle={dialogContentStyle}
					autoScrollBodyContent={true}
				>
				{React.createElement(
					form.formComponent,
					{handleChange: edit_form, ...form.data}
				)}
				</Dialog>
				<ShowInfoTable 
					filterShow={filterShow}
					selected_all={selected_all} 
					change_selected={change_selected}
					show_edit_data={show_edit_data}
					{...showInfoTable} 
				/>
			  <Pagination {...pagination} changePage={change_page} />
			  <div style={floatRightDown}>
			  	{floatRightDownButtons}
			  </div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		state: state.commonModule
	}
}

export default connect(
	mapStateToProps,
	commonModuleActions
)(CommonModule)