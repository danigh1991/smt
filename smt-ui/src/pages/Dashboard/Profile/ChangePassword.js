import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Input, Button, Form } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setTitle } from "../../../redux/actions";

// API
import UserManagementAPI from "../../../http/UserManagement";

// Utils
import { english } from "../../../utils/Number";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    mobile: state.config.mobile,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setTitle }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.formRef = createRef();
  }

  componentDidMount() {
    this.props.setTitle("Dashboard.Profile.ChangePassword.description");
  }

  onFinish = (values) => {
    UserManagementAPI.changePassword({
      oldPassword: english(values.password),
      newPassword: english(values.newPassword),
      repeatNewPassword: english(values.confirm),
    }).then((result) => {
      if (result.success) this.props.handleModalVisible(false);
    });
  };

  handleCancelModal = (event) => {
    this.props.handleModalVisible(false);
  };

  render() {
    const { ChangePassword: language } = this.props.language.Dashboard.Profile;
    const { Share, Validation } = this.props.language;
    const isMobile = !!this.props.mobile;

    return (
      <>
        <UserManagementAPI />
        <Form ref={this.formRef} name="changePassword" onFinish={this.onFinish}>
          <Form.Item
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
            name="newPassword"
            rules={[
              {
                required: true,
                message: [language.newPassword, Validation.required].join(" "),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={language.newPassword}
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="confirm"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: [
                  language.confirmNewPassword,
                  Validation.required,
                ].join(" "),
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(Validation.confirmNewPassword);
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={language.confirmNewPassword}
            />
          </Form.Item>
          <Form.Item className="button">
            <Button
              key="cancel"
              className="cancel-button"
              onClick={this.handleCancelModal.bind(this)}
            >
              <CloseCircleOutlined />
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
      </>
    );
  }
}

export default ChangePassword;

ChangePassword.propTypes = {
  language: PropTypes.object,
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  setTitle: PropTypes.func,
  handleModalVisible: PropTypes.func,
};
