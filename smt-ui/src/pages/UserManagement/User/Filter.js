import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { Form, Button, Input } from "antd";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setTitle } from "../../../redux/actions";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    mobile: state.config.mobile,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setTitle }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
class Filter extends Component {
  constructor(props) {
    super(props);
    this.formRef = createRef();
  }

  componentDidMount() {
    this.props.setTitle("UserManagement.User.Filter.description");
    this.formRef.current.setFieldsValue(this.props.filters);
  }

  onFinish = (values) => {
    this.props.handleModalVisible(false, values);
  };

  handleReset = () => {
    this.formRef.current.resetFields();
    this.props.handleModalVisible(false, {});
  };

  render() {
    const { Filter: language } = this.props.language.UserManagement.User;
    const { Share } = this.props.language;
    const isMobile = !!this.props.mobile;

    return (
      <Form ref={this.formRef} name="filter" onFinish={this.onFinish}>
        <Form.Item
          label={language.fullName}
          labelCol={!isMobile ? { lg: { span: 8 } } : null}
          name="name"
          rules={[]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={language.username}
          labelCol={!isMobile ? { lg: { span: 8 } } : null}
          name="username"
          rules={[]}
        >
          <Input />
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
    );
  }
}

export default Filter;

Filter.propTypes = {
  language: PropTypes.object,
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  setTitle: PropTypes.func,
  filters: PropTypes.object,
  handleModalVisible: PropTypes.func,
};
