import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// API
import SiteAPI from "./../../../http/Site";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
  };
};

@connect(mapStateToProps)
class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      version: "",
    };
  }

  componentDidMount() {
    SiteAPI.getVersion().then((result) => {
      let version = "";
      if (result.success) version = result.data;
      this.setState({ version });
    });
  }

  render() {
    const { Content: language } = this.props.language.Layouts.Site;
    const { version } = this.state;
    const { component: Component } = this.props;

    return (
      <React.Fragment>
        <SiteAPI />
        <div className="main-login__block__inner">
          <div className="main-login__block__form">{Component}</div>
          <div className="main-login__block__sidebar">
            <h4 className="main-login__block__sidebar__title text-white">
              <strong>{language.title}</strong>
            </h4>
            <div className="main-login__block__sidebar__item">
              {language.copyright_ttbak_1}
              <a
                href="http://ttbank.ir/"
                target="_blank"
                rel="noopener noreferrer"
                title={language.copyright_ttbak_2}
              >
                {" "}
                {language.copyright_ttbak_2}{" "}
              </a>
              {language.copyright_ttbak_3}
            </div>
            <div className="main-login__block__sidebar__item">
              {language.copyright_samat_1}
              <a
                href="http://www.samatco.ir/"
                target="_blank"
                rel="noopener noreferrer"
                title={language.copyright_samat_2}
              >
                {" "}
                {language.copyright_samat_2}{" "}
              </a>
              {language.version} {version}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Index;

Index.propTypes = {
  component: PropTypes.node,
  language: PropTypes.object,
};
