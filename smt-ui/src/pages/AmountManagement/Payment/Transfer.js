import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { Form, Button, Select, Spin, Input } from "antd";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
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
class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountsNumber: [],
      mobilesNumber: [],
      loading: false,
    };
    this.formRef = createRef();
  }

  componentDidMount() {
    this.getInitialApi();
  }

  getInitialApi() {
    this.setState({ loading: true }, async () => {
      await this.getAccounts();
      await this.getMobiles();
      this.setState({ loading: false });
    });
  }

  async getAccounts() {
    let accountsNumber = [];
    await AmountManagementAPI.getAccounts().then((result) => {
      if (result.success) {
        const { data = [] } = result.data;
        accountsNumber = data;
      }
      this.setState({
        accountsNumber,
      });
    });
  }

  async getMobiles() {
    let mobilesNumber = [];
    await AmountManagementAPI.getVerificationList().then((result) => {
      if (result.success) {
        const { data = [] } = result.data;
        mobilesNumber = data;
      }
      this.setState({
        mobilesNumber,
      });
    });
  }

  onFinish = (values) => {
    const { accountId } = values;
    const { fileId } = this.props;
    let verificationMap = {};
    for (const key in values)
      if (!["accountId"].includes(key)) verificationMap[key] = values[key];

    AmountManagementAPI.moneyTransfer({
      accountId,
      fileId,
      verificationMap,
    }).then((result) => {
      if (result.success) this.props.handleModalVisible(false);
    });
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.handleModalVisible(false);
  };

  render() {
    const { Transfer: language } = this.props.language.AmountManagement.Payment;
    const { Share, Validation } = this.props.language;
    const { mobilesNumber, accountsNumber, loading } = this.state;
    const isMobile = !!this.props.mobile;

    return (
      <Spin spinning={loading} size="large" tip={Share.loading}>
        <Form ref={this.formRef} name="transfer" onFinish={this.onFinish}>
          {mobilesNumber.map((mobileNumber) => (
            <Form.Item
              label={`${mobileNumber.name} ${mobileNumber.surName}`}
              labelCol={!isMobile ? { lg: { span: 8 } } : null}
              name={mobileNumber.id}
              rules={[
                {
                  required: true,
                  message: [
                    `${mobileNumber.name} ${mobileNumber.surName}`,
                    Validation.required,
                  ].join(" "),
                },
              ]}
            >
              <Input maxLength={5} />
            </Form.Item>
          ))}
          <Form.Item
            label={language.accountNumber}
            labelCol={!isMobile ? { lg: { span: 8 } } : null}
            name="accountId"
            rules={[
              {
                required: true,
                message: [language.accountNumber, Validation.required].join(
                  " "
                ),
              },
            ]}
          >
            <Select
              showSearch
              placeholder={Share.selectPlaceholder}
              optionFilterProp="children"
            >
              {accountsNumber.map((account) => (
                <Select.Option key={account.id}>
                  <b>{account.accountNumber}</b> <br /> {account.sheba}
                </Select.Option>
              ))}
            </Select>
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

export default Transfer;

Transfer.propTypes = {
  language: PropTypes.object,
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  setTitle: PropTypes.func,
  fileId: PropTypes.string,
  handleModalVisible: PropTypes.func,
};
