import {
	ADMIN_API_CALL_START,
	ADMIN_API_CALL_ERROR,
	ADMIN_API_CALL_END,
	ADMIN_API_CALL_UPDATE_DOCUMENT,
	ADMIN_API_CALL_DELETE_DOCUMENT,
	ADMIN_API_CALL_CREATE_ACCOUNT,
	ADMIN_API_CALL_GET_ALL_REQUEST,
	ADMIN_API_CALL_APPROVE_REQUEST,
	ADMIN_API_CALL_REMOVE_APPROVE_REQUEST,
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

export function admin_api_get_all_request (payload){
	return { type: ADMIN_API_CALL_GET_ALL_REQUEST, payload };
}

export function admin_api_approve_request (payload){
	return { type: ADMIN_API_CALL_APPROVE_REQUEST, payload };
}

export function admin_api_remove_approve_request (payload){
	return { type: ADMIN_API_CALL_REMOVE_APPROVE_REQUEST, payload };
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

export function apiFetchAllRequest (on_register_accept = () => {}, on_register_reject = () => {}){
	return (dispatch) => {
		dispatch(admin_api_start());
		return service.getRestClient().get('admin/request-listing', {}).then(
			(response) => {
				console.log('response.data', response.data);
				dispatch(admin_api_end({}));
				dispatch(admin_api_get_all_request(response.data));
				on_register_accept();
			},
			(err) => {
				console.log('err', err);
				const showError = {
					title   : 'Error in Fetching Request List',
					message : 'Check the dataconnection',
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

export function apiApproveAdmin (
	name,
	employeeId,
	requestId,
	on_register_accept = () => {},
	on_register_reject = () => {},
){
	return (dispatch) => {
		dispatch(admin_api_start());
		return service
			.getRestClient()
			.post('admin/approve-request', {
				name       : name,
				employeeId : employeeId,
				requestId  : requestId,
			})
			.then(
				(response) => {
					console.log('response.data', response.data);
					dispatch(admin_api_end({}));
					dispatch(admin_api_approve_request(response.data));
					on_register_accept();
				},
				(err) => {
					console.log('err', err);
					const showError = {
						title   : 'Error in Approving Request',
						message : 'Check the Employee Id or Request ID if valid',
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

export function apiRemoveApproveAdmin (
	name,
	employeeId,
	requestId,
	on_register_accept = () => {},
	on_register_reject = () => {},
){
	return (dispatch) => {
		dispatch(admin_api_start());
		return service
			.getRestClient()
			.post('admin/approve-request/remove', {
				name       : name,
				employeeId : employeeId,
				requestId  : requestId,
			})
			.then(
				(response) => {
					console.log('response.data', response.data);
					dispatch(admin_api_end({}));
					dispatch(admin_api_remove_approve_request(response.data));
					on_register_accept();
				},
				(err) => {
					console.log('err', err);
					const showError = {
						title   : 'Error in Approving Request',
						message : 'Check the Employee Id or Request ID if valid',
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
