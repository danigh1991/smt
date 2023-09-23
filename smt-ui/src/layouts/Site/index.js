import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Progress } from "antd";
import { Enum } from "./../../resources/constants";

// Components
import Content from "./Content";

const {
  COLOR: { FROM_PENDING_REQUESTS, TO_PENDING_REQUESTS },
} = Enum;

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    pendingRequests: state.config.pendingRequests,
  };
};

@connect(mapStateToProps)
class Index extends Component {
  componentDidMount() {
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
  }

  componentWillUnmount() {
    document.getElementsByTagName("body")[0].style.overflow = "";
  }

  render() {
    const { App: language } = this.props.language;
    const { pendingRequests } = this.props;
    const percent = pendingRequests ? Math.round(100 / pendingRequests) : 0;

    return (
      <div className="Site">
        <div className="main-login main-login--fullscreen">
          <div className="pending-requests">
            <Progress
              percent={percent}
              strokeLinecap="square"
              showInfo={false}
              size="small"
              strokeColor={{
                from: FROM_PENDING_REQUESTS,
                to: TO_PENDING_REQUESTS,
              }}
            />
          </div>
          <div className="main-login__header">
            <div className="row">
              <div className="col-lg-12">
                <div className="main-login__header__logo">
                  <Link to="/" rel="noopener noreferrer">
                    <img
                      src={require("./../../resources/images/logo.png")}
                      alt={language.title}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="main-login__block main-login__block--extended">
            <div className="row">
              <div className="col-xl-12">
                <Content component={this.props.children} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;

Index.propTypes = {
  language: PropTypes.object,
  children: PropTypes.node,
  pendingRequests: PropTypes.number,
};
