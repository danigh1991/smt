import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setTitle } from "../../redux/actions";

// Utils
import Page from "../../utils/Page";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    user: state.config.user,
    direction: state.config.direction,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setTitle }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
class Panel extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.setTitle("Dashboard.description");
  }

  render() {
    const { Dashboard: language } = this.props.language;

    return (
      <Page
        id={"dashboard-dashboard"}
        title={language.title}
        description={language.description}
        noCrawl
      >
        <Row>
          <Col span={24} className="gutter-row">
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
          </Col>
        </Row>
      </Page>
    );
  }
}

export default Panel;

Panel.propTypes = {
  language: PropTypes.object,
  setTitle: PropTypes.func,
  user: PropTypes.object,
  direction: PropTypes.string,
};
