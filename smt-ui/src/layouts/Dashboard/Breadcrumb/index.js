import React, { Component } from "react";
import PropTypes from "prop-types";
import { Breadcrumb as AntBreadcrumb } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import lodash from "lodash";

// Utils
import Routes from "../../../utils/Routes";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
  };
};

@connect(mapStateToProps)
@withRouter
class Index extends Component {
  constructor(props) {
    super(props);
    let routes = new Routes(props);
    this.breadcrumbs = this.setBreadcrumbs(routes.getItems());
  }

  handleClick = (url) => {
    this.props.history.push(url);
  };

  setBreadcrumbs(routes) {
    let breadcrumbs = [];
    for (let route of routes) {
      if (route.breadcrumbDashboard)
        breadcrumbs.push({
          url: route.path,
          title: route.breadcrumbDashboard.title,
          link: route.breadcrumbDashboard.link,
        });
      if (route.routes) breadcrumbs.push(...this.setBreadcrumbs(route.routes));
    }

    return breadcrumbs;
  }

  render() {
    let routes = new Routes(this.props);
    this.breadcrumbs = this.setBreadcrumbs(routes.getItems());
    const {
      Layouts: { Dashboard: language },
    } = this.props.language;
    return (
      <div className="breadcrumbBar">
        <div className="breadcrumbBar__path">
          <AntBreadcrumb>
            {[
              <AntBreadcrumb.Item
                key="/dashboard"
                onClick={() => this.handleClick("/dashboard")}
              >
                <Link to="/dashboard" className="text-muted">
                  {language.dashboard}
                </Link>
              </AntBreadcrumb.Item>,
            ].concat(
              this.props.location.pathname
                .split("/")
                .filter((i) => i)
                .map((_, index) => {
                  let url = `/${this.props.location.pathname
                    .split("/")
                    .filter((i) => i)
                    .slice(0, index + 1)
                    .join("/")}`;
                  let breadcrumbIndex = lodash.findIndex(this.breadcrumbs, {
                    url: url,
                  });
                  if (breadcrumbIndex < 0) {
                    let urlEdit =
                      url.slice(0, url.lastIndexOf(url.split("/")[index + 1])) +
                      ":variable";
                    breadcrumbIndex = lodash.findIndex(this.breadcrumbs, {
                      url: urlEdit,
                    });
                  }
                  if (breadcrumbIndex >= 0) {
                    let breadcrumbUrl = url;
                    let breadcrumbTitle = this.breadcrumbs[breadcrumbIndex]
                      .title;
                    let breadcrumbLink = this.breadcrumbs[breadcrumbIndex].link;
                    if (breadcrumbLink)
                      return (
                        <AntBreadcrumb.Item
                          key={breadcrumbUrl}
                          onClick={() => this.handleClick(breadcrumbUrl)}
                        >
                          <Link to={breadcrumbUrl} className="text-muted">
                            {breadcrumbTitle}
                          </Link>
                        </AntBreadcrumb.Item>
                      );
                    else
                      return (
                        <AntBreadcrumb.Item key={breadcrumbUrl}>
                          <strong>{breadcrumbTitle}</strong>
                        </AntBreadcrumb.Item>
                      );
                  }
                })
            )}
          </AntBreadcrumb>
        </div>
      </div>
    );
  }
}

Index.propTypes = {
  language: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Index;
