import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Table, Menu, Dropdown, Button, Modal, Tooltip } from "antd";
import {
  DeleteOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { setTitle, setButtonBar } from "../../../redux/actions";

// API
import UserManagementAPI from "./../../../http/UserManagement";

// Utils
import Page from "../../../utils/Page";

// Role
import AddPermission from "./AddPermission";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    mobile: state.config.mobile,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setTitle, setButtonBar }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
class ListPermission extends Component {
  constructor(props) {
    super(props);

    const { Share } = this.props.language;

    this.state = {
      permissions: [],
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
        pageSize: 10,
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
    const {
      params: { variable: role },
    } = this.props.match;
    const { Share } = this.props.language;
    this.props.setTitle("UserManagement.Role.ListPermission.description");
    this.props.setButtonBar(
      <>
        <Tooltip placement="top" title={Share.add}>
          <Button
            shape="circle"
            icon={<PlusOutlined className="fixed" />}
            size="large"
            type="primary"
            onClick={() => {
              this.setState(
                {
                  form: {
                    width: 400,
                    icon: <PlusOutlined />,
                    title: Share.add,
                    component: "AddPermission",
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
    this.getAllRolePermission(role);
  }

  handleModalVisible = (value) => {
    const {
      params: { variable: role },
    } = this.props.match;
    this.setState({
      modal: {
        visible: value,
      },
    });
    this.getAllRolePermission(role);
  };

  handleModalComponent = (component) => {
    const { currentRow } = this.state;
    switch (component) {
      case "AddPermission":
        return (
          <AddPermission
            {...this.props}
            role={currentRow.role}
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

  showDeleteConfirm = () => {
    let { Share } = this.props.language;
    let { currentRow } = this.state;
    const { variable: role } = this.props.match.params;
    let params = {
      permissionId: currentRow.id,
    };
    Modal.confirm({
      icon: <DeleteOutlined />,
      title: Share.deleteConfirmTitle,
      okText: Share.deleteConfirmOk,
      okType: "danger",
      cancelText: Share.deleteConfirmCancel,
      onOk: () => {
        if (currentRow) {
          UserManagementAPI.deletePermissionFromRole(role, params).then(
            (result) => {
              if (result.success) this.getAllRolePermission(role);
            }
          );
        }
      },
      onCancel: () => {},
    });
  };

  getAllRolePermission(role) {
    UserManagementAPI.getRole(role).then((result) => {
      if (result.success) {
        let { refinedPermissions = [] } = result.data;
        refinedPermissions.forEach(function (value, index) {
          value.key = ++index;
        });
        this.setState({
          permissions: refinedPermissions,
          loading: false,
        });
      }
    });
  }

  render() {
    const {
      ListPermission: language,
    } = this.props.language.UserManagement.Role;
    const { Share } = this.props.language;
    const { pagination, permissions, form, loading } = this.state;
    const { visible } = this.state.modal;
    const isMobile = !!this.props.mobile;

    const menu = (
      <Menu>
        <Menu.Item key="1">
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
      },
      {
        title: language.name,
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => {
          a.name = a.name === null ? "" : a.name;
          b.name = b.name === null ? "" : b.name;
          return a.name.localeCompare(b.name);
        },
      },
      {
        title: language.caption,
        dataIndex: "caption",
        key: "caption",
        sorter: (a, b) => {
          a.caption = a.caption === null ? "" : a.caption;
          b.caption = b.caption === null ? "" : b.caption;
          return a.caption.localeCompare(b.caption);
        },
      },
      {
        title: Share.operation,
        dataIndex: "operation",
        key: "operation",
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
        id={"usermanagement-role-list-permission"}
        title={language.title}
        description={language.description}
        noCrawl
      >
        <UserManagementAPI />
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
              dataSource={permissions}
              scroll={{ x: true }}
            />
          </div>
        </section>
      </Page>
    );
  }
}

export default withRouter(ListPermission);

ListPermission.propTypes = {
  language: PropTypes.object,
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  history: PropTypes.object,
  match: PropTypes.object,
  setTitle: PropTypes.func,
  setButtonBar: PropTypes.func,
};
