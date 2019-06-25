import { ERROR_DOCUMENT_LIST_FETCH, START_DOCUMENT_LIST_FETCH, SUCCESS_DOCUMENT_LIST_FETCH } from './action-types';

import service from '../../services/base-service';

export function start_doc_list_fetch (payload){
	return { type: START_DOCUMENT_LIST_FETCH, payload };
}

export function success_doc_list_fetch (payload){
	return { type: SUCCESS_DOCUMENT_LIST_FETCH, payload };
}

export function error_doc_list_fetch (payload){
	return { type: ERROR_DOCUMENT_LIST_FETCH, payload };
}

export function apiDocListFetch (on_auth_accept = () => {}, on_auth_reject = () => {}){
	return (dispatch) => {
		dispatch(start_doc_list_fetch({}));
		return service
			.getRestClient()
			.get('document-list', {})
			.then((response) => {
				console.log('document-list response.data', response.data);
				let data = [];
				if (Array.isArray(response.data)) {
					data = response.data.map((x) => {
						return { ...x, doc_id: Number(x.doc_id), price: Number(x.price) };
					});
				}
				dispatch(success_doc_list_fetch(data));
				on_auth_accept();
			})
			.catch((err) => {
				console.log('err', err);
				dispatch(error_doc_list_fetch({ ...err.response }));
				on_auth_reject();
			});
	};
}
