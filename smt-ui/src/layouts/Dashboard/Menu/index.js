import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { Scrollbars } from "react-custom-scrollbars";

// Utils
import Routes from "../../../utils/Routes";

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    user: state.config.user,
    isAuthenticated: state.config.isAuthenticated,
  };
};

@connect(mapStateToProps)
@withRouter
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: false };
    this.initialComponent(props);
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  isAccess = (roles = ["*"]) => {
    let Roles = this.props.user.roles;
    let isAccess = false;

    if (_.isArray(Roles))
      for (let role of Roles) if (roles.includes(role)) isAccess = true;

    if (roles.includes("*")) isAccess = true;

    return isAccess;
  };

  createMenuItem = (roles, path, icon, title, style, divider) => {
    if (this.isAccess(roles)) {
      let menuItem = [];
      menuItem.push(
        <Menu.Item key={path} title={title}>
          <span className="menuLeft__item-title" style={style}>
            {title}
          </span>
          {icon.render ? icon.render({ className: "menuLeft__icon" }) : icon}
        </Menu.Item>
      );
      if (divider) menuItem.push(<Menu.Divider key={`div-${path}`} />);
      return menuItem;
    } else return null;
  };

  createSubMenu = (roles, path, icon, title, style, divider, routes) => {
    let createMenuItem = (roles, path, icon, title, style, divider) =>
      this.createMenuItem(roles, path, icon, title, style, divider);
    let createSubMenu = (roles, path, icon, title, style, divider, routes) =>
      this.createSubMenu(roles, path, icon, title, style, divider, routes);
    let isAccess = this.isAccess;
    let menuItems = [];

    for (let menu of routes) {
      if (_.isEmpty(menu.routes)) {
        menuItems.push(
          createMenuItem(
            menu.roles,
            menu.path,
            menu.menuDashboard.icon,
            menu.menuDashboard.title,
            menu.menuDashboard.style,
            menu.menuDashboard.divider
          )
        );
      } else {
        menuItems.push(
          createSubMenu(
            menu.roles,
            menu.path,
            menu.menuDashboard.icon,
            menu.menuDashboard.title,
            menu.menuDashboard.style,
            menu.menuDashboard.divider,
            menu.routes
          )
        );
        if (menu.menuDashboard.divider && isAccess(menu.roles))
          menuItems.push(<Menu.Divider key={`div-${menu.path}`} />);
      }
    }

    if (this.isAccess(roles)) {
      return (
        <SubMenu
          key={path}
          title={
            <span>
              {icon.render
                ? icon.render({ className: "menuLeft__icon" })
                : icon}
              <span className="menuLeft__item-title" style={style}>
                {title}
              </span>
            </span>
          }
        >
          {menuItems}
        </SubMenu>
      );
    } else return null;
  };

  setKeys = (Menus, keys = [], parent = null) => {
    let setKeys = (Menus, keys, parent) => this.setKeys(Menus, keys, parent);
    for (let value of Menus) {
      keys.push({ parent, child: value.path });
      if (!_.isEmpty(value.routes)) setKeys(value.routes, keys, value.path);
    }
    return keys;
  };

  setOpenKeys = (keys, openKeys, key) => {
    let setOpenKeys = (keys, openKeys, key) =>
      this.setOpenKeys(keys, openKeys, key);
    for (let value of keys) {
      if (value.child === key && value.parent !== null) {
        openKeys.push(value.parent);
        setOpenKeys(keys, openKeys, value.parent);
      }
    }
    return openKeys;
  };

  getRoutes = (routes) => {
    let menuItems = [];
    for (const route of routes) {
      const { path, roles, routes, menuDashboard } = route;
      if (!_.isUndefined(menuDashboard)) {
        menuItems.push({
          path,
          roles,
          routes: !_.isEmpty(routes) ? this.getRoutes(routes) : [],
          menuDashboard,
        });
      } else if (!_.isEmpty(routes))
        menuItems = menuItems.concat(this.getRoutes(routes));
    }
    return menuItems;
  };

  initialComponent = (props) => {
    let menuItems = this.getRoutes(new Routes(props).getItems());
    this.menus = [];
    this.keys = this.setKeys(menuItems);
    this.openKeys = this.setOpenKeys(
      this.keys,
      this.setIsOpenKeys(menuItems),
      props.location.pathname
    );
    for (let menu of menuItems) {
      if (_.isEmpty(menu.routes)) {
        this.menus.push(
          this.createMenuItem(
            menu.roles,
            menu.path,
            menu.menuDashboard.icon,
            menu.menuDashboard.title,
            menu.menuDashboard.style,
            menu.menuDashboard.divider
          )
        );
      } else {
        this.menus.push(
          this.createSubMenu(
            menu.roles,
            menu.path,
            menu.menuDashboard.icon,
            menu.menuDashboard.title,
            menu.menuDashboard.style,
            menu.menuDashboard.divider,
            menu.routes
          )
        );
        if (menu.menuDashboard.divider && this.isAccess(menu.roles))
          this.menus.push(<Menu.Divider key={`div-${menu.path}`} />);
      }
    }
  };

  setIsOpenKeys = (Menus, openKeys = []) => {
    let setIsOpenKeys = (Menus, keys) => this.setIsOpenKeys(Menus, keys);
    for (let value of Menus) {
      if (value.menuDashboard.isOpen) openKeys.push(value.path);
      if (!_.isEmpty(value.routes)) setIsOpenKeys(value.routes, openKeys);
    }
    return openKeys;
  };

  handleClick = (event) => {
    this.props.history.push(event.key);
  };

  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find((key) => !this.openKeys.includes(key));
    if (!this.keys.includes(latestOpenKey)) {
      this.openKeys = openKeys;
    } else {
      this.openKeys = latestOpenKey ? [latestOpenKey] : [];
    }
  };

  render() {
    this.initialComponent(this.props);
    const { collapsed } = this.state;
    const { isMobile } = this.props;
    const { App: language } = this.props.language;
    const paramsMobile = {
      width: 256,
      collapsible: false,
      collapsed: false,
      onCollapse: this.onCollapse.bind(this),
    };
    const paramsDesktop = {
      width: 256,
      collapsible: true,
      collapsed: collapsed,
      onCollapse: this.onCollapse.bind(this),
      breakpoint: "lg",
    };
    const params = isMobile ? paramsMobile : paramsDesktop;

    return (
      <Sider {...params} className="menuLeft">
        {collapsed ? (
          <div className="menuLeft__logo menuLeft__logo--collapsed">
            <div className="menuLeft__logoContainer menuLeft__logoContainer--collapsed">
              <Link to="/dashboard">
                <img
                  src={require("./../../../resources/images/logo-mobile.png")}
                  alt={language.title}
                />
              </Link>
            </div>
          </div>
        ) : (
          <div className="menuLeft__logo">
            <div className="menuLeft__logoContainer">
              <Link to="/dashboard">
                <img
                  src={require("./../../../resources/images/logo.png")}
                  alt={language.title}
                />
              </Link>
            </div>
          </div>
        )}
        <Scrollbars
          autoHide
          className="scrollbars"
          style={{
            height: isMobile ? "calc(100vh - 64px)" : "calc(100vh - 112px)",
          }}
        >
          <Menu
            defaultOpenKeys={this.openKeys}
            className="menuLeft__navigation"
            onClick={this.handleClick.bind(this)}
            onOpenChange={this.onOpenChange.bind(this)}
            theme="light"
            selectedKeys={[this.props.location.pathname]}
            mode="inline"
          >
            {this.menus}
          </Menu>
        </Scrollbars>
      </Sider>
    );
  }
}

Index.propTypes = {
  isMobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  language: PropTypes.object,
  user: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Index;
