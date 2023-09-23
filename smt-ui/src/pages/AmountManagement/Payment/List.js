import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import FontAwesome from "react-fontawesome";
import { Tooltip, Table, Button, Modal } from "antd";
import { setTitle, setButtonBar } from "../../../redux/actions";
import {
  DeleteOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

// API
import AmountManagementAPI from "./../../../http/AmountManagement";

// Utils
import Page from "../../../utils/Page";
import DateTime from "../../../utils/DateTime";
import { format } from "../../../utils/Number";

// User
import Transfer from "./Transfer";
import Add from "./Add";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    mobile: state.config.mobile,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setTitle, setButtonBar }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
class List extends Component {
  constructor(props) {
    super(props);

    const { Share } = this.props.language;

    this.state = {
      payments: [],
      paymentDetails: [],
      form: {
        width: null,
        icon: null,
        title: "",
        component: "",
        destroyOnClose: true,
      },
      modal: {
        visible: false,
      },
      currentRow: {},
      loading: true,
      loadingExpand: false,
      paginationExpand: {
        total: null,
        current: 1,
        page: 0,
        pageSize: 20,
        showTotal: (total) => `${Share.paginationShowTotal} (${total})`,
        showSizeChanger: true,
        showQuickJumper: true,
      },
      pagination: {
        total: null,
        current: 1,
        page: 0,
        pageSize: 20,
        showTotal: (total) => `${Share.paginationShowTotal} (${total})`,
        showSizeChanger: true,
        showQuickJumper: true,
      },
    };
  }

  componentWillUnmount() {
    this.props.setButtonBar(null);
  }

  componentDidMount() {
    const { Share } = this.props.language;
    this.props.setTitle("AmountManagement.Payment.List.title");
    this.props.setButtonBar(
      <>
        <Tooltip placement="top" title={Share.upload}>
          <Button
            shape="circle"
            icon={<UploadOutlined className="fixed" />}
            size="large"
            type="primary"
            onClick={() => {
              this.setState(
                {
                  form: {
                    width: 400,
                    icon: <UploadOutlined />,
                    title: Share.upload,
                    component: "Add",
                    destroyOnClose: true,
                  },
                },
                () => this.handleModalVisible(true)
              );
            }}
          />
        </Tooltip>
      </>
    );
    this.getPaymentList();
  }

  getPaymentList() {
    this.setState({ loading: true }, () =>
      AmountManagementAPI.getFilesList().then((result) => {
        if (result.success) {
          let {
            data: { content },
          } = result.data;
          content.forEach((value, index) => {
            value.key = ++index;
          });
          this.setState({
            payments: content,
          });
        }
        this.setState({ loading: false });
      })
    );
  }

  getPaymentDetailsList(fileId, params) {
    this.setState({ loadingExpand: true }, () =>
      AmountManagementAPI.getFileDetails({ fileId, ...params }).then(
        (result) => {
          if (result.success) {
            let {
              data: { content, totalElements, size, number },
            } = result.data;
            let row = number * size;
            const { pagination } = this.state;
            content.forEach((value) => {
              value.key = ++row;
              value.fileId = fileId;
            });
            this.setState({
              paymentDetails: content,
              pagination: _.merge(pagination, {
                total: totalElements,
                current: params.page + 1,
              }),
            });
          }
          this.setState({ loadingExpand: false });
        }
      )
    );
  }

  showDeleteConfirm = (fileId, recordId) => {
    let { Share } = this.props.language;
    Modal.confirm({
      icon: <DeleteOutlined />,
      title: Share.deleteConfirmTitle,
      okText: Share.deleteConfirmOk,
      okType: "danger",
      cancelText: Share.deleteConfirmCancel,
      onOk: () =>
        AmountManagementAPI.deleteRecord({ recordId }).then((result) => {
          if (result.success) {
            const { paginationExpand } = this.state;
            this.getPaymentDetailsList(fileId, {
              page: paginationExpand.page,
              size: paginationExpand.pageSize,
            });
          }
        }),
      onCancel: () => {},
    });
  };

