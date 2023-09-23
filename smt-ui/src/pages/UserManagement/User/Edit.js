import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
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
class Edit extends Component {
  constructor(props) {
    super(props);
    this.formRef = createRef();
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.props.setTitle("UserManagement.User.Edit.description");
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
            form="edit"
          />
        </Tooltip>
      </>
    );
    this.getInitialApi();
  }

  componentWillUnmount() {
    this.props.setButtonBar(null);
  }

  getInitialApi() {
    this.setState({ loading: true }, async () => {
      const { variable: username } = this.props.match.params;
      await this.getUser(username);
      this.setState({ loading: false });
    });
  }

  async getUser(username) {
    await UserManagementAPI.getUser(username).then((result) => {
      if (result.success) {
        const { data: user } = result;
        this.formRef.current.setFieldsValue({
          username: user.username,
          name: user.name,
          identification: user.identification,
          phoneNumber: user.phoneNumber ? user.phoneNumber.slice(2) : "",
          address: user.address,
        });
      }
    });
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
      UserManagementAPI.updateUser(values.username, data).then(
        async (result) => {
          if (result.success) await this.getUser(values.username);
          this.setState({ loading: false });
        }
      )
    );
  };

  render() {
    const { Edit: language } = this.props.language.UserManagement.User;
    const { Share, Validation } = this.props.language;
    const { loading } = this.state;
    const isMobile = !!this.props.mobile;

    return (
      <Page
        id={"usermanagement-user-edit"}
        title={language.title}
        description={language.description}
        noCrawl
      >
        <UserManagementAPI />
        <section className="card">
          <div className="card-body">
            <Spin spinning={loading} size="large" tip={Share.loading}>
              <Form ref={this.formRef} name="edit" onFinish={this.onFinish}>
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
              </Form>
            </Spin>
          </div>
        </section>
      </Page>
    );
  }
}

export default withRouter(Edit);

Edit.propTypes = {
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  language: PropTypes.object,
  setTitle: PropTypes.func,
  setButtonBar: PropTypes.func,
  history: PropTypes.object,
  match: PropTypes.object,
};
