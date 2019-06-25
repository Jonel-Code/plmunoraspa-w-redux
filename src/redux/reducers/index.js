import { combineReducers } from 'redux';

import adminDataReducers from './admin-data-reducers';
import studentDataReducers from './student-data-reducers';
import userDataReducers from './user-data-reducer';

export default combineReducers({
	adminDataReducers,
	studentDataReducers,
	userDataReducers,
});
