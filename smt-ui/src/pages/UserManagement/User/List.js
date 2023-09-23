import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Tooltip, Table, Menu, Dropdown, Button, Modal, Switch } from "antd";
import _ from "lodash";
import { Link } from "react-router-dom";
import { setTitle, setButtonBar } from "../../../redux/actions";

import {
  ContactsOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  FilterOutlined,
  LockOutlined,
  PlusOutlined,
} from "@ant-design/icons";

// API
import UserManagementAPI from "./../../../http/UserManagement";

// Utils
import Page from "../../../utils/Page";

// User
import Filter from "./Filter";
import ResetPassword from "./ResetPassword";
import SetAccess from "./SetAccess";

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
      users: [],
      filters: {},
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
    const { pagination } = this.state;
    this.props.setTitle("UserManagement.User.List.description");
    this.props.setButtonBar(
      <>
        <Link to="/user-management/user/add">
          <Tooltip placement="top" title={Share.add}>
            <Button
              shape="circle"
              icon={<PlusOutlined className="fixed" />}
              size="large"
              type="primary"
            />
          </Tooltip>
        </Link>
        <Tooltip placement="top" title={Share.filters}>
          <Button
            shape="circle"
            icon={<FilterOutlined className="fixed" />}
            size="large"
            type="primary"
            onClick={() => {
              this.setState(
                {
                  form: {
                    width: 400,
                    icon: <FilterOutlined />,
                    title: Share.filters,
                    component: "Filter",
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
    const params = {
      page: pagination.page,
      size: pagination.pageSize,
    };
    this.getUserList(params);
  }

  getUserList(params) {
    const { pagination, filters } = this.state;
    this.setState({ loading: true });
    UserManagementAPI.getUserList({ ...params, ...filters }).then((result) => {
      if (result.success) {
        let { content, totalElements, size, number } = result.data;
        let row = number * size;
        content.forEach((value) => {
          value.key = ++row;
        });
        this.setState({
          users: content,
          pagination: _.merge(pagination, {
            total: totalElements,
            current: params.page + 1,
          }),
        });
      }
      this.setState({ loading: false });
    });
  }

  showDeleteConfirm = () => {
    let { Share } = this.props.language;
    const { pagination, currentRow } = this.state;
    let params = {
      page:
        pagination.total % pagination.pageSize !== 1
          ? pagination.page
          : pagination.page - 1,
      size: pagination.pageSize,
    };
    Modal.confirm({
      icon: <DeleteOutlined />,
      title: Share.deleteConfirmTitle,
      okText: Share.deleteConfirmOk,
      okType: "danger",
      cancelText: Share.deleteConfirmCancel,
      onOk: () => {
        if (currentRow) {
          UserManagementAPI.deleteUser(currentRow.username).then((result) => {
            if (result.success) this.getUserList(params);
          });
        }
      },
      onCancel: () => {},
    });
  };

  changeEnabledUser(username, paramsEnable) {
    const { pagination } = this.state;
    const params = {
      page: pagination.page,
      size: pagination.pageSize,
    };
    UserManagementAPI.changeEnabledUser(username, {
      enabled: paramsEnable,
    }).then((result) => {
      if (result.success) this.getUserList(params);
    });
  }

  handleModalVisible = (value, filters = null) => {
    const { pagination } = this.state;
    const params = {
      page: pagination.page,
      size: pagination.pageSize,
    };
    this.setState(
      (state) => ({
        filters: _.isNull(filters) ? state.filters : filters,
        modal: {
          visible: value,
        },
      }),
      () => {
        if (!_.isNull(filters)) this.getUserList(params);
      }
    );
  };

  handleModalComponent = (component) => {
    const { currentRow, filters } = this.state;
    switch (component) {
      case "Filter":
        return (
          <Filter
            filters={filters}
            handleModalVisible={this.handleModalVisible.bind(this)}
          />
        );
      case "ResetPassword":
        return (
          <ResetPassword
            username={currentRow.username}
            handleModalVisible={this.handleModalVisible.bind(this)}
          />
        );
      case "SetAccess":
        return (
          <SetAccess
            username={currentRow.username}
            handleModalVisible={this.handleModalVisible.bind(this)}
          />
        );
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

  handleTableChange = (pagination, filters, sorter) => {
    const params = {
      page: pagination.current - 1,
      size: pagination.pageSize,
      sorter: _.isEmpty(sorter)
        ? null
        : `${sorter.field},${sorter.order.slice(0, -3)}`,
    };
    this.getUserList(params);
  };

  render() {
    const { List: language } = this.props.language.UserManagement.User;
    const { Share } = this.props.language;
    const isMobile = !!this.props.mobile;
    const { pagination, users, currentRow, form, loading } = this.state;
    const { visible } = this.state.modal;
    const menu = (
      <Menu>
        <Menu.Item key="1">
          <Link to={`/user-management/user/edit/${currentRow.username}`}>
            <span>{Share.edit}</span>
            <EditOutlined />
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <div
            onClick={() => {
              this.setState({
                form: {
                  width: 400,
                  icon: <LockOutlined />,
                  title: `${language.resetPassword} ${currentRow.username}`,
                  component: "ResetPassword",
                  destroyOnClose: true,
                },
              });
              this.handleModalVisible(true);
            }}
          >
            <span>{Share.resetPassword}</span>
            <LockOutlined />
          </div>
        </Menu.Item>
        <Menu.Item key="3">
          <div
            onClick={() => {
              this.setState({
                form: {
                  width: 500,
                  icon: <ContactsOutlined />,
                  title: `${language.setAccess} ${currentRow.username}`,
                  component: "SetAccess",
                  destroyOnClose: true,
                },
              });
              this.handleModalVisible(true);
            }}
          >
            <span>{Share.setAccess}</span>
            <ContactsOutlined />
          </div>
        </Menu.Item>
        <Menu.Item key="4">
          <div onClick={() => this.showDeleteConfirm()}>
            <span>{Share.delete}</span>
            <DeleteOutlined />
          </div>
        </Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: Share.row,
        dataIndex: "key",
        key: "key",
        sorter: (a, b) => a.key - b.key,
        fixed: !isMobile ? "left" : null,
      },
      {
        title: language.fullName,
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => {
          a.name = a.name === null ? "" : a.name;
          b.name = b.name === null ? "" : b.name;
          return a.name.localeCompare(b.name);
        },
      },
      {
        title: language.username,
        dataIndex: "username",
        key: "username",
        sorter: (a, b) => {
          a.username = a.username === null ? "" : a.username;
          b.username = b.username === null ? "" : b.username;
          return a.username.localeCompare(b.username);
        },
      },
      {
        title: language.identification,
        dataIndex: "identification",
        key: "identification",
        sorter: (a, b) => {
          a.identification = a.identification === null ? "" : a.identification;
          b.identification = b.identification === null ? "" : b.identification;
          return a.identification.localeCompare(b.identification);
        },
      },
      {
        title: language.phoneNumber,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: (a, b) => {
          a.phoneNumber = a.phoneNumber === null ? "" : a.phoneNumber;
          b.phoneNumber = b.phoneNumber === null ? "" : b.phoneNumber;
          return a.phoneNumber.localeCompare(b.phoneNumber);
        },
      },
      {
        title: language.enable,
        dataIndex: "enable",
        key: "enable",
        render: (text, record) => (
          <Switch
            checkedChildren={Share.active}
            unCheckedChildren={Share.inactive}
            checked={record.enable}
            style={{ width: 75 }}
            onClick={() =>
              this.changeEnabledUser(record.username, !record.enable)
            }
          />
        ),
      },
      {
        title: Share.operation,
        dataIndex: "operation",
        key: "operation",
        fixed: !isMobile ? "right" : null,
        render: (text, record) => (
          <Dropdown
            overlay={menu}
            trigger={["click"]}
            onClick={() => {
              this.setState({ currentRow: record });
            }}
          >
            <a>
              <EllipsisOutlined style={{ fontSize: 24, fontWeight: "bold" }} />
            </a>
          </Dropdown>
        ),
      },
    ];
    return (
      <Page
        id={"usermanagement-user-list"}
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
        <UserManagementAPI />
        <section className="card">
          <div className="card-body">
            <Table
              loading={{
                spinning: loading,
                size: "large",
                tip: Share.loading,
              }}
              pagination={pagination}
              onChange={this.handleTableChange}
              columns={columns}
              dataSource={users}
              scroll={{ x: true }}
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
