import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import validator from "validator";
import { CheckOutlined } from "@ant-design/icons";
import { Input, Row, Col, Form, Button, Tooltip, Spin } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setTitle,
  setButtonBar,
  establishCurrentUser,
} from "../../../redux/actions";
import { Regex } from "./../../../resources/constants";

// API
import UserManagementAPI from "../../../http/UserManagement";

// Utils
import Page from "../../../utils/Page";

const { isNumber } = Regex;

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    mobile: state.config.mobile,
    user: state.config.user,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    { setTitle, setButtonBar, establishCurrentUser },
    dispatch
  );

@connect(mapStateToProps, mapDispatchToProps)
class EditUser extends Component {
  constructor(props) {
    super(props);
    this.formRef = createRef();
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.props.setTitle("Dashboard.Profile.EditUser.description");
    const { Share } = this.props.language;
    this.props.setButtonBar(
      <>
        <Tooltip placement="top" title={Share.submit}>
          <Button
            shape="circle"
            htmlType="submit"
            icon={<CheckOutlined className="fixed" />}
            size="large"
            type="primary"
            form="editUser"
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
      this.getUser();
      this.setState({ loading: false });
    });
  }

  getUser() {
    const { user } = this.props;
    this.formRef.current.setFieldsValue({
      username: user.username,
      name: user.name,
      identification: user.identification,
      phoneNumber: user.phoneNumber ? user.phoneNumber.slice(2) : "",
      address: user.address,
    });
  }

  validationPhoneNumber = (rule, value, callback) => {
    const { Validation } = this.props.language;
    if (
      value &&
      !validator.isLength(this.formRef.current.getFieldValue("phoneNumber"), {
        min: 9,
        max: 9,
      })
    ) {
      callback([Validation.length, 9].join(" "));
    } else {
      callback();
    }
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
    };
    this.setState({ loading: true }, () =>
      UserManagementAPI.updateCurrentUser(data).then((result) => {
        if (result.success) {
          this.props.establishCurrentUser();
        }
        this.setState({ loading: false });
      })
    );
  };

  render() {
    const { EditUser: language } = this.props.language.Dashboard.Profile;
    const { Share, Validation } = this.props.language;
    const { loading } = this.state;
    const isMobile = !!this.props.mobile;

    return (
      <Page
        id={"dashboard-profile-edituser"}
        title={language.title}
        description={language.description}
        noCrawl
      >
        <UserManagementAPI />
        <section className="card">
          <div className="card-body">
            <Spin spinning={loading} size="large" tip={Share.loading}>
              <Form ref={this.formRef} name="editUser" onFinish={this.onFinish}>
                <Row gutter={20}>
                  <Col className="gutter-row" xs={24} lg={12}>
                    <Form.Item
                      label={language.username}
                      labelCol={{ lg: { span: 4 } }}
                      name="username"
                      rules={[]}
                    >
                      <Input disabled={true} />
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
                          pattern: isNumber,
                          message: [
                            language.phoneNumber,
                            Validation.pattern,
                          ].join(" "),
                        },
                        {
                          validator: this.validationPhoneNumber,
                        },
                      ]}
                    >
                      <Input
                        addonAfter="09"
                        maxLength={9}
                        className="inputAddonAfter"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col className="gutter-row" xs={24} lg={12}>
                    <Form.Item
                      label={language.address}
                      labelCol={{ lg: { span: 4 } }}
                      name="address"
                      rules={[]}
                    >
                      <Input.TextArea maxLength="200" rows={4} />
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

export default EditUser;

EditUser.propTypes = {
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  language: PropTypes.object,
  user: PropTypes.object,
  setTitle: PropTypes.func,
  setButtonBar: PropTypes.func,
  establishCurrentUser: PropTypes.func,
};
