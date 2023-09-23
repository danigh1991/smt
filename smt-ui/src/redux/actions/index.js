import * as types from "./type";
import _ from "lodash";
import API from "./../../utils/API";

export const establishCurrentUser = () => (dispatch) => {
  return API.Get("userManagement/getCurrentUser").then((result) => {
    let user = _.isObject(result.data) ? result.data : {};
    user.roles = user.roles && user.roles.map(({ role }) => role);
    if (result.success) {
      dispatch({
        type: types.SET_CURRENT_USER,
        user,
      });
      dispatch({
        type: types.SET_AUTHENTICATE,
        isAuthenticated: true,
      });
    } else {
      dispatch({
        type: types.SET_AUTHENTICATE,
        isAuthenticated: false,
      });
      dispatch({
        type: types.SET_CURRENT_USER,
        user: {},
      });
    }
    return result;
  });
};

export const loginUser = (username, password, userTypeCaptcha) => (
  dispatch
) => {
  const data = `username=${username}&password=${password}&userTypeCaptcha=${userTypeCaptcha}`;
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  return API.Post("login", data, {}, headers).then((result) => {
    if (result.success) {
      dispatch(establishCurrentUser());
      return result;
    } else {
      return result;
    }
  });
};

export const logoutUser = () => (dispatch) => {
  return API.Post("logout").then((result) => {
    if (result.success) {
      dispatch({
        type: types.SET_AUTHENTICATE,
        isAuthenticated: false,
      });
      dispatch({
        type: types.SET_CURRENT_USER,
        user: {},
      });
    }
    return result;
  });
};

export const setPendingRequests = (plus) => (dispatch) =>
  new Promise((resolve) => {
    dispatch({
      type: types.SET_PENDING_REQUESTS,
      plus,
    });

    resolve(plus);
  });

export const setDirection = (direction) => (dispatch) =>
  new Promise((resolve) => {
    document.body.classList.replace(document.body.className, direction);
    dispatch({
      type: types.SET_DIRECTION,
      direction,
    });

    resolve(direction);
  });

export const setTitle = (title) => (dispatch) =>
  new Promise((resolve) => {
    dispatch({
      type: types.SET_TITLE,
      title,
    });

    resolve(title);
  });

export const setIsMobile = (mobile) => (dispatch) =>
  new Promise((resolve) => {
    dispatch({
      type: types.SET_IS_MOBILE,
      mobile,
    });

    resolve(mobile);
  });

export const setButtonBar = (buttonBar) => (dispatch) =>
  new Promise((resolve) => {
    dispatch({
      type: types.SET_BUTTON_BAR,
      buttonBar,
    });

    resolve(buttonBar);
  });
