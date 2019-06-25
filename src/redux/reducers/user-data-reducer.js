import {
	AUTHENTICATE_USER,
	CLEAR_AUTHENTICATION,
	BEGIN_REGISTER_STUDENT,
	END_REGISTER_STUDENT,
	ERROR_REGISTER_STUDENT,
	START_DOCUMENT_LIST_FETCH,
	SUCCESS_DOCUMENT_LIST_FETCH,
	ERROR_DOCUMENT_LIST_FETCH,
} from '../actions/action-types';
import { save_to_local_store, get_from_local_store, local_store_clear } from '../helper/save-to-local-store';
import { open_swal, close_swal, custom_message_swal } from './../../comps/util/custom-swal';
const user_data_reducer_key = 'user_data_reducer_key';

const base_state = {
	current_user: {
		user_type: 'student',
		is_authenticated: false,
		other_data: {},
		login_failed: false,
	},
	document_listing: [
		{ doc_id: 0, title: '', description: '', price: 0 },
	],
};

const initialState = get_from_local_store(user_data_reducer_key) || base_state;

function userDataReducers (state = initialState, action){
	// console.log('userDataReducers', state);
	let new_state = state;
	switch (action.type) {
		case AUTHENTICATE_USER:
			new_state = Object.assign({}, state, {
				...state,
				current_user: action.payload,
			});
			break;

		case CLEAR_AUTHENTICATION:
			local_store_clear();
			new_state = Object.assign({}, state, {
				...state,
				current_user: { ...base_state.current_user },
			});
			break;

		case BEGIN_REGISTER_STUDENT:
			open_swal();
			break;

		case END_REGISTER_STUDENT:
			close_swal();
			custom_message_swal('Account Created', 'You can now Login using your account', 'success').then(() => {
				window.location.reload();
			});
			break;

		case ERROR_REGISTER_STUDENT:
			custom_message_swal('Error In Student Register', `Error: ${action.payload.statusText}`);
			break;

		case START_DOCUMENT_LIST_FETCH:
			open_swal();
			break;

		case SUCCESS_DOCUMENT_LIST_FETCH:
			new_state = Object.assign({}, state, {
				...state,
				document_listing: action.payload.slice(),
			});
			close_swal();
			break;

		case ERROR_DOCUMENT_LIST_FETCH:
			custom_message_swal('Error In Fetching the Document List', `Error: ${action.payload.statusText}`);
			break;

		default:
			break;
	}
	save_to_local_store(new_state, user_data_reducer_key);
	return new_state;
}
export default userDataReducers;
