import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Select, Button } from "antd";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { bindActionCreators } from "redux";
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
class AddPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectPermissions: [],
    };
    this.formRef = createRef();
  }

  componentDidMount() {
    this.getAllPermission();
  }

  getAllPermission() {
    let selectPermissions = [];
    UserManagementAPI.getAllPermission().then((result) => {
      if (result.success) {
        let { content } = result.data;
        content.forEach(function (value, index) {
          selectPermissions.push(
            <Select.Option key={value.id}>{value.name}</Select.Option>
          );
        });
        this.setState({ selectPermissions });
      }
    });
  }

  assignPermissionToRole(role, params) {
    UserManagementAPI.assignPermissionToRole(role, params).then((result) => {
      if (result.success) this.props.handleModalVisible(false);
    });
  }

  handleCancel = (event) => {
    this.props.handleModalVisible(false);
  };

  onFinish = (values) => {
    const { variable: role } = this.props.match.params;
    let params = {
      permissionId: values.name,
    };
    this.assignPermissionToRole(role, params);
  };

  render() {
    const { AddPermission: language } = this.props.language.UserManagement.Role;
    const { Validation, Share } = this.props.language;
    const { selectPermissions } = this.state;
    const isMobile = !!this.props.mobile;

    return (
      <Form ref={this.formRef} name="addPermission" onFinish={this.onFinish}>
        <Form.Item
          label={language.name}
          labelCol={{ lg: { span: 4 } }}
          name="name"
          rules={[
            {
              required: true,
              message: [language.name, Validation.required].join(" "),
            },
          ]}
        >
          <Select
            showSearch
            placeholder={Share.selectPlaceholder}
            optionFilterProp="children"
          >
            {selectPermissions}
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

AddPermission.propTypes = {
  language: PropTypes.object,
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  form: PropTypes.object,
  match: PropTypes.object,
  handleModalVisible: PropTypes.func,
};

export default AddPermission;
