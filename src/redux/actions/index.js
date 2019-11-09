import * as at from './action-types';

import service from '../../services/base-service';

export const USER_TYPE_ENUM = {
  admin   : 'admin',
  student : 'student',
};

export function studentLogin (payload){
  return { type: at.STUDENT_LOGIN, payload };
}

export function adminLogin (payload){
  return { type: at.ADMIN_LOGIN, payload };
}

export function authenticateUser (payload){
  return { type: at.AUTHENTICATE_USER, payload };
}

export function authenticationClear (){
  return { type: at.CLEAR_AUTHENTICATION };
}

export function apiAuthenticateUser (username, sid, password, on_auth_accept = () => {}, on_auth_reject = () => {}){
  return (dispatch) => {
    return service
      .getRestClient()
      .get('student-login', {
        params : {
          username : username,
          sid      : sid,
          password : password,
        },
      })
      .then((response) => {
        console.log('response.data', response.data);
        dispatch(studentLogin(response.data));
        dispatch(
          authenticateUser({
            user_type        : USER_TYPE_ENUM.student,
            is_authenticated : true,
            other_data       : {},
            login_failed     : false,
          }),
        );
        on_auth_accept();
      })
      .catch((err) => {
        dispatch(
          authenticateUser({
            user_type        : USER_TYPE_ENUM.student,
            is_authenticated : false,
            other_data       : {},
            login_failed     : true,
          }),
        );
        console.log('err', err);
        on_auth_reject();
      });
  };
}

export function apiAuthenticateAdmin (username, password, on_auth_accept = () => {}, on_auth_reject = () => {}){
  return (dispatch) => {
    return service
      .getRestClient()
      .get('admin-login', {
        params : {
          username : username,
          password : password,
        },
      })
      .then((response) => {
        console.log('response.data', response.data);
        dispatch(adminLogin(response.data));
        dispatch(
          authenticateUser({
            user_type        : USER_TYPE_ENUM.admin,
            is_authenticated : true,
            other_data       : {},
            login_failed     : false,
          }),
        );
        on_auth_accept();
      })
      .catch((err) => {
        dispatch(
          authenticateUser({
            user_type        : USER_TYPE_ENUM.admin,
            is_authenticated : false,
            other_data       : {},
            login_failed     : true,
          }),
        );
        console.log('err', err);
        on_auth_reject();
      });
  };
}
