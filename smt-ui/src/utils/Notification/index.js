import React, { Component } from "react";
import PropTypes from "prop-types";
import { notification } from "antd";

class Notification extends Component {
  openNotificationWithIcon = (type, description = null) => {
    const { Notification } = this.props.language;
    notification[type]({
      message: Notification[type].message,
      description: description ? description : Notification[type].description,
      placement: this.props.direction === "rtl" ? "topRight" : "topLeft",
    });
  };
}

Notification.propTypes = {
  language: PropTypes.object,
  direction: PropTypes.string,
};

export default Notification;
