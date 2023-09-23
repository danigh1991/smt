import React, { Component } from "react";
import PropTypes from "prop-types";

class ButtonBar extends Component {
  render() {
    return (
      <div className="affix-container">
        <div className="affix-background">{this.props.children}</div>
      </div>
    );
  }
}

ButtonBar.propTypes = {
  children: PropTypes.node,
};

export default ButtonBar;
