import React, { Component } from "react";
import API from "./../utils/API";

class AmountManagement extends Component {
  static getAccounts() {
    return API.Get("account/list");
  }

  static getFilesList() {
    return API.Get("file/fileList");
  }

  static getFileDetails(params) {
    return API.Get("file/fileDetail", params);
  }

  static deleteRecord(params) {
    return API.Delete("file/record/remove", params);
  }

  static moneyTransfer(data) {
    return API.Post("file/transfer", data);
  }

  static uploadFile(data) {
    return API.Post("file/upload", data);
  }

  static sendVerificationMessage(params) {
    return API.Post("phone/verification", {}, params);
  }

  static getVerificationList() {
    return API.Get("phone/verificationList");
  }

  render = () => <API />;
}

export default AmountManagement;
