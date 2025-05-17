import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/redux/authSlice';
import tutorReducer from '../features/adminShelter/redux/tutorSlice';
import qrTokenReducer from '../features/adminShelter/redux/qrTokenSlice';
import attendanceReducer from '../features/adminShelter/redux/attendanceSlice';
// Create the root reducer
const appReducer = combineReducers({
  auth: authReducer,
  tutor: tutorReducer,
  qrToken: qrTokenReducer,
  attendance: attendanceReducer,
  // Add other feature reducers as they are developed
  // adminPusat: adminPusatReducer,
  // adminCabang: adminCabangReducer,
  // adminShelter: adminShelterReducer,
  // donatur: donaturReducer,
});

// Reset the entire redux state when logout action is dispatched
const rootReducer = (state, action) => {
  // Check if the action type is 'auth/logout/fulfilled'
  if (action.type === 'auth/logout/fulfilled') {
    // Return undefined to reset state to initial values defined in each reducer
    return appReducer(undefined, action);
  }
  
  return appReducer(state, action);
};

export default rootReducer;