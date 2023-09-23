import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Helmet from "react-helmet";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
  };
};

@connect(mapStateToProps)
class Page extends Component {
  constructor(props) {
    super(props);
    const { App: language } = props.language;

    this.defaultDescription = language.description;
    this.defaultSep = " | ";
  }

  getMetaTags(
    {
      title,
      description,
      contentType,
      noCrawl,
      published,
      updated,
      category,
      tags,
    },
    pathname
  ) {
    const theTitle = title
      ? (title + this.defaultSep + this.props.language.App.title).substring(
          0,
          60
        )
      : this.props.language.App.title;
    const theDescription = description
      ? description.substring(0, 155)
      : this.defaultDescription;

    const metaTags = [
      { itemprop: "name", content: theTitle },
      { itemprop: "description", content: theDescription },
      { name: "description", content: theDescription },
      { property: "og:title", content: theTitle },
      { property: "og:type", content: contentType || "website" },
      { property: "og:description", content: theDescription },
      { property: "og:site_name", content: this.props.language.App.title },
    ];

    if (noCrawl) {
      metaTags.push({ name: "robots", content: "noindex, nofollow" });
    }

    if (published) {
      metaTags.push({ name: "article:published_time", content: published });
    }
    if (updated) {
      metaTags.push({ name: "article:modified_time", content: updated });
    }
    if (category) {
      metaTags.push({ name: "article:section", content: category });
    }
    if (tags) {
      metaTags.push({ name: "article:tag", content: tags });
    }

    return metaTags;
  }

  render() {
    const { children, id, className, ...rest } = this.props;

    return (
      <div id={id} className={className}>
        <Helmet
          htmlAttributes={{
            lang: "en",
            itemscope: undefined,
            itemtype: `http://schema.org/${rest.schema || "WebPage"}`,
          }}
          title={
            rest.title
              ? rest.title + this.defaultSep + this.props.language.App.title
              : this.props.language.App.title
          }
          meta={this.getMetaTags(rest, this.props.location.pathname)}
        />
        {children}
      </div>
    );
  }
}

export default withRouter(Page);

Page.propTypes = {
  location: PropTypes.object,
  children: PropTypes.element,
  language: PropTypes.object,
  id: PropTypes.string,
  className: PropTypes.string,
};
