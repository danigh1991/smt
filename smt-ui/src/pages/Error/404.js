import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setTitle } from "../../redux/actions";

// Utils
import Page from "../../utils/Page";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setTitle }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
class NotFound extends Component {
  componentDidMount() {
    this.props.setTitle("Error.NotFound.title");
  }

  render() {
    const { NotFound: language } = this.props.language.Error;
    return (
      <Page
        id={"error-404"}
        title={language.title}
        description={language.description}
        noCrawl
      >
        <section className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{language.title}</strong>
            </div>
          </div>
          <div className="card-body">
            <h4>{language.description}</h4>
          </div>
        </section>
      </Page>
    );
  }
}

export default NotFound;

NotFound.propTypes = {
  language: PropTypes.object,
  setTitle: PropTypes.func,
};
