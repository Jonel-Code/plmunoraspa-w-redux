import {
	START_REQUEST_FORM_SUBMIT,
	SUCCESS_REQUEST_FORM_SUBMIT,
	ERROR_REQUEST_FORM_SUBMIT,
	CLEAR_REQUEST_FORM_DATA,
} from './action-types';

import service from '../../services/base-service';

export function clear_req_form_data (payload){
	return { type: CLEAR_REQUEST_FORM_DATA, payload };
}

export function start_req_form_submit (payload){
	return { type: START_REQUEST_FORM_SUBMIT, payload };
}

export function success_req_form_submit (payload){
	return { type: SUCCESS_REQUEST_FORM_SUBMIT, payload };
}

export function error_req_form_submit (payload){
	return { type: ERROR_REQUEST_FORM_SUBMIT, payload };
}

export function apiSubmitRequestForm (
	name = '',
	sid = '',
	doc_ids = [],
	on_auth_accept = () => {},
	on_auth_reject = () => {},
){
	return (dispatch) => {
		dispatch(start_req_form_submit({}));
		return service
			.getRestClient()
			.post('request-form-submit', {
				name: name,
				sid: sid,
				doc_ids: JSON.stringify(doc_ids),
			})
			.then((response) => {
				console.log('apiSubmitRequestForm response.data', response.data);
				dispatch(success_req_form_submit(response.data));
				on_auth_accept();
			})
			.catch((err) => {
				console.log('err', err);
				dispatch(error_req_form_submit({ ...err.response }));
				on_auth_reject();
			});
	};
}
