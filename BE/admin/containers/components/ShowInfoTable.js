// react
import React, {Component, PropTypes} from 'react'
// material ui
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import CheckBox from 'material-ui/Checkbox'
import FlatButton from 'material-ui/FlatButton'

import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';

class ShowInfoTable extends Component {
	render() {
		const {data, selectedAll, showCheckBox, filterShow} = this.props;
		const {change_selected, selected_all, show_edit_data} = this.props;
		if (data.length < 1) {
			return (<p>not found data</p>);
		}
		return (
			<Table
				showCheckboxes={false}
			>
		    <TableHeader
		    	adjustForCheckbox={false}
		    	displaySelectAll={false}
		    >
		      <TableRow>
		      	{showCheckBox ? 
		      		<TableHeaderColumn width={20}><CheckBox checked={selectedAll} onCheck={selected_all} /></TableHeaderColumn> 
		      		: null
		      	}

		        <TableHeaderColumn>ID</TableHeaderColumn>
						{filterShow.map((key, index) => 
							<TableHeaderColumn key={index}>{key}</TableHeaderColumn>
						)}
						<TableHeaderColumn width={100}>Operation</TableHeaderColumn>
		      </TableRow>
		    </TableHeader>
		    <TableBody
		    	displayRowCheckbox={false}
		    	showRowHover={true}
		    	stripedRows={true}
		    >
					{data.map((row, index) => (
						<TableRow key={index}>
							{showCheckBox ? <TableRowColumn width={20}><CheckBox checked={row._selected} data-id={index} onCheck={change_selected} /></TableRowColumn> : null}
							<TableRowColumn>{index + 1}</TableRowColumn>
							{filterShow.map((key, index) => 
								<TableRowColumn key={index}>{row[key]}</TableRowColumn>
							)}
							<TableRowColumn width={100}>
								<FlatButton 
									label="Edit"
									primary={true}
									onTouchTap={() => show_edit_data(index)}
									icon={<EditorModeEdit />}
								/>
							</TableRowColumn>
						</TableRow>
					))}
		    </TableBody>
		  </Table>
	  )
	}
}

export default ShowInfoTable;