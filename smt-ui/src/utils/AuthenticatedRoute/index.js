import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

// Pages
import Forbidden from "./../../pages/Error/403";

const isAccess = (roles = ["*"], user) => {
  let { roles: Roles } = user;
  let isAccess = false;

  if (_.isArray(Roles))
    for (let role of Roles) if (roles.includes(role)) isAccess = true;

  if (roles.includes("*")) isAccess = true;

  return isAccess;
};

const AuthenticatedRoute = ({
  layout: Layout,
  component: Component,
  roles: Roles,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      rest.isAuthenticated ? (
        <Layout {...props}>
          {isAccess(Roles, rest.user) ? <Component /> : <Forbidden />}
        </Layout>
      ) : (
        <Redirect
          to={`/?redirect=${props.location.pathname}${props.location.search}`}
        />
      )
    }
  />
);

const mapStateToProps = (state) => ({
  isAuthenticated: state.config.isAuthenticated,
  user: state.config.user,
});

export default connect(mapStateToProps, null)(AuthenticatedRoute);

AuthenticatedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.object,
    PropTypes.func,
  ]),
  layout: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.object,
    PropTypes.func,
  ]),
  location: PropTypes.object,
  roles: PropTypes.array,
};
