import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { AppstoreOutlined } from "@ant-design/icons";

const mapStateToProps = (state) => {
  return {
    title: state.config.title,
    language: state.config.language,
  };
};

@connect(mapStateToProps)
class Index extends Component {
  constructor(props) {
    super(props);
    this.title = "";
    this.titleList = [];
  }

  setTitle(language, title, i) {
    if (_.isString(language)) this.title = language;
    else if (_.isObject(language) && !_.isNull(title)) {
      let title = this.titleList[i + 1] ? this.titleList[i + 1] : null;
      this.setTitle(language[this.titleList[i]], title, i + 1);
    }
  }

  render() {
    const { title, language } = this.props;
    if (_.isString(title)) {
      this.titleList = title.split(".");
      if (!_.isEmpty(this.titleList))
        this.setTitle(
          language[this.titleList[0]],
          this.titleList[1] ? this.titleList[1] : null,
          1
        );
    }

    return (
      <div className="d-inline-block mr-2 ml-2">
        <span className="d-xl-inline">
          <AppstoreOutlined className="mr-2 ml-2" />
          <strong className="page-title">{this.title}</strong>
        </span>
      </div>
    );
  }
}

export default Index;

Index.propTypes = {
  title: PropTypes.string,
  language: PropTypes.object,
};
