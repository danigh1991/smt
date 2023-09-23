import React, { Component } from "react";
import PropTypes from "prop-types";
import Breadcrumb from "../Breadcrumb";

class Index extends Component {
  render() {
    const { component: Component } = this.props;

    return (
      <div className="utils__content">
        <Breadcrumb />
        {Component}
      </div>
    );
  }
}

export default Index;

Index.propTypes = {
  component: PropTypes.node,
};
