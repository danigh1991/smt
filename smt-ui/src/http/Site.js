import React, { Component } from "react";
import API from "./../utils/API";

class Site extends Component {
  static getVersion() {
    return API.Get("versionManagement/version");
  }

  render = () => <API />;
}

export default Site;
