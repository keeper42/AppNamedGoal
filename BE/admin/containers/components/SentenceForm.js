import React, {Component} from 'react'
// material ui
import TextField from 'material-ui/TextField'
import Avatar from 'material-ui/Avatar'

import {
	baseUrl,
	uploadUrl
} from '../../config.js'

class SentenceForm extends Component {

	handleClick() {
		this.refs.avatarPicker.click();
	}

	handleChangeFile(e) {
		let file = e.target.files[0];
    let supportedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    if (file && supportedTypes.indexOf(file.type) >= 0) {
    	let token = window.localStorage.getItem('token');
    	let formData = new FormData();
    	formData.append('avatar', file);
    	window.fetch(`${baseUrl}${uploadUrl}`, {
    		method: 'POST',
    		headers: {
    			"Authorization": token
    		},
    		body: formData
    	}).then(res => {
    		if (res.ok) {
    			res.json().then(data => {
    				if (data.code != 10000) {
    					e.target.value = "";
    				} else {
    					this.props.handleChange({
    						target: {
    							dataset: {
    								name: "backImg"
    							},
    							value: data.data
    						}
    					});
    				}
    			})
    		} else {
    			e.target.value = "";
    		}
    	}, err => {
    		console.log(err);
    		e.target.value = "";
    	})
    } else {
    	e.target.value = "";
    }
	}

	render() {
		const {sentence, backImg} = this.props;
		const {handleChange} = this.props;
		return (
			<form>
				<TextField
					floatingLabelText="Sentence"
					fullWidth={true}
					value={sentence}
					data-name="sentence"
					onChange={handleChange}
				/>
				<TextField
					floatingLabelText="BackImg"
					fullWidth={true}
					value={backImg}
					data-name="backImg"
					onClick={this.handleClick.bind(this)}
				/>
				<input ref="avatarPicker" type="file" onChange={this.handleChangeFile.bind(this)} style={{display: "none"}} />
			</form>
		)
	}
}

export default SentenceForm