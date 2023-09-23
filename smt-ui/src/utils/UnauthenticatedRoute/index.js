import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import queryString from "query-string";
import { Route, Redirect } from "react-router-dom";

const UnauthenticatedRoute = ({
  layout: Layout,
  component: Component,
  ...rest
}) => {
  let query = queryString.parse(rest.location.search);

  return (
    <Route
      {...rest}
      render={(props) =>
        !rest.isAuthenticated ? (
          <Layout {...props}>
            <Component />
          </Layout>
        ) : (
          <Redirect
            to={
              (query.redirect &&
                rest.location.search.replace("?redirect=", "")) ||
              "/dashboard"
            }
          />
        )
      }
    />
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.config.isAuthenticated,
});

export default connect(mapStateToProps, null)(UnauthenticatedRoute);

UnauthenticatedRoute.propTypes = {
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
};
