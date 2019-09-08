import {
	ADMIN_API_CALL_START,
	ADMIN_API_CALL_ERROR,
	ADMIN_API_CALL_END,
	ADMIN_API_CALL_UPDATE_DOCUMENT,
	ADMIN_API_CALL_DELETE_DOCUMENT,
	ADMIN_API_CALL_CREATE_ACCOUNT,
} from './action-types';
import service from '../../services/base-service';

export function admin_api_start (payload){
	return { type: ADMIN_API_CALL_START, payload };
}

export function admin_api_end (payload){
	return { type: ADMIN_API_CALL_END, payload };
}

export function admin_api_error (payload){
	return { type: ADMIN_API_CALL_ERROR, payload };
}

export function admin_api_update_document (payload){
	return { type: ADMIN_API_CALL_UPDATE_DOCUMENT, payload };
}
export function admin_api_delete_document (payload){
	return { type: ADMIN_API_CALL_DELETE_DOCUMENT, payload };
}

export function admin_api_create_account (payload){
	return { type: ADMIN_API_CALL_CREATE_ACCOUNT, payload };
}

export function apiCreateAdmin (
	name,
	employeeId,
	employeeEmail,
	office,
	on_register_accept = () => {},
	on_register_reject = () => {},
){
	return (dispatch) => {
		dispatch(admin_api_start());
		return service
			.getRestClient()
			.post('admin/new-admin', {
				name          : name,
				employeeId    : employeeId,
				employeeEmail : employeeEmail,
				office        : office,
			})
			.then(
				(response) => {
					console.log('response.data', response.data);
					dispatch(admin_api_end({}));
					dispatch(admin_api_create_account(response.data));
					on_register_accept();
				},
				(err) => {
					console.log('err', err);
					const showError = {
						title   : 'Error in Creating Account',
						message : 'Check the Employee Id or Email if valid',
					};
					dispatch(
						admin_api_error(
							{ ...err.response, showError: showError } || {
								message   : 'Server Error',
								showError : showError,
							},
						),
					);
					on_register_reject();
				},
			);
	};
}
