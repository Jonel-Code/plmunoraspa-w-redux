import {
	ADMIN_LOGIN,
	START_DOC_CREATE,
	SUCCESS_DOC_CREATE,
	ERROR_DOC_CREATE,
	ADMIN_API_CALL_START,
	ADMIN_API_CALL_ERROR,
	ADMIN_API_CALL_END,
	ADMIN_API_CALL_UPDATE_DOCUMENT,
	ADMIN_API_CALL_DELETE_DOCUMENT,
	ADMIN_API_CALL_CREATE_ACCOUNT,
} from '../actions/action-types';
import { save_to_local_store, get_from_local_store } from '../helper/save-to-local-store';
import { open_swal, close_swal, custom_message_swal } from './../../comps/util/custom-swal';

const admin_data_reducer_key = 'admin_data_reducer_key';

const initialState = get_from_local_store(admin_data_reducer_key) || {
	admin_data     : {
		name          : '',
		id            : '',
		office        : '',
		account_id    : '',
		requests_list : [],
	},

	admin_api_call : {
		running  : false,
		response : {},
	},
};
function adminDataReducers (state = initialState, action){
	let new_state = state;
	switch (action.type) {
		case ADMIN_LOGIN:
			new_state = Object.assign({}, state, {
				...state,
				admin_data : { ...state.admin_data, ...action.payload },
			});
			break;

		case START_DOC_CREATE:
			open_swal();
			new_state = Object.assign({}, state, {
				...state,
				admin_api_call : { ...state.admin_api_call, running: true },
			});
			break;

		case SUCCESS_DOC_CREATE:
			close_swal();
			new_state = Object.assign({}, state, {
				...state,
				admin_api_call : { ...state.admin_api_call, running: false, response: action.payload },
			});
			break;

		case ERROR_DOC_CREATE:
			custom_message_swal(
				'Error in creating Document',
				'there is an error in creating the document',
				'error',
			).then(() => {
				window.location.reload();
			});
			new_state = Object.assign({}, state, {
				...state,
				admin_api_call : { ...state.admin_api_call, running: false, response: action.payload },
			});
			break;

		case ADMIN_API_CALL_START:
			open_swal();
			new_state = Object.assign({}, state, {
				...state,
				admin_api_call : { ...state.admin_api_call, running: true },
			});
			break;

		case ADMIN_API_CALL_END:
			close_swal();
			new_state = Object.assign({}, state, {
				...state,
				admin_api_call : { ...state.admin_api_call, running: false },
			});
			break;

		case ADMIN_API_CALL_ERROR:
			console.log('action.payload', action.payload);
			if (action && action.payload && action.payload.showError) {
				const errMessage = action.payload.showError;
				custom_message_swal(errMessage.title, errMessage.message, 'error');
			}
			else {
				custom_message_swal('Error in Admin APi CAll', 'there is an error in server', 'error').then(() => {
					// window.location.reload();
				});
			}
			new_state = Object.assign({}, state, {
				...state,
				admin_api_call : { ...state.admin_api_call, running: false, response: action.payload },
			});
			break;

		case ADMIN_API_CALL_UPDATE_DOCUMENT:
			new_state = Object.assign({}, state, {
				...state,
				admin_api_call : { ...state.admin_api_call, running: false, response: action.payload },
			});
			break;

		case ADMIN_API_CALL_DELETE_DOCUMENT:
			new_state = Object.assign({}, state, {
				...state,
				admin_api_call : { ...state.admin_api_call, running: false, response: action.payload },
			});
			break;

		case ADMIN_API_CALL_CREATE_ACCOUNT:
			new_state = Object.assign({}, state, {
				...state,
				admin_api_call : { ...state.admin_api_call, running: false, response: action.payload },
			});
			custom_message_swal(
				'Account Created',
				'please logout and check if the account is created',
				'info',
			).then(() => {
				window.location.reload();
			});
			break;
		default:
			break;
	}
	save_to_local_store(new_state, admin_data_reducer_key);
	return new_state;
}

export default adminDataReducers;
