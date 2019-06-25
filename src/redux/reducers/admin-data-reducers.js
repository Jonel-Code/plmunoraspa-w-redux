import { ADMIN_LOGIN } from '../actions/action-types';
import { save_to_local_store, get_from_local_store } from '../helper/save-to-local-store';

const admin_data_reducer_key = 'admin_data_reducer_key';

const initialState = get_from_local_store(admin_data_reducer_key) || {
	admin_data: {
		name: '',
		id: '',
		office: '',
		account_id: '',
		requests_list: [],
	},
};
function adminDataReducers (state = initialState, action){
	let new_state = state;
	switch (action.type) {
		case ADMIN_LOGIN:
			new_state = Object.assign({}, state, {
				...state,
				admin_data: { ...state.admin_data, ...action.payload },
			});
			break;

		default:
			break;
	}
	save_to_local_store(new_state, admin_data_reducer_key);
	return new_state;
}

export default adminDataReducers;
