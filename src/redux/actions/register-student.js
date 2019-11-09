import { REGISTER_STUDENT, BEGIN_REGISTER_STUDENT, END_REGISTER_STUDENT, ERROR_REGISTER_STUDENT } from './action-types';

import service from '../../services/base-service';

export function begin_register_new_user (payload){
  return { type: BEGIN_REGISTER_STUDENT, payload };
}

export function end_register_new_user (payload){
  return { type: END_REGISTER_STUDENT, payload };
}

export function register_new_user (payload){
  return { type: REGISTER_STUDENT, payload };
}
export function error_register_new_user (payload){
  return { type: ERROR_REGISTER_STUDENT, payload };
}

export function apiRegisterNewUser (
  username,
  sid,
  password,
  on_register_accept = () => {},
  on_register_reject = () => {},
){
  return (dispatch) => {
    dispatch(begin_register_new_user());
    return service
      .getRestClient()
      .post('register-student', {
        name     : username,
        sid      : sid,
        password : password,
      })
      .then((response) => {
        console.log('response.data', response.data);
        dispatch(register_new_user(response.data));
        dispatch(end_register_new_user({}));
      })
      .catch((err) => {
        console.log('err', err);
        dispatch(error_register_new_user({ ...err.response } || { message: 'Server Error' }));
        on_register_reject();
      })
      .then(() => {
        on_register_accept();
      });
  };
}
