import {
	START_STUD_REQ_LISTING_FETCH,
	SUCCESS_STUD_REQ_LISTING_FETCH,
	ERROR_STUD_REQ_LISTING_FETCH,
} from './action-types';

import service from '../../services/base-service';

export function begin_stud_req_listing_fetch (payload){
	return { type: START_STUD_REQ_LISTING_FETCH, payload };
}

export function success_stud_req_listing_fetch (payload){
	return { type: SUCCESS_STUD_REQ_LISTING_FETCH, payload };
}

export function error_stud_req_listing_fetch (payload){
	return { type: ERROR_STUD_REQ_LISTING_FETCH, payload };
}

export function fetchReqListing (studentId, on_success = () => {}, on_reject = () => {}){
	return (dispatch) => {
		dispatch(begin_stud_req_listing_fetch({}));
		return service
			.getRestClient()
			.get('api/student/request-list', {
				params : { studentId: studentId },
			})
			.then((response) => {
				console.log('fetchReqListing response.data', response.data);
				dispatch(success_stud_req_listing_fetch(response.data));
				on_success();
			})
			.catch((err) => {
				console.log('err', err);
				dispatch(error_stud_req_listing_fetch({ ...err.response }));
				on_reject();
			});
	};
}
