import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  EditOutlined,
  LockOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, Dropdown, Avatar, Modal } from "antd";
import { Link } from "react-router-dom";

// Pages
import ChangePassword from "../../../../pages/Dashboard/Profile/ChangePassword";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    direction: state.config.direction,
    user: state.config.user,
  };
};

@connect(mapStateToProps)
class ProfileMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        visible: false,
      },
    };
  }

  handleModalVisible = (value) => {
    this.setState({
      modal: {
        visible: value,
      },
    });
  };

  handleModalCancel = (event) => {
    this.setState({
      modal: {
        visible: false,
      },
    });
  };

  render() {
    const { Dashboard: language } = this.props.language.Layouts;
    const { visible } = this.state.modal;
    const { user } = this.props;

    const menu = (
      <Menu selectable={false}>
        <Menu.Item className="user-info">
          <React.Fragment>
            <UserOutlined />
            <strong>{user.name}</strong>
          </React.Fragment>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Link to="/edit-user">
            <EditOutlined />
            <span>{language.editUser}</span>
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={() => this.handleModalVisible(true)}>
          <LockOutlined />
          <span>{language.changePassword}</span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Link to="/logout">
            <LogoutOutlined />
            <span>{language.logout}</span>
          </Link>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className="topbar__dropdown d-inline-block">
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomLeft">
          <a className="ant-dropdown-link" href="/">
            <Avatar
              className="topbar__avatar"
              size="large"
              icon={<UserOutlined />}
              shape="square"
            />
          </a>
        </Dropdown>
        <Modal
          width={450}
          className="ant-modal-centered ant-modal-form"
          title={
            <React.Fragment>
              <LockOutlined />
              <span>{language.changePassword}</span>
            </React.Fragment>
          }
          visible={visible}
          onCancel={this.handleModalCancel}
          destroyOnClose={true}
          footer={[]}
        >
          <ChangePassword
            handleModalVisible={this.handleModalVisible.bind(this)}
          />
        </Modal>
      </div>
    );
  }
}

ProfileMenu.propTypes = {
  language: PropTypes.object,
  user: PropTypes.object,
  direction: PropTypes.string,
};

export default ProfileMenu;
