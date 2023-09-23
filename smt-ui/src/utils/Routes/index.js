import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import FontAwesome from "react-fontawesome";
import SwaggerUI from "swagger-ui-react";
import { Global } from "../../resources/constants";
import routes from "../../routes";

// Types
import ROUTE from "../Route";
import AUTHENTICATED_ROUTE from "../AuthenticatedRoute";

// Layouts
import DASHBOARD from "../../layouts/Dashboard";
import SITE from "../../layouts/Site";

// Components
import Error_404 from "../../pages/Error/404";

const { HOST } = Global;

const getName = (name, letters = null, join = "") =>
  name
    .split("_")
    .map((item) => {
      switch (letters) {
        case "upper":
          return item.toUpperCase();
        case "lower":
          return item.toLowerCase();
        case "camel":
          return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        default:
          return item;
      }
    })
    .join(join);

class Routes extends Component {
  constructor(props) {
    super(props);
  }

  setItems(routes, beforePath = "/") {
    const { Menu: language } = this.props.language;
    const { isMobile } = this.props;
    return routes.map((item) => {
      let {
        title, // Menu Title
        alias = null, // Route Url Name
        dynamic = false, // Dynamic Route
        type = AUTHENTICATED_ROUTE, // Type Route
        layout = DASHBOARD, // Layout Route
        menu = ["DASHBOARD"], // Show Route in Menu ["DASHBOARD"]
        component = Error_404, // Route Component
        roles = [], // Route Roles
        icon = "", // Menu Item Font Awesome Icon
        style = {}, // Menu Item Style
        isOpen = false, // Menu Item Default Open
        divider = true, // Menu Item Border Bottom
        breadcrumb = ["DASHBOARD"], // Show Route in Breadcrumb ["DASHBOARD"]
        link = true, // Breadcrumb Item is Link
        routes = [], // Under the Routes
      } = item;
      const partOnePath = alias ? (dynamic ? `${alias}/` : alias) : "";
      const partTwoPath = dynamic ? ":variable" : "";
      const path = beforePath + partOnePath + partTwoPath;
      const pathAfterDynamic = alias ? beforePath + alias : beforePath;
      let menus = {};
      let breadcrumbs = {};
      for (let item of menu)
        menus[`menu${getName(item, "camel")}`] = {
          icon: !_.isEmpty(icon) && (
            <FontAwesome
              name={icon}
              className={
                !isMobile && ["SITE"].includes(item)
                  ? "menuTop__icon"
                  : "menuLeft__icon"
              }
            />
          ),
          title: title ? language[title] : "",
          style,
          isOpen,
          divider,
        };
      for (let item of breadcrumb)
        breadcrumbs[`breadcrumb${getName(item, "camel")}`] = {
          title: title ? language[title] : "",
          link,
        };
      return {
        path,
        exact: !!routes,
        type,
        layout,
        component,
        roles: _.isEmpty(roles) ? ["*"] : roles,
        ...menus,
        ...breadcrumbs,
        routes: this.setItems(
          routes,
          !dynamic ? `${path}/` : `${pathAfterDynamic}/`
        ),
      };
    });
  }

  getItems() {
    return [
      ...this.setItems(routes),
      {
        path: "/swagger",
        type: ROUTE,
        layout: Fragment,
        component: SwaggerUI,
        url: `${HOST}v2/api-docs`,
      },
      {
        type: ROUTE,
        layout: SITE,
        component: Error_404,
      },
    ];
  }
}

export default Routes;

Routes.propTypes = {
  isMobile: PropTypes.bool,
  language: PropTypes.object,
  routes: PropTypes.array,
};
