import {
  STUDENT_LOGIN,
  START_REQUEST_FORM_SUBMIT,
  SUCCESS_REQUEST_FORM_SUBMIT,
  ERROR_REQUEST_FORM_SUBMIT,
  CLEAR_REQUEST_FORM_DATA,
  START_STUD_REQ_LISTING_FETCH,
  SUCCESS_STUD_REQ_LISTING_FETCH,
  ERROR_STUD_REQ_LISTING_FETCH,
  START_STUD_REQ_DELETE,
  SUCCESS_STUD_REQ_DELETE,
  ERROR_STUD_REQ_DELETE,
} from '../actions/action-types';
import { save_to_local_store, get_from_local_store } from '../helper/save-to-local-store';
import { open_swal, close_swal, custom_message_swal } from './../../comps/util/custom-swal';

const stud_data_reducer_key = 'stud_data_reducer_key';

const initialState = get_from_local_store(stud_data_reducer_key) || {
  student_data    : {
    acc_id         : 0,
    name           : '',
    id             : '',
    requests       : [
      {
        requestId      : '',
        dateOfRequest  : '',
        titles         : '',
        description    : '',
        total          : 0,
        hash_key       : '',
        registrarAccId : '',
        treasuryAccId  : '',
        or_number      : null,
        date_payed     : null,
      },
    ],
    new_request    : {},
    runningApiCall : false,
    apiMessage     : '',
  },
  is_sending_form : false,
  pdf_data        : {
    link : '',
  },
};

function studentDataReducers (state = initialState, action){
  let new_state = state;
  switch (action.type) {
    case SUCCESS_STUD_REQ_DELETE:
      close_swal();
      new_state = Object.assign({}, state, {
        ...state,
        runningApiCall : false,
        apiMessage     : action.payload.message,
      });
      break;

    case ERROR_STUD_REQ_DELETE:
      custom_message_swal(
        'Error in Deleteing Request',
        'The Request Currently cannot Process please contact the administrator if this message keep on appearing',
        'error',
      );
      new_state = Object.assign({}, state, {
        ...state,
        runningApiCall : false,
        apiMessage     : action.payload.message,
      });
      break;

    case START_STUD_REQ_DELETE:
      open_swal();
      new_state = Object.assign({}, state, {
        ...state,
        runningApiCall : true,
      });
      break;

    case START_STUD_REQ_LISTING_FETCH:
      open_swal();
      new_state = Object.assign({}, state, {
        ...state,
        runningApiCall : true,
      });
      break;

    case SUCCESS_STUD_REQ_LISTING_FETCH:
      close_swal();
      new_state = Object.assign({}, state, {
        ...state,
        student_data : { ...state.student_data, requests: action.payload, runningApiCall: false },
      });
      break;

    case ERROR_STUD_REQ_LISTING_FETCH:
      custom_message_swal(
        'Error in Fetching the List',
        'The Request Currently cannot Process please contact the administrator if this message keep on appearing',
        'error',
      );
      new_state = Object.assign({}, state, {
        ...state,
        student_data : { ...state.student_data, runningApiCall: false },
      });
      break;

    case STUDENT_LOGIN:
      new_state = Object.assign({}, state, {
        ...state,
        student_data : { ...state.student_data, ...action.payload },
      });
      break;

    case START_REQUEST_FORM_SUBMIT:
      open_swal();
      new_state = Object.assign({}, state, {
        ...state,
        is_sending_form : true,
      });
      break;

    case SUCCESS_REQUEST_FORM_SUBMIT:
      close_swal();
      new_state = Object.assign({}, state, {
        ...state,
        pdf_data : {
          link : action.payload.pdf_link,
        },
      });
      break;

    case ERROR_REQUEST_FORM_SUBMIT:
      custom_message_swal(
        'Error in submitting Form',
        'The Request Currently cannot Process please contact the administrator if this message keep on appearing',
        'error',
      );
      break;

    case CLEAR_REQUEST_FORM_DATA:
      new_state = Object.assign({}, state, {
        ...state,
        is_sending_form : false,
        pdf_data        : {
          link : '',
        },
      });
      break;

    default:
      break;
  }
  save_to_local_store(new_state, stud_data_reducer_key);
  return new_state;
}
export default studentDataReducers;
