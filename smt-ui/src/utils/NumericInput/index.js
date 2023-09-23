import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Input, Tooltip } from "antd";
import _ from "lodash";
import Number from "../Number";

const mapStateToProps = (state) => {
  return {
    direction: state.config.direction,
  };
};

@connect(mapStateToProps)
class NumericInput extends Component {
  constructor(props) {
    super(props);
  }

  onChange = (e) => {
    let { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === "") {
      this.props.onChange(value);
    }
  };

  // '.' at the end or only '-' in the input box.

  onBlur = () => {
    const { value, onBlur, onChange } = this.props;
    if (!_.isUndefined(value) && _.isFunction(value.charAt))
      if (value.charAt(value.length - 1) === "." || value === "-") {
        onChange({ value: value.slice(0, -1) });
      }
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { value, titleTooltip, direction } = this.props;
    const title = value ? (
      <div>
        <span className="numeric-input-title">
          {value !== "-" ? Number.format(value) : "-"}
        </span>
        <span> {titleTooltip}</span>
      </div>
    ) : (
      <span>0 {titleTooltip}</span>
    );
    return (
      <Tooltip
        trigger={["focus"]}
        title={title}
        placement={direction === "rtl" ? "topLeft" : "topRight"}
        overlayClassName="numeric-input"
      >
        <Input
          {...this.props}
          value={value ? value : ""}
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
      </Tooltip>
    );
  }
}

NumericInput.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  titleTooltip: PropTypes.string,
  direction: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
};

export default NumericInput;
