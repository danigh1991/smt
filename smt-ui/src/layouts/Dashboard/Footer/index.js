import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ButtonBar from "../../../utils/ButtonBar";

// API
import SiteAPI from "./../../../http/Site";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    buttonBar: state.virtualDOM.buttonBar,
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
    const { Footer: language } = this.props.language.Layouts.Dashboard;
    const { version } = this.state;

    return (
      <React.Fragment>
        <div className="footer">
          <div className="footer__top">
            <div className="footer__copyright">
              {language.copyright_ttbak_1}{" "}
              <a
                href="http://ttbank.ir/"
                target="_blank"
                rel="noopener noreferrer"
                title={language.copyright_ttbak_2}
              >
                {language.copyright_ttbak_2}
              </a>{" "}
              {language.copyright_ttbak_3}
            </div>
          </div>
          <div className="footer__bottom">
            <div className="footer__copyright">
              {language.copyright_samat_1}{" "}
              <a
                href="http://www.samatco.ir/"
                target="_blank"
                rel="noopener noreferrer"
                title={language.copyright_samat_2}
              >
                {language.copyright_samat_2}
              </a>{" "}
              {language.version} {version}
            </div>
          </div>
          <ButtonBar>{this.props.buttonBar}</ButtonBar>
        </div>
      </React.Fragment>
    );
  }
}

export default Index;

Index.propTypes = {
  language: PropTypes.object,
  buttonBar: PropTypes.node,
};
