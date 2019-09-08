import { START_DOC_CREATE, SUCCESS_DOC_CREATE, ERROR_DOC_CREATE } from './action-types';

import service from '../../services/base-service';

import {
	admin_api_start,
	admin_api_end,
	admin_api_error,
	admin_api_update_document,
	admin_api_delete_document,
} from './admin-actions';

export function start_document_create (payload){
	return { type: START_DOC_CREATE, payload };
}

export function success_document_create (payload){
	return { type: SUCCESS_DOC_CREATE, payload };
}
export function error_document_create (payload){
	return { type: ERROR_DOC_CREATE, payload };
}

export function apiCreateDocument (
	title,
	description,
	price,
	on_register_accept = () => {},
	on_register_reject = () => {},
){
	return (dispatch) => {
		dispatch(start_document_create());
		return service
			.getRestClient()
			.post('admin/create-document', {
				title       : title,
				description : description,
				price       : price,
			})
			.then(
				(response) => {
					console.log('response.data', response.data);
					dispatch(success_document_create(response.data));
					on_register_accept();
				},
				(err) => {
					console.log('err', err);
					dispatch(error_document_create({ ...err.response } || { message: 'Server Error' }));
					on_register_reject();
				},
			)
			.then(() => {
				// on_register_accept();
			});
	};
}

export function apiUpdateDocument (
	documentId,
	title,
	description,
	price,
	on_register_accept = () => {},
	on_register_reject = () => {},
){
	return (dispatch) => {
		dispatch(admin_api_start());
		return service
			.getRestClient()
			.post('admin/create-document/update', {
				title       : title,
				description : description,
				price       : price,
				documentId  : documentId,
			})
			.then(
				(response) => {
					console.log('response.data', response.data);
					dispatch(admin_api_end());
					dispatch(admin_api_update_document(response.data));
				},
				(err) => {
					console.log('err', err);
					dispatch(admin_api_error({ ...err.response } || { message: 'Server Error' }));
					on_register_reject();
				},
			)
			.then(() => {
				on_register_accept();
			});
	};
}

export function apiDeleteDocument (documentId, on_register_accept = () => {}, on_register_reject = () => {}){
	return (dispatch) => {
		dispatch(admin_api_start());
		return service
			.getRestClient()
			.post('admin/create-document/delete', {
				documentId : documentId,
			})
			.then(
				(response) => {
					console.log('response.data', response.data);
					dispatch(admin_api_end());
					dispatch(admin_api_delete_document(response.data));
				},
				(err) => {
					console.log('err', err);
					dispatch(admin_api_error({ ...err.response } || { message: 'Server Error' }));
					on_register_reject();
				},
			)
			.then(() => {
				on_register_accept();
			});
	};
}
