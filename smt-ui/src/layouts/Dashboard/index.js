import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import DrawerMenu from "rc-drawer";
import { BackTop, Layout as AntLayout, Progress } from "antd";
import { ContainerQuery } from "react-container-query";
import classNames from "classnames";
import { Enum } from "./../../resources/constants";

import Menu from "./Menu";
import TopBar from "./TopBar";
import Content from "./Content";
import Footer from "./Footer";

const AntContent = AntLayout.Content;
const AntHeader = AntLayout.Header;
const AntFooter = AntLayout.Footer;

const query = {
  "screen-xs": {
    maxWidth: 575,
  },
  "screen-sm": {
    minWidth: 576,
    maxWidth: 767,
  },
  "screen-md": {
    minWidth: 768,
    maxWidth: 991,
  },
  "screen-lg": {
    minWidth: 992,
    maxWidth: 1199,
  },
  "screen-xl": {
    minWidth: 1200,
    maxWidth: 1599,
  },
  "screen-xxl": {
    minWidth: 1600,
  },
};

const {
  COLOR: { FROM_PENDING_REQUESTS, TO_PENDING_REQUESTS },
} = Enum;

const mapStateToProps = (state) => {
  return {
    direction: state.config.direction,
    mobile: state.config.mobile,
    pendingRequests: state.config.pendingRequests,
  };
};

@connect(mapStateToProps)
class Layout extends Component {
  render() {
    const { mobile, direction, pendingRequests } = this.props;
    const isMobile = !!mobile;
    let placement = direction === "rtl" ? "right" : "left";
    const percent = pendingRequests ? Math.round(100 / pendingRequests) : 0;

    return (
      <div className="Dashboard">
        <ContainerQuery query={query}>
          {(params) => (
            <div className={classNames(params)}>
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
              <AntLayout>
                <BackTop visibilityHeight={200} />
                {isMobile ? (
                  <DrawerMenu
                    placement={placement}
                    getContainer={null}
                    level={null}
                  >
                    <Menu isMobile={isMobile} />
                  </DrawerMenu>
                ) : (
                  <Menu isMobile={isMobile} />
                )}
                <AntLayout>
                  <AntHeader>
                    <TopBar isMobile={isMobile} />
                  </AntHeader>
                  <AntContent style={{ height: "100%" }}>
                    <Content component={this.props.children} />
                  </AntContent>
                  <AntFooter>
                    <Footer />
                  </AntFooter>
                </AntLayout>
              </AntLayout>
            </div>
          )}
        </ContainerQuery>
      </div>
    );
  }
}

export default Layout;

Layout.propTypes = {
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  direction: PropTypes.string,
  children: PropTypes.element,
  pendingRequests: PropTypes.number,
};
