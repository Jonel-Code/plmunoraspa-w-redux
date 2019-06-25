import {
	STUDENT_LOGIN,
	START_REQUEST_FORM_SUBMIT,
	SUCCESS_REQUEST_FORM_SUBMIT,
	ERROR_REQUEST_FORM_SUBMIT,
	CLEAR_REQUEST_FORM_DATA,
} from '../actions/action-types';
import { save_to_local_store, get_from_local_store } from '../helper/save-to-local-store';
import { open_swal, close_swal, custom_message_swal } from './../../comps/util/custom-swal';

const stud_data_reducer_key = 'stud_data_reducer_key';

const initialState = get_from_local_store(stud_data_reducer_key) || {
	student_data: {
		acc_id: 0,
		name: '',
		id: '',
		requests: [],
		new_request: {},
	},
	is_sending_form: false,
	pdf_data: {
		link: '',
	},
};

function studentDataReducers (state = initialState, action){
	let new_state = state;
	switch (action.type) {
		case STUDENT_LOGIN:
			new_state = Object.assign({}, state, {
				...state,
				student_data: { ...state.student_data, ...action.payload },
			});
			break;

		case START_REQUEST_FORM_SUBMIT:
			open_swal();
			new_state = Object.assign({}, state, {
				...state,
				is_sending_form: true,
			});
			break;

		case SUCCESS_REQUEST_FORM_SUBMIT:
			close_swal();
			new_state = Object.assign({}, state, {
				...state,
				pdf_data: {
					link: action.payload.pdf_link,
				},
			});
			break;

		case ERROR_REQUEST_FORM_SUBMIT:
			custom_message_swal(
				'Error in submitting Form',
				'The Request Currently cannot Process please contact the administrator if this message keep on appearing',
				'error',
			);
			break;

		case CLEAR_REQUEST_FORM_DATA:
			new_state = Object.assign({}, state, {
				...state,
				is_sending_form: false,
				pdf_data: {
					link: '',
				},
			});
			break;

		default:
			break;
	}
	save_to_local_store(new_state, stud_data_reducer_key);
	return new_state;
}
export default studentDataReducers;
