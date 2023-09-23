import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Form, Button, Input } from "antd";
import { connect } from "react-redux";
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
class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.formRef = createRef();
  }

  onFinish = (values) => {
    const { username } = this.props;
    const { password } = values;
    UserManagementAPI.resetPassword(username, password).then((result) => {
      if (result.success) this.props.handleModalVisible(false);
    });
  };

  handleReset = () => {
    this.formRef.current.resetFields();
    this.props.handleModalVisible(false);
  };

  render() {
    const { ResetPassword: language } = this.props.language.UserManagement.User;
    const { Validation, Share } = this.props.language;
    const isMobile = !!this.props.mobile;

    return (
      <>
        <UserManagementAPI />
        <Form ref={this.formRef} name="resetPassword" onFinish={this.onFinish}>
          <Form.Item
            label={language.password}
            labelCol={{ lg: { span: 6 } }}
            hasFeedback
            name="password"
            rules={[
              {
                required: true,
                message: [language.password, Validation.required].join(" "),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={language.password}
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={language.confirmPassword}
            labelCol={{ lg: { span: 6 } }}
            name="confirm"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: [language.confirmPassword, Validation.required].join(
                  " "
                ),
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(Validation.confirmPassword);
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={language.confirmPassword}
            />
          </Form.Item>
          <Form.Item className="button">
            <Button
              key="reset"
              className="cancel-button"
              onClick={this.handleReset.bind(this)}
            >
              <DeleteOutlined />
              {!isMobile && <span>{Share.reset}</span>}
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
      </>
    );
  }
}

ResetPassword.propTypes = {
  language: PropTypes.object,
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  username: PropTypes.string,
  handleModalVisible: PropTypes.func,
};

export default ResetPassword;
