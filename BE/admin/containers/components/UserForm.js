import React, {Component} from 'react'
// material ui
import TextField from 'material-ui/TextField'
import Avatar from 'material-ui/Avatar'

class UserForm extends Component {
	render() {
		const {name, password, email, phone, avatar, description} = this.props;
		const {handleChange} = this.props;
		return (
			<form>
				<Avatar src={avatar} size={100} />
				<TextField
					floatingLabelText="Avatar"
					fullWidth={true}
					value={avatar}
					data-name="avatar"
					onChange={handleChange}
				/>
				<TextField
					floatingLabelText="UserName"
					fullWidth={true}
					value={name}
					data-name="name"
					onChange={handleChange}
				/>
				<TextField
					floatingLabelText="Password"
					type="password"
					fullWidth={true}
					value={password}
					data-name="password"
					onChange={handleChange}
				/>
				<TextField
					floatingLabelText="Email"
					fullWidth={true}
					value={email}
					data-name="email"
					onChange={handleChange}
				/>
				<TextField
					floatingLabelText="Phone"
					fullWidth={true}
					value={phone}
					data-name="phone"
					onChange={handleChange}
				/>
				<TextField
					floatingLabelText="Description"
					fullWidth={true}
					value={description}
					data-name="description"
					onChange={handleChange}
				/>
			</form>
		)
	}
}

export default UserForm