  showSendMessageConfirm = (fileId) => {
    const { Share } = this.props.language;
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: Share.sendMessageTitle,
      okText: Share.deleteConfirmOk,
      okType: "danger",
      cancelText: Share.deleteConfirmCancel,
      onOk: () => AmountManagementAPI.sendVerificationMessage({ fileId }),
      onCancel: () => {},
    });
  };

  handleModalVisible = (value) => {
    this.setState({
      modal: {
        visible: value,
      },
    });
    this.getPaymentList();
  };

  handleModalComponent = (component) => {
    const { currentRow } = this.state;
    switch (component) {
      case "Transfer":
        return (
          <Transfer
            fileId={currentRow.fileId}
            handleModalVisible={this.handleModalVisible.bind(this)}
          />
        );
      case "Add":
        return <Add handleModalVisible={this.handleModalVisible.bind(this)} />;
      default:
        return null;
    }
  };

  handleModalCancel = (event) => {
    this.setState({
      modal: {
        visible: false,
      },
    });
  };

  handleTableChange = (pagination, filters, sorter, extra) => {
    if (!_.isEmpty(extra.currentDataSource)) {
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        sorter: _.isEmpty(sorter)
          ? null
          : `${sorter.field},${sorter.order.slice(0, -3)}`,
      };
      this.getPaymentDetailsList(extra.currentDataSource[0].fileId, params);
    }
  };

  render() {
    const { List: language } = this.props.language.AmountManagement.Payment;
    const {
      Share,
      Enums: { Payment },
    } = this.props.language;
    const isMobile = !!this.props.mobile;
    const {
      pagination,
      payments,
      paymentDetails,
      paginationExpand,
      form,
      loading,
      loadingExpand,
    } = this.state;
    const { visible } = this.state.modal;
    const columns = [
      {
        title: Share.row,
        dataIndex: "key",
        key: "key",
        sorter: (a, b) => a.key - b.key,
        fixed: !isMobile ? "left" : null,
      },
      {
        title: language.fileId,
        dataIndex: "fileId",
        key: "fileId",
        sorter: (a, b) => a.fileId - b.fileId,
      },
      {
        title: language.fileName,
        dataIndex: "fileName",
        key: "fileName",
        sorter: (a, b) => {
          a.fileName = a.fileName === null ? "" : a.fileName;
          b.fileName = b.fileName === null ? "" : b.fileName;
          return a.fileName.localeCompare(b.fileName);
        },
      },
      {
        title: language.creatorUser,
        dataIndex: "creatorUser",
        key: "creatorUser",
        sorter: (a, b) => {
          a.creatorUser = a.creatorUser === null ? "" : a.creatorUser;
          b.creatorUser = b.creatorUser === null ? "" : b.creatorUser;
          return a.creatorUser.localeCompare(b.creatorUser);
        },
      },
      {
        title: language.uploadDate,
        dataIndex: "uploadDate",
        key: "uploadDate",
        sorter: (a, b) => a.uploadDate - b.uploadDate,
        render: (text, record) => DateTime.jDate(text, true),
      },
      {
        title: language.submitDate,
        dataIndex: "submitDate",
        key: "submitDate",
        sorter: (a, b) => a.submitDate - b.submitDate,
        render: (text, record) => DateTime.jDate(text, true),
      },
      {
        title: language.fromAccount,
        dataIndex: "fromAccount",
        key: "fromAccount",
        sorter: (a, b) => {
          a.fromAccount = a.fromAccount === null ? "" : a.fromAccount;
          b.fromAccount = b.fromAccount === null ? "" : b.fromAccount;
          return a.fromAccount.localeCompare(b.fromAccount);
        },
      },
      {
        title: language.fileStatus,
        dataIndex: "fileStatus",
        key: "fileStatus",
        sorter: (a, b) => {
          a.fileStatus = a.fileStatus === null ? "" : a.fileStatus;
          b.fileStatus = b.fileStatus === null ? "" : b.fileStatus;
          return a.fileStatus.localeCompare(b.fileStatus);
        },
        render: (text, record) => Payment[text],
      },
      {
        title: Share.sendMessage,
        dataIndex: "sendMessage",
        key: "sendMessage",
        render: (text, record) => (
          <Button
            ghost
            type="primary"
            shape="circle"
            icon={<FontAwesome name="paper-plane" />}
            onClick={() => this.showSendMessageConfirm(record.fileId)}
          />
        ),
      },
      {
        title: Share.pay,
        dataIndex: "pay",
        key: "pay",
        fixed: !isMobile ? "right" : null,
        render: (text, record) => (
          <Button
            type="primary"
            shape="circle"
            icon={<FontAwesome name="usd" />}
            size="large"
            onClick={() => {
              this.setState(
                {
                  form: {
                    width: 400,
                    icon: <FontAwesome name="usd" />,
                    title: Share.pay,
                    component: "Transfer",
                    destroyOnClose: true,
                  },
                  currentRow: record,
                },
                () => this.handleModalVisible(true)
              );
            }}
          />
        ),
      },
    ];
    const columnsExpand = [
      {
        title: Share.row,
        dataIndex: "key",
        key: "key",
        sorter: (a, b) => a.key - b.key,
        fixed: !isMobile ? "left" : null,
      },
      {
        title: language.recordId,
        dataIndex: "recordId",
        key: "recordId",
        sorter: (a, b) => a.recordId - b.recordId,
      },
      {
        title: `${language.amount} (${Share.rial})`,
        dataIndex: "amount",
        key: "amount",
        sorter: (a, b) => a.amount - b.amount,
        render: (text, record) => format(text),
      },
      {
        title: language.destBankCode,
        dataIndex: "destBankCode",
        key: "destBankCode",
        sorter: (a, b) => a.destBankCode - b.destBankCode,
      },
      {
        title: language.destComment,
        dataIndex: "destComment",
        key: "destComment",
        sorter: (a, b) => {
          a.destComment = a.destComment === null ? "" : a.destComment;
          b.destComment = b.destComment === null ? "" : b.destComment;
          return a.destComment.localeCompare(b.destComment);
        },
      },
      {
        title: language.sourceComment,
        dataIndex: "sourceComment",
        key: "sourceComment",
        sorter: (a, b) => {
          a.sourceComment = a.sourceComment === null ? "" : a.sourceComment;
          b.sourceComment = b.sourceComment === null ? "" : b.sourceComment;
          return a.sourceComment.localeCompare(b.sourceComment);
        },
      },
      {
        title: language.destDepositNo,
        dataIndex: "destDepositNo",
        key: "destDepositNo",
        sorter: (a, b) => {
          a.destDepositNo = a.destDepositNo === null ? "" : a.destDepositNo;
          b.destDepositNo = b.destDepositNo === null ? "" : b.destDepositNo;
          return a.destDepositNo.localeCompare(b.destDepositNo);
        },
      },
      {
        title: language.destFirstName,
        dataIndex: "destFirstName",
        key: "destFirstName",
        sorter: (a, b) => {
          a.destFirstName = a.destFirstName === null ? "" : a.destFirstName;
          b.destFirstName = b.destFirstName === null ? "" : b.destFirstName;
          return a.destFirstName.localeCompare(b.destFirstName);
        },
      },
      {
        title: language.destLastName,
        dataIndex: "destLastName",
        key: "destLastName",
        sorter: (a, b) => {
          a.destLastName = a.destLastName === null ? "" : a.destLastName;
          b.destLastName = b.destLastName === null ? "" : b.destLastName;
          return a.destLastName.localeCompare(b.destLastName);
        },
      },
      {
        title: language.destSheba,
        dataIndex: "destSheba",
        key: "destSheba",
        sorter: (a, b) => {
          a.destSheba = a.destSheba === null ? "" : a.destSheba;
          b.destSheba = b.destSheba === null ? "" : b.destSheba;
          return a.destSheba.localeCompare(b.destSheba);
        },
      },
      {
        title: language.paymentId,
        dataIndex: "paymentId",
        key: "paymentId",
        sorter: (a, b) => a.paymentId - b.paymentId,
      },
      {
        title: language.paymentType,
        dataIndex: "paymentType",
        key: "paymentType",
        sorter: (a, b) => {
          a.paymentType = a.paymentType === null ? "" : a.paymentType;
          b.paymentType = b.paymentType === null ? "" : b.paymentType;
          return a.paymentType.localeCompare(b.paymentType);
        },
        render: (text, record) => Payment[text],
      },
      {
        title: language.sentDate,
        dataIndex: "sentDate",
        key: "sentDate",
        sorter: (a, b) => a.sentDate - b.sentDate,
        render: (text, record) => DateTime.jDate(text, true),
      },
      {
        title: language.status,
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => {
          a.status = a.status === null ? "" : a.status;
          b.status = b.status === null ? "" : b.status;
          return a.status.localeCompare(b.status);
        },
        render: (text, record) => Payment[text],
      },
      {
        title: Share.delete,
        dataIndex: "delete",
        key: "delete",
        fixed: !isMobile ? "right" : null,
        render: (text, record) => (
          <Button
            danger
            type="primary"
            shape="circle"
            icon={<FontAwesome name="times" />}
            onClick={() =>
              this.showDeleteConfirm(record.fileId, record.recordId)
            }
          />
        ),
      },
    ];
    return (
      <Page
        id={"amountmanagement-payment-list"}
        title={language.title}
        description={language.description}
        noCrawl
      >
        <Modal
          title={
            <>
              {form.icon}
              <span>{form.title}</span>
            </>
          }
          className="ant-modal-centered ant-modal-form"
          width={form.width}
          visible={visible}
          onCancel={this.handleModalCancel.bind(this)}
          destroyOnClose={form.destroyOnClose}
          footer={[]}
        >
          {this.handleModalComponent(form.component)}
        </Modal>
        <AmountManagementAPI />
        <section className="card">
          <div className="card-body">
            <Table
              loading={{
                spinning: loading,
                size: "large",
                tip: Share.loading,
              }}
              pagination={pagination}
              columns={columns}
              dataSource={payments}
              scroll={{ x: true }}
              expandable={{
                expandedRowRender: () => (
                  <Table
                    loading={{
                      spinning: loadingExpand,
                      size: "large",
                      tip: Share.loading,
                    }}
                    pagination={paginationExpand}
                    onChange={this.handleTableChange}
                    columns={columnsExpand}
                    dataSource={paymentDetails}
                    scroll={{ x: true }}
                  />
                ),
                onExpand: (expanded, record) => {
                  expanded
                    ? this.getPaymentDetailsList(record.fileId, {
                        page: paginationExpand.page,
                        size: paginationExpand.pageSize,
                      })
                    : this.setState({ paymentDetails: [] });
                },
              }}
            />
          </div>
        </section>
      </Page>
    );
  }
}

List.propTypes = {
  language: PropTypes.object,
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  history: PropTypes.object,
  setTitle: PropTypes.func,
  setButtonBar: PropTypes.func,
};

export default List;
