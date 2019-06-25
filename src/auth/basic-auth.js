import store from '../redux/store/index';
import { USER_TYPE_ENUM } from '../redux/actions/index';
const __store = store;
export const ADMIN_AUTH_KEY = 'admin_key';
export const STUDENT_AUTH_KEY = 'student_key';

export function update_auth_admin (username, id){
	localStorage.setItem(ADMIN_AUTH_KEY, btoa(JSON.stringify({ username: username, password: id })));
}

export function auth_values (){
	const v = localStorage.getItem(ADMIN_AUTH_KEY);
	console.log('v', localStorage.getItem(ADMIN_AUTH_KEY));
	if (v === null) {
		return undefined;
	}
	const s = atob(v);
	return JSON.parse(s);
}

export function auth_admin (){
	const _store = __store.getState();
	// console.log('studentDataReducers.student_data', _store.studentDataReducers.student_data);
	// console.log(
	// 	'_store.userDataReducers.current_user.is_authenticated',
	// 	_store.userDataReducers.current_user.is_authenticated,
	// );
	return (
		_store.userDataReducers.current_user.is_authenticated &&
		_store.userDataReducers.current_user.user_type === USER_TYPE_ENUM.admin
	);
	// const auth_val = auth_values();
	// console.log('auth_val', auth_val);
	// console.log(
	// 	'auth_val !== undefined && auth_val !== null && auth_val != {}',
	// 	auth_val !== undefined && auth_val !== null && auth_val != {},
	// );
	// return auth_val !== undefined && auth_val !== null && auth_val != {};
}

export function update_auth_student (username, id){
	localStorage.setItem(STUDENT_AUTH_KEY, btoa(JSON.stringify({ username: username, password: id })));
}

export function student_auth_values (){
	const v = localStorage.getItem(STUDENT_AUTH_KEY);
	console.log('v', localStorage.getItem(STUDENT_AUTH_KEY));
	if (v === null) {
		return undefined;
	}
	const s = atob(v);
	return JSON.parse(s);
}

export function auth_student (){
	const _store = __store.getState();
	// console.log('studentDataReducers.student_data', _store.studentDataReducers.student_data);
	// console.log(
	// 	'_store.userDataReducers.current_user.is_authenticated',
	// 	_store.userDataReducers.current_user.is_authenticated,
	// );
	return (
		_store.userDataReducers.current_user.is_authenticated &&
		_store.userDataReducers.current_user.user_type === USER_TYPE_ENUM.student
	);
	// const auth_val = student_auth_values();
	// console.log('auth_val', auth_val);
	// console.log(
	// 	'auth_val !== undefined && auth_val !== null && auth_val != {}',
	// 	auth_val !== undefined && auth_val !== null && auth_val != {},
	// );
	// return auth_val !== undefined && auth_val !== null && auth_val != {};
}
