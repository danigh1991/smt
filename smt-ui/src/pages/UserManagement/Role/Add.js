import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Input, Button } from "antd";
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
class Add extends Component {
  constructor(props) {
    super(props);
    this.formRef = createRef();
  }

  onFinish = (values) => {
    let data = {
      role: values.role,
      caption: values.caption,
    };
    UserManagementAPI.createRole(data).then((result) => {
      if (result.success) this.props.handleModalVisible(false);
    });
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.handleModalVisible(false);
  };

  render() {
    const { Add: language } = this.props.language.UserManagement.Role;
    const { Share, Validation } = this.props.language;
    const isMobile = !!this.props.mobile;

    return (
      <Form ref={this.formRef} name="filter" onFinish={this.onFinish}>
        <Form.Item
          label={language.name}
          labelCol={{ lg: { span: 4 } }}
          name="role"
          rules={[
            {
              required: true,
              message: [language.name, Validation.required].join(" "),
            },
          ]}
        >
          <Input maxLength="45" />
        </Form.Item>
        <Form.Item
          label={language.caption}
          labelCol={{ lg: { span: 4 } }}
          name="caption"
          rules={[
            {
              required: true,
              message: [language.caption, Validation.required].join(" "),
            },
          ]}
        >
          <Input maxLength="100" />
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

Add.propTypes = {
  language: PropTypes.object,
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  setTitle: PropTypes.func,
  handleModalVisible: PropTypes.func,
};

export default Add;
