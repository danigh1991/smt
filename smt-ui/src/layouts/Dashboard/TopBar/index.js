import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Components
import ProfileMenu from "./ProfileMenu";
import Title from "./Title";

const mapStateToProps = (state) => {
  return {
    direction: state.config.direction,
    isAuthenticated: state.config.isAuthenticated,
  };
};

@connect(mapStateToProps)
class Index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isAuthenticated, direction, isMobile } = this.props;
    let topbar1 = direction === "rtl" ? "topbar__left" : "topbar__right";
    let topbar2 = direction === "rtl" ? "topbar__right" : "topbar__left";

    return (
      <div className="topbar">
        <div className={topbar1}>
          {isAuthenticated ? <ProfileMenu /> : null}
        </div>
        <div className={topbar2}>
          <Title />
        </div>
      </div>
    );
  }
}

export default Index;

Index.propTypes = {
  isMobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  direction: PropTypes.string,
  isAuthenticated: PropTypes.bool,
};
