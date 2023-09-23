import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Form, Input, Row, Col, Button, Tooltip, Spin } from "antd";
import { setTitle, setButtonBar } from "../../../redux/actions";

// API
import UserManagementAPI from "./../../../http/UserManagement";

// Utils
import Page from "../../../utils/Page";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    mobile: state.config.mobile,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setTitle, setButtonBar }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
class Add extends Component {
  constructor(props) {
    super(props);
    this.formRef = createRef();
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.props.setTitle("UserManagement.User.Add.description");
    const { Share } = this.props.language;
    this.props.setButtonBar(
      <>
        <Link to="/user-management/user">
          <Tooltip placement="top" title={Share.back}>
            <Button
              shape="circle"
              icon={<ArrowRightOutlined className="fixed" />}
              size="large"
              type="primary"
            />
          </Tooltip>
        </Link>
        <Tooltip placement="top" title={Share.submit}>
          <Button
            shape="circle"
            htmlType="submit"
            icon={<CheckOutlined className="fixed" />}
            size="large"
            type="primary"
            form="add"
          />
        </Tooltip>
      </>
    );
  }

  componentWillUnmount() {
    this.props.setButtonBar(null);
  }

  validationPhoneNumber = (rule, value, callback) => {
    const { Validation } = this.props.language;
    if (value && !(value.length === 9))
      callback([Validation.length, 9].join(" "));
    else callback();
  };

  onFinish = (values) => {
    const data = {
      username: values.username,
      name: values.name,
      identification: values.identification,
      phoneNumber: values.phoneNumber
        ? ["09", values.phoneNumber].join("")
        : "",
      address: values.address,
      newPassword: values.password,
    };
    this.setState({ loading: true }, () =>
      UserManagementAPI.createUser(data).then((result) => {
        if (result.success) this.formRef.current.resetFields();
        this.setState({ loading: false });
      })
    );
  };

  render() {
    const { Add: language } = this.props.language.UserManagement.User;
    const { Share, Validation } = this.props.language;
    const isMobile = !!this.props.mobile;
    const { loading } = this.state;

    return (
      <Page
        id={"usermanagement-user-add"}
        title={language.title}
        description={language.description}
        noCrawl
      >
        <UserManagementAPI />
        <section className="card">
          <div className="card-body">
            <Spin spinning={loading} size="large" tip={Share.loading}>
              <Form ref={this.formRef} name="add" onFinish={this.onFinish}>
                <Row gutter={20}>
                  <Col className="gutter-row" xs={24} lg={12}>
                    <Form.Item
                      label={language.username}
                      labelCol={{ lg: { span: 4 } }}
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: [
                            language.username,
                            Validation.required,
                          ].join(" "),
                        },
                      ]}
                    >
                      <Input maxLength="100" />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" xs={24} lg={12}>
                    <Form.Item
                      label={language.fullName}
                      labelCol={{ lg: { span: 6 } }}
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: [
                            language.fullName,
                            Validation.required,
                          ].join(" "),
                        },
                      ]}
                    >
                      <Input maxLength="100" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col className="gutter-row" xs={24} lg={12}>
                    <Form.Item
                      label={language.identification}
                      labelCol={{ lg: { span: 4 } }}
                      name="identification"
                      rules={[
                        {
                          required: true,
                          message: [
                            language.identification,
                            Validation.required,
                          ].join(" "),
                        },
                      ]}
                    >
                      <Input maxLength="20" />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" xs={24} lg={12}>
                    <Form.Item
                      label={language.phoneNumber}
                      labelCol={{ lg: { span: 6 } }}
                      name="phoneNumber"
                      rules={[
                        {
                          validator: this.validationPhoneNumber,
                        },
                      ]}
                    >
                      <Input
                        addonAfter="09"
                        maxLength={9}
                        className="inputAddonAfter"
                        style={{ textAlign: "left" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item name="address">
                      <Input.TextArea
                        maxLength="200"
                        placeholder={language.address}
                        rows={4}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <hr className="space-border" />
                <Row gutter={20}>
                  <Col className="gutter-row" xs={24} lg={12}>
                    <Form.Item
                      label={language.password}
                      labelCol={{ lg: { span: 4 } }}
                      hasFeedback
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: [
                            language.password,
                            Validation.required,
                          ].join(" "),
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder={language.password}
                      />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" xs={24} lg={12}>
                    <Form.Item
                      hasFeedback
                      label={language.confirmPassword}
                      labelCol={{ lg: { span: 5 } }}
                      name="confirm"
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: [
                            language.confirmPassword,
                            Validation.required,
                          ].join(" "),
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
                  </Col>
                </Row>
              </Form>
            </Spin>
          </div>
        </section>
      </Page>
    );
  }
}

export default withRouter(Add);

Add.propTypes = {
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  language: PropTypes.object,
  setTitle: PropTypes.func,
  setButtonBar: PropTypes.func,
  history: PropTypes.object,
};
