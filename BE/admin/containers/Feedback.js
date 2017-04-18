import React, {Component, PropTypes} from 'react'
// material ui component
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import Dialog from 'material-ui/Dialog';
// redux
import {connect} from 'react-redux'

import * as feedbackActions from './actions/feedback'

class Server extends Component {

	constructor(props) {
		super(props);

		this.state = {
			feedbackContentDialog: {
				open: false,
				content: ''
			},
			confirmDeleteDialog: {
				open: false,
				_id: ''
			}
		}
	}

	componentWillMount() {
		this.props.fetch_data(); // fetch data from server before Mounting
	}

	handleCloseFeedbackContentDialog() {
		this.setState({
			feedbackContentDialog: {
				open: false,
				content: ''
			}
		})
	}

	showAllContent(event) {
		this.setState({
			feedbackContentDialog: {
				open: true,
				content: event.target.innerHTML
			}
		})
	}

	handleCloseConfirmDeleteDialog() {
		this.setState({
			confirmDeleteDialog: {
				open: false,
				_id: ''
			}
		})
	}

	handleDeleteFeedback() {
		const {delete_feedback} = this.props;
		delete_feedback(this.state.confirmDeleteDialog._id);
		this.setState({
			confirmDeleteDialog: {
				open: false,
				_id: ''
			}
		})
	}

	showConfirmDelete(event) {
		let id = event.target.parentNode.parentNode.dataset.id;
		this.setState({
			confirmDeleteDialog: {
				open: true,
				_id: id
			}
		})
	}

	handleToggle(event, toggled) {
		let id = event.target.dataset.id;
		const {mark_read, mark_unread} = this.props;
		toggled ? mark_read(id) : mark_unread(id);
	}

	render() {
		const {data} = this.props;
		const {fetch_data} = this.props;

		const tableColumnWidth = {
			id: 20,
			operation: 100,
			date: 100,
			read: 50
		}

		const refreshButtonStyle = {
			position: 'fixed',
			bottom: '5em',
			right: '5em'
		}

		const feedbackContentDialogActions = [
			<FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleCloseFeedbackContentDialog.bind(this)}
      />
		]

		const confirmDeleteDialogActions = [
			<FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCloseConfirmDeleteDialog.bind(this)}
      />,
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.handleDeleteFeedback.bind(this)}
      />
		]

		return (
			<div>
				<FloatingActionButton onClick={fetch_data} style={refreshButtonStyle}>
					<RefreshIcon />
				</FloatingActionButton>
				<Dialog
					title="Feedback Content"
					actions={feedbackContentDialogActions}
					open={this.state.feedbackContentDialog.open}
					onRequestClose={this.handleCloseFeedbackContentDialog.bind(this)}
					>
					{this.state.feedbackContentDialog.content}
				</Dialog>
				<Dialog
					title="Delete Feedback"
					actions={confirmDeleteDialogActions}
					open={this.state.confirmDeleteDialog.open}
					onRequestClose={this.handleCloseConfirmDeleteDialog.bind(this)}
					>
					Confirm delete this feedback?
				</Dialog>
				<h3>Feedback</h3>
				<Table
          selectable={false}
					>
					<TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn width={tableColumnWidth.id}>ID</TableHeaderColumn>
              <TableHeaderColumn>Contact</TableHeaderColumn>
              <TableHeaderColumn>Content</TableHeaderColumn>
              <TableHeaderColumn width={tableColumnWidth.date}>CreateAt</TableHeaderColumn>
              <TableHeaderColumn width={tableColumnWidth.operation}>Delete</TableHeaderColumn>
              <TableHeaderColumn width={tableColumnWidth.read}>Read</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            showRowHover={true}
          >
          	{data.map((row, index) => (
          		<TableRow key={index}>
          			<TableRowColumn width={tableColumnWidth.id}>{index + 1}</TableRowColumn>
          		  <TableRowColumn>{row.contact}</TableRowColumn>
          		  <TableRowColumn><div onClick={this.showAllContent.bind(this)}>{row.content}</div></TableRowColumn>
          		  <TableRowColumn width={tableColumnWidth.date}>{row.CreateAt}</TableRowColumn>
          		  <TableRowColumn width={tableColumnWidth.operation}><FlatButton data-id={row._id} onClick={this.showConfirmDelete.bind(this)} label="Delete" primary={true}/></TableRowColumn>
          		  <TableRowColumn width={tableColumnWidth.read}><Toggle data-id={row._id} onToggle={this.handleToggle.bind(this)} defaultToggled={row.hasRead} /></TableRowColumn>
          		</TableRow>
          	))}
          </TableBody>
				</Table>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		data: state.feedback.data
	}
}

export default connect(
	mapStateToProps,
	feedbackActions
)(Server)