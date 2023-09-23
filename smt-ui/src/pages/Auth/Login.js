import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import {
  LockOutlined,
  UserOutlined,
  ReloadOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Input, Button, Form, Spin } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setTitle, loginUser } from "./../../redux/actions";
import { Global } from "./../../resources/constants";

// Utils
import Page from "./../../utils/Page";
import Notification from "../../utils/Notification";
import { english } from "../../utils/Number";

const { HOST } = Global;
const urlCaptcha = `${HOST}captcha/?time=`;

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    mobile: state.config.mobile,
    direction: state.config.direction,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setTitle, loginUser }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      captcha: urlCaptcha + new Date(),
    };
    this.formRef = createRef();
    this.Notification = new Notification(props);
  }

  componentDidMount() {
    this.props.setTitle("Login.description");
  }

  reloadCaptcha = () => {
    this.setState({
      captcha: urlCaptcha + new Date(),
    });
    this.formRef.current.setFieldsValue({ userTypeCaptcha: "" });
  };

  onFinish = (values) => {
    const { Login: language } = this.props.language.Auth;
    const { loginUser } = this.props;
    const { username, password, userTypeCaptcha } = values;
    loginUser(
      english(username),
      english(password),
      english(userTypeCaptcha)
    ).then((result) => {
      if (!result.success) {
        const { message } = result.data;
        if (message.toLowerCase() === "invalid captcha")
          this.Notification.openNotificationWithIcon(
            "error",
            language.invalidCaptcha
          );
        else if (
          message.toLowerCase() ===
          "authentication failed: user account is locked"
        )
          this.Notification.openNotificationWithIcon(
            "error",
            language.inactiveUser
          );
        else if (
          message.toLowerCase() === "authentication failed: cad credentials"
        )
          this.Notification.openNotificationWithIcon(
            "error",
            language.invalidToken
          );
        else if (
          message.toLowerCase() === "authentication failed: bad credentials"
        )
          this.Notification.openNotificationWithIcon(
            "error",
            language.invalidUser
          );
        else
          this.Notification.openNotificationWithIcon(
            "error",
            language.invalidInformation
          );
      }
      this.reloadCaptcha();
      this.formRef.current.resetFields();
    });
  };

  render() {
    const { Login: language } = this.props.language.Auth;
    const { Validation, Share } = this.props.language;
    const isMobile = !!this.props.mobile;
    const { loading, captcha } = this.state;

    return (
      <Page
        id={"auth-login"}
        title={language.title}
        description={language.description}
      >
        <Spin spinning={loading} size="large" tip={Share.loading}>
          <Form
            ref={this.formRef}
            layout="vertical"
            name="login"
            onFinish={this.onFinish}
            hideRequiredMark
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: [language.username, Validation.required].join(" "),
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={language.username}
              />
            </Form.Item>
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
            <Form.Item className="captcha">
              <img alt={language.userTypeCaptcha} src={captcha} />
              <Button
                shape="circle"
                icon={<ReloadOutlined />}
                onClick={this.reloadCaptcha}
              />
            </Form.Item>
            <Form.Item
              name="userTypeCaptcha"
              rules={[
                {
                  required: true,
                  message: [language.userTypeCaptcha, Validation.required].join(
                    " "
                  ),
                },
              ]}
            >
              <Input
                prefix={<SafetyOutlined />}
                maxLength="5"
                autocomplete="off"
                placeholder={language.userTypeCaptcha}
              />
            </Form.Item>
            <div className="form-actions">
              <Button
                htmlType="submit"
                type="primary"
                className="width-150 mr-4"
              >
                {language.login}
              </Button>
            </div>
          </Form>
        </Spin>
      </Page>
    );
  }
}

export default withRouter(Login);

Login.propTypes = {
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  language: PropTypes.object,
  direction: PropTypes.string,
  history: PropTypes.object,
  setTitle: PropTypes.func,
  loginUser: PropTypes.func,
};
