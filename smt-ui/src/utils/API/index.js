import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import _ from "lodash";
import Cookies from "js-cookie";
import { Global } from "./../../resources/constants";
import { logoutUser } from "../../redux/actions";

// Utils
import Notification from "./../Notification";

const { HOST } = Global;

let staticProps = null;
let staticNotification = null;

const uploadProgress = (progressEvent) => {
  let percentCompleted = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );
  // console.log("uploadProgress", progressEvent);
};

const downloadProgress = (progressEvent) => {
  let percentCompleted = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );
  // console.log("downloadProgress", progressEvent);
};

const mapStateToProps = (state) => {
  return {
    user: state.config.user,
    isAuthenticated: state.config.isAuthenticated,
    language: state.config.language,
    direction: state.config.direction,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ logoutUser }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
class API extends Component {
  constructor(props) {
    super(props);
    staticProps = props;
    staticNotification = new Notification(props);
  }

  static staticParams = {};

  static setParams(params) {
    this.staticParams = params;
  }

  static checkUnauthorized(status) {
    if (staticProps && status === 401 && Cookies.get("api_key"))
      staticProps.logoutUser();
  }

  static Post(url, data, params = {}, headers = {}) {
    url = HOST + url;
    this.setParams(params);
    let config = {
      headers: headers,
      params: this.staticParams,
      onUploadProgress: uploadProgress,
      onDownloadProgress: downloadProgress,
    };
    return axios
      .post(url, data, config)
      .then((response) => {
        let data = response ? response.data : {};
        staticNotification &&
          data.message &&
          staticNotification.openNotificationWithIcon("success", data.message);
        return {
          data,
          success: true,
        };
      })
      .catch((error) => {
        let { status, data } = error.response
          ? error.response
          : { status: {}, data: {} };
        this.checkUnauthorized(status);
        staticNotification &&
          staticNotification.openNotificationWithIcon("error", data.message);
        return {
          data,
          status,
          success: false,
        };
      });
  }

  static Put(url, data, params = {}, headers = {}) {
    url = HOST + url;
    this.setParams(params);
    let config = {
      headers: headers,
      params: this.staticParams,
      onUploadProgress: uploadProgress,
      onDownloadProgress: downloadProgress,
    };
    return axios
      .put(url, data, config)
      .then((response) => {
        let data = response ? response.data : {};
        staticNotification &&
          data.message &&
          staticNotification.openNotificationWithIcon("success", data.message);
        return {
          data,
          success: true,
        };
      })
      .catch((error) => {
        let { status, data } = error.response
          ? error.response
          : { status: {}, data: {} };
        this.checkUnauthorized(status);
        staticNotification &&
          staticNotification.openNotificationWithIcon("error", data.message);
        return {
          data,
          status,
          success: false,
        };
      });
  }

  static Get(url, params = {}, headers = {}) {
    url = HOST + url;
    this.setParams(params);
    let config = {
      headers: headers,
      params: this.staticParams,
      onDownloadProgress: downloadProgress,
    };
    return axios
      .get(url, config)
      .then((response) => {
        let data = response ? response.data : {};
        staticNotification &&
          data.message &&
          staticNotification.openNotificationWithIcon("success", data.message);
        return {
          data,
          success: true,
        };
      })
      .catch((error) => {
        let { status, data } = error.response
          ? error.response
          : { status: {}, data: {} };
        this.checkUnauthorized(status);
        staticNotification &&
          staticNotification.openNotificationWithIcon("error", data.message);
        return {
          data,
          status,
          success: false,
        };
      });
  }

  static Delete(url, params = {}, headers = {}) {
    url = HOST + url;
    this.setParams(params);
    let config = {
      headers: headers,
      params: this.staticParams,
      onDownloadProgress: downloadProgress,
    };
    return axios
      .delete(url, config)
      .then((response) => {
        let data = response ? response.data : {};
        staticNotification &&
          data.message &&
          staticNotification.openNotificationWithIcon("success", data.message);
        return {
          data,
          success: true,
        };
      })
      .catch((error) => {
        let { status, data } = error.response
          ? error.response
          : { status: {}, data: {} };
        this.checkUnauthorized(status);
        staticNotification &&
          staticNotification.openNotificationWithIcon("error", data.message);
        return {
          data,
          status,
          success: false,
        };
      });
  }

  render = () => null;
}

API.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  language: PropTypes.object,
  direction: PropTypes.string,
  logoutUser: PropTypes.func,
};

export default API;
