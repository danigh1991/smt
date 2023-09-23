import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions";

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ logoutUser }, dispatch);

@connect(null, mapDispatchToProps)
class Logout extends Component {
  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillMount() {
    this.props.logoutUser().then((result) => {
      if (result.success) {
        this.props.history.push("/");
      }
    });
  }

  render() {
    return null;
  }
}

export default withRouter(Logout);

Logout.propTypes = {
  history: PropTypes.object,
  logoutUser: PropTypes.func,
};
