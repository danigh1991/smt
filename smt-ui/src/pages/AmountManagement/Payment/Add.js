import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { Form, Upload, Spin, Button } from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  FileOutlined,
  LoadingOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { bindActionCreators } from "redux";
import { setTitle } from "../../../redux/actions";

// API
import AmountManagementAPI from "./../../../http/AmountManagement";

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
    this.state = {
      fileList: [],
      loading: false,
      uploading: false,
      uploaded: false,
    };
  }

  handleChangeUpload = (info) => {
    const { file, fileList } = info;
    if (!_.isEmpty(fileList))
      this.setState({ fileList: [file] }, () =>
        file.status === "uploading"
          ? this.setState({ uploading: true })
          : this.setState({ uploaded: true })
      );
    else
      this.setState({ fileList: [] }, () =>
        this.formRef.current.resetFields(["file"])
      );
  };

  async uploadFile(data) {
    await AmountManagementAPI.uploadFile(
      data,
      {},
      { "Content-Type": "multipart/form-data" }
    ).then((result) => {
      if (result.success)
        this.setState({ uploading: false, uploaded: false }, () =>
          this.props.handleModalVisible(false)
        );
    });
  }

  onFinish = (values) => {
    const formData = new FormData();
    if (values.file && !_.isEmpty(values.file.fileList))
      formData.append("document", values.file.file);
    this.setState({ loading: true }, () =>
      this.uploadFile(formData).then(
        () => this.setState({ loading: false }),
        () => this.props.handleModalVisible(false)
      )
    );
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.handleModalVisible(false);
  };

  render() {
    const { Add: language } = this.props.language.AmountManagement.Payment;
    const { Share, Validation } = this.props.language;
    const { fileList, uploaded, uploading, loading } = this.state;
    const isMobile = !!this.props.mobile;

    return (
      <Spin spinning={loading} size="large" tip={Share.loading}>
        <Form ref={this.formRef} name="add" onFinish={this.onFinish}>
          <Form.Item
            name="file"
            rules={[
              {
                required: true,
                message: [language.file, Validation.required].join(" "),
              },
            ]}
          >
            <Upload
              className="file-upload"
              listType="picture-card"
              fileList={fileList}
              showUploadList={{
                showPreviewIcon: false,
                showDownloadIcon: false,
                showRemoveIcon: true,
              }}
              multiple={false}
              beforeUpload={() => false}
              onChange={(info) => this.handleChangeUpload(info)}
            >
              <>
                <p className="ant-upload-drag-icon">
                  {uploaded ? (
                    <FileOutlined />
                  ) : uploading ? (
                    <LoadingOutlined />
                  ) : (
                    <InboxOutlined />
                  )}
                </p>
                <p className="ant-upload-text"> {language.file}</p>
                <p className="ant-upload-hint">{Share.attachmentDescription}</p>
              </>
            </Upload>
          </Form.Item>
          <Form.Item className="button">
            <Button
              key="cancel"
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
      </Spin>
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
