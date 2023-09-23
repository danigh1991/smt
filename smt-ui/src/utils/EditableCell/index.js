import React, { Component } from "react";
import PropTypes from "prop-types";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { Input } from "antd";

class EditableCell extends Component {
  constructor(props) {
    super(props);

    const { id, field, value } = this.props;
    this.state = {
      id,
      field,
      firstValue: value,
      secondValue: value,
      editable: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { id: prevId, field: prevField, value: prevValue } = prevProps;
    const { id, field, value } = this.props;
    if (id !== prevId || field !== prevField || prevValue !== value) {
      this.setState({
        id,
        field,
        firstValue: value,
        secondValue: value,
        editable: false,
      });
    }
  }

  handleChange = (e) => {
    const secondValue = e.target.value;
    this.setState({ secondValue });
  };

  check = () => {
    this.setState({ editable: false });
    const { id, field, firstValue, secondValue } = this.state;
    const { onChange, updateCell } = this.props;
    let params = {};
    params[field] = secondValue;
    updateCell(id, params).then((data) => {
      if (data !== false) {
        if (onChange) {
          onChange(secondValue);
        }
      } else {
        if (onChange) {
          onChange(firstValue);
        }
        this.setState({
          secondValue: firstValue,
        });
      }
    });
  };

  edit = () => {
    this.setState({ editable: true });
  };

  render() {
    const { secondValue, editable } = this.state;
    return (
      <div className="editable-cell">
        {editable ? (
          <div className="editable-cell-input-wrapper">
            <Input
              maxLength="100"
              value={secondValue}
              onChange={this.handleChange}
              onPressEnter={this.check}
            />
            <CheckOutlined
              className="editable-cell-icon-check"
              onClick={this.check}
            />
          </div>
        ) : (
          <div className="editable-cell-text-wrapper">
            {secondValue || " "}
            <EditOutlined className="editable-cell-icon" onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}

EditableCell.propTypes = {
  id: PropTypes.string,
  field: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  updateCell: PropTypes.func,
};

export default EditableCell;
