import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Table, Menu, Dropdown, Button, Modal, Input, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { setTitle, setButtonBar } from "../../../redux/actions";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

// API
import UserManagementAPI from "./../../../http/UserManagement";

// Utils
import Page from "../../../utils/Page";

// Role
import Add from "./Add";

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable ? (
      <Input
        style={{ margin: "-5px 0" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      value
    )}
  </div>
);

EditableCell.propTypes = {
  editable: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

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
      roles: [],
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
        pageSize: 20,
        showTotal: (total) => `${Share.paginationShowTotal} (${total})`,
        showSizeChanger: true,
        showQuickJumper: true,
      },
    };

    this.cacheData = [];
  }

  componentWillUnmount() {
    this.props.setButtonBar(null);
  }

  componentDidMount() {
    const { Share } = this.props.language;
    this.props.setTitle("UserManagement.Role.List.description");
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
    this.getAllRoles();
  }

  handleModalVisible = (value) => {
    this.setState({
      modal: {
        visible: value,
      },
    });
    this.getAllRoles();
  };

  handleModalComponent = (component) => {
    const { currentRow } = this.state;
    switch (component) {
      case "Add":
        return (
          <Add
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
    const { currentRow } = this.state;
    Modal.confirm({
      icon: <DeleteOutlined />,
      title: Share.deleteConfirmTitle,
      okText: Share.deleteConfirmOk,
      okType: "danger",
      cancelText: Share.deleteConfirmCancel,
      onOk: () => {
        if (currentRow) {
          UserManagementAPI.deleteRole(currentRow.role).then((result) => {
            if (result.success) this.getAllRoles();
          });
        }
      },
      onCancel: () => {},
    });
  };

  getAllRoles() {
    UserManagementAPI.getAllRoles().then((result) => {
      if (result.success) {
        let { data: roles } = result;
        console.log("rolesroles", roles);
        roles.forEach(function (value, index) {
          value.key = ++index;
        });
        this.setState({
          roles,
          loading: false,
        });
        this.cacheData = roles.map((item) => ({ ...item }));
      }
    });
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={(value) => this.handleChange(value, record.key, column)}
      />
    );
  }

  handleChange(value, key, column) {
    const newData = [...this.state.roles];
    const target = newData.filter((item) => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ roles: newData });
    }
  }

  edit(key) {
    const newData = [...this.state.roles];
    const target = newData.filter((item) => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ roles: newData });
    }
  }

  handleSave(key) {
    const { roles } = this.state;
    let currentRow = {};
    roles.forEach(function (value, index) {
      if (value.key === key) currentRow = value;
    });
    let params = {
      caption: currentRow.caption,
    };
    UserManagementAPI.editCaptionOfRole(currentRow.role, params).then(
      (result) => {
        if (result.success) this.save(key);
        else this.cancel(key);
      }
    );
  }

  save(key) {
    const newData = [...this.state.roles];
    const target = newData.filter((item) => key === item.key)[0];
    if (target) {
      delete target.editable;
      this.setState({ roles: newData });
    }
  }

  cancel(key) {
    const newData = [...this.state.roles];
    const target = newData.filter((item) => key === item.key)[0];
    if (target) {
      Object.assign(
        target,
        this.cacheData.filter((item) => key === item.key)[0]
      );
      delete target.editable;
      this.setState({ roles: newData });
    }
  }

  render() {
    const { List: language } = this.props.language.UserManagement.Role;
    const { Share } = this.props.language;
    const { pagination, roles, currentRow, form, loading } = this.state;
    const { visible } = this.state.modal;
    const isMobile = !!this.props.mobile;
    const menu = (
      <Menu>
        <Menu.Item key="1">
          <Link to={`/user-management/role/${currentRow.role}`}>
            <span>{Share.viewPermissions}</span>
            <EyeOutlined />
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <div onClick={() => this.edit(currentRow.key)}>
            <span>{Share.edit}</span>
            <EditOutlined />
          </div>
        </Menu.Item>
        <Menu.Item key="3">
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
        dataIndex: "role",
        key: "role",
        sorter: (a, b) => {
          a.role = a.role === null ? "" : a.role;
          b.role = b.role === null ? "" : b.role;
          return a.role.localeCompare(b.role);
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
        render: (text, record) => this.renderColumns(text, record, "caption"),
      },
      {
        title: Share.operation,
        dataIndex: "operation",
        key: "operation",
        render: (text, record) => {
          const { editable } = record;
          return (
            <div className="editable-row-operations">
              {editable ? (
                <span>
                  <a onClick={() => this.handleSave(record.key)}>
                    <CheckCircleOutlined
                      style={{ color: "green", fontSize: "1.8rem" }}
                    />
                  </a>
                  <a onClick={() => this.cancel(record.key)}>
                    <CloseCircleOutlined
                      style={{ color: "red", fontSize: "1.8rem" }}
                    />
                  </a>
                </span>
              ) : (
                <Dropdown
                  overlay={menu}
                  trigger={["click"]}
                  onClick={() => {
                    this.setState({ currentRow: record });
                  }}
                >
                  <a>
                    <EllipsisOutlined
                      style={{ fontSize: 24, fontWeight: "bold" }}
                    />
                  </a>
                </Dropdown>
              )}
            </div>
          );
        },
      },
    ];
    return (
      <Page
        id={"usermanagement-role-list"}
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
              onChange={this.handleTableChange}
              columns={columns}
              dataSource={roles}
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
