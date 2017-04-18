import React, { Component, PropTypes } from 'react'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'

class MenuControl extends Component {
	
	handleFocus(e) {
		e.target.blur();
	}

	render() {
		const { switchMenuView } = this.props
		const styles = {
			minWidth: 50,
			float: 'left'
		}
		return (
			<FlatButton
				style={styles}
				onTouchTap={switchMenuView}
				icon={<FontIcon color="#627d8f" className="fa fa-bars" />}
			/>
		)
	}
}

export default MenuControl