import React, { Component } from "react";
import API from "./../utils/API";

class UserManagement extends Component {
  static getUserList(params) {
    return API.Get("userManagement/user", params);
  }

  static deleteUser(username) {
    return API.Delete(`userManagement/user/${username}`);
  }

  static changeEnabledUser(username, params) {
    return API.Put(
      `userManagement/user/${username}/changeEnabled`,
      null,
      params
    );
  }

  static resetPassword(username, data) {
    return API.Post(
      `userManagement/user/${username}/resetPassword`,
      data,
      null,
      {
        "Content-Type": "text/plain",
      }
    );
  }

  static getAllRoles() {
    return API.Get("userManagement/role");
  }

  static getAllPermission(params = {}) {
    return API.Get("userManagement/permission", params);
  }

  static getUser(username) {
    return API.Get(`userManagement/user/${username}`);
  }

  static getUserPermissions(username) {
    return API.Get(`userManagement/user/${username}/getPermissions`);
  }

  static assignRolesToUser(username, data) {
    return API.Post(`userManagement/user/${username}/assignRoles`, data);
  }

  static assignPermissionsToUser(username, data) {
    return API.Post(`userManagement/user/${username}/assignPermissions`, data);
  }

  static createUser(data) {
    return API.Post("userManagement/user", data);
  }

  static updateUser(username, data) {
    return API.Put(`userManagement/user/${username}`, data);
  }

  static updateCurrentUser(data) {
    return API.Put("userManagement/user/", data);
  }

  static changePassword(data) {
    return API.Post("userManagement/changePassword", data);
  }

  static editCaptionOfPermission(permissionId, params) {
    return API.Put(`userManagement/permission/${permissionId}`, null, params);
  }

  static createRole(data) {
    return API.Post("userManagement/role", data);
  }

  static deleteRole(role) {
    return API.Delete(`userManagement/role/${role}`);
  }

  static editCaptionOfRole(role, params) {
    return API.Put(`userManagement/role/${role}`, null, params);
  }

  static getRole(role) {
    return API.Get(`userManagement/role/${role}`);
  }

  static deletePermissionFromRole(role, params) {
    return API.Delete(`userManagement/role/${role}/deletePermission`, params);
  }

  static assignPermissionToRole(role, params) {
    return API.Post(
      `userManagement/role/${role}/assignPermission`,
      null,
      params
    );
  }

  render = () => <API />;
}

export default UserManagement;
