import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

const DefaultRoute = ({
  layout: Layout,
  component: Component,
  url: Url,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => (
      <Layout {...props}>
        <Component url={Url} />
      </Layout>
    )}
  />
);

export default DefaultRoute;

DefaultRoute.propTypes = {
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
  url: PropTypes.string,
};
