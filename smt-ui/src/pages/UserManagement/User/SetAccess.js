import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Form, Select, Button } from "antd";
import { setTitle } from "../../../redux/actions";

// API
import UserManagementAPI from "./../../../http/UserManagement";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    mobile: state.config.mobile,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setTitle }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
class SetAccess extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roles: [],
      permissions: [],
      assignRoles: [],
      assignPermissions: [],
      catchPermissions: [],
    };
    this.formRef = createRef();
  }

  componentDidMount() {
    this.getInitialApi();
  }

  getInitialApi() {
    this.setState({ loading: true }, async () => {
      let { username } = this.props;
      await this.getAllRoles();
      await this.getAllPermission();
      await this.getUserRoles(username);
      await this.getUserPermissions(username);
      this.setState({ loading: false });
    });
  }

  async getAllRoles() {
    let roles = [];
    await UserManagementAPI.getAllRoles().then((result) => {
      if (result.success) {
        const { data } = result;
        data.forEach(function (value, index) {
          roles.push(
            <Select.Option key={value.role}>{value.caption}</Select.Option>
          );
        });
        this.setState({
          roles,
        });
      }
    });
  }

  async getAllPermission() {
    let permissions = [];
    await UserManagementAPI.getAllPermission().then((result) => {
      if (result.success) {
        const { content } = result.data;
        content.forEach(function (value, index) {
          permissions.push(
            <Select.Option key={value.id}>{value.name}</Select.Option>
          );
        });
        this.setState({
          permissions,
        });
      }
    });
  }

  async getUserRoles(username) {
    return UserManagementAPI.getUser(username).then((result) => {
      if (result.success) {
        const { roles } = result.data;
        let assignRoles = [];
        roles.forEach(function (value, index) {
          assignRoles.push(_.toString(value.role));
        });
        this.formRef.current.setFieldsValue({
          assignRoles,
        });
      }
    });
  }

  async getUserPermissions(username) {
    return UserManagementAPI.getUserPermissions(username).then((result) => {
      if (result.success) {
        let { data: permissions } = result;
        let assignPermissions = [];
        let catchPermissions = [];
        permissions.forEach(function (value, index) {
          if (value.denied)
            catchPermissions.push(_.toString(value.permission.id));
          else assignPermissions.push(_.toString(value.permission.id));
        });
        this.formRef.current.setFieldsValue({
          assignPermissions,
          catchPermissions,
        });
      }
    });
  }

  setAccess(username, values) {
    UserManagementAPI.assignRolesToUser(username, values.assignRoles).then(
      (result) => {
        UserManagementAPI.assignPermissionsToUser(
          username,
          values.newPermissions
        ).then((result) => {
          this.props.handleModalVisible(false);
        });
      }
    );
  }

  handleCancel = (event) => {
    this.props.handleModalVisible(false);
  };

  createNewPermissions(assignPermissions, catchPermissions) {
    let { username } = this.props;
    let newPermissions = [];

    assignPermissions.forEach(function (value, index) {
      newPermissions.push({
        denied: false,
        permission: {
          id: value,
        },
        username: username,
      });
    });

    catchPermissions.forEach(function (value, index) {
      newPermissions.push({
        denied: true,
        permission: {
          id: value,
        },
        username: username,
      });
    });

    return newPermissions;
  }

  onFinish = (values) => {
    let { username } = this.props;
    let newPermissions = this.createNewPermissions(
      values.assignPermissions,
      values.catchPermissions
    );
    let data = {
      assignRoles: values.assignRoles,
      newPermissions: newPermissions,
    };
    this.setAccess(username, data);
  };

  render() {
    const { SetAccess: language } = this.props.language.UserManagement.User;
    const { Validation, Share } = this.props.language;
    const { roles, permissions } = this.state;
    const isMobile = !!this.props.mobile;

    return (
      <Form ref={this.formRef} name="سetAccess" onFinish={this.onFinish}>
        <Form.Item
          label={language.assignRole}
          labelCol={{ lg: { span: 8 } }}
          name="assignRoles"
          rules={[
            {
              required: true,
              message: [language.assignRole, Validation.required].join(" "),
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder={Share.selectPlaceholder}
            optionFilterProp="children"
          >
            {roles}
          </Select>
        </Form.Item>
        <Form.Item
          label={language.assignPermission}
          labelCol={{ lg: { span: 8 } }}
          name="assignPermissions"
          rules={[]}
        >
          <Select
            mode="multiple"
            placeholder={Share.selectPlaceholder}
            optionFilterProp="children"
          >
            {permissions}
          </Select>
        </Form.Item>
        <Form.Item
          label={language.catchPermission}
          labelCol={{ lg: { span: 8 } }}
          name="catchPermissions"
          rules={[]}
        >
          <Select
            mode="multiple"
            placeholder={Share.selectPlaceholder}
            optionFilterProp="children"
          >
            {permissions}
          </Select>
        </Form.Item>
        <Form.Item className="button">
          <Button
            key="reset"
            className="cancel-button"
            onClick={this.handleCancel.bind(this)}
          >
            <DeleteOutlined />
            {!isMobile && <span>{Share.cancel}</span>}
          </Button>
          <Button
            key="submit"
            type="primary"
            className="submit-button"
            htmlType="submit"
          >
            <CheckCircleOutlined />
            {!isMobile && <span>{Share.submit}</span>}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

SetAccess.propTypes = {
  language: PropTypes.object,
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  username: PropTypes.string,
  handleModalVisible: PropTypes.func,
};

export default SetAccess;
