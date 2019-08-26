import { START_STUD_REQ_DELETE, SUCCESS_STUD_REQ_DELETE, ERROR_STUD_REQ_DELETE } from './action-types';

import service from '../../services/base-service';

export function start_stud_req_delete (payload){
	return { type: START_STUD_REQ_DELETE, payload };
}

export function success_stud_req_delete (payload){
	return { type: SUCCESS_STUD_REQ_DELETE, payload };
}

export function error_stud_req_delete (payload){
	return { type: ERROR_STUD_REQ_DELETE, payload };
}

export function apiDeleteStudRequest (reqId, on_delete_accept = () => {}, on_delete_reject = () => {}){
	return (dispatch) => {
		dispatch(start_stud_req_delete());
		return service
			.getRestClient()
			.post('api/request/delete', {
				reqId : reqId,
			})
			.then((response) => {
				console.log('apiDeleteStudRequest response', response);
				dispatch(success_stud_req_delete(response));
				on_delete_accept();
			})
			.catch((err) => {
				console.log('err', err);
				dispatch(error_stud_req_delete({ ...err.response } || { message: 'Server Error' }));
				on_delete_reject();
			});
	};
}
