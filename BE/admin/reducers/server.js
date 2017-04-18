import {fromJS} from 'immutable'

const initialState = {

}

let generate_new_state = (state) => {
	let newState = fromJS(state);
	return newState.toJS();
}

export default function server(state = initialState, action) {
	switch (action.type) {
		default :
			return state;
	}
}