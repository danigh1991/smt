import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Notification from "react-web-notification";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    direction: state.config.direction,
    mobile: state.config.mobile,
  };
};

@connect(mapStateToProps)
class WebNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ignore: true,
    };
  }

  handlePermissionGranted() {
    // console.log("Permission Granted");
    this.setState({
      ignore: false,
    });
  }

  handlePermissionDenied() {
    // console.log("Permission Denied");
    this.setState({
      ignore: true,
    });
  }

  handleNotSupported() {
    // console.log("Web Notification not Supported");
    this.setState({
      ignore: true,
    });
  }

  handleNotificationOnClick(e, tag) {
    // console.log(e, "Notification clicked tag:" + tag);
  }

  handleNotificationOnError(e, tag) {
    // console.log(e, "Notification error tag:" + tag);
  }

  handleNotificationOnClose(e, tag) {
    // console.log(e, "Notification closed tag:" + tag);
  }

  handleNotificationOnShow(e, tag) {
    this.playSound("sound");
    // console.log(e, "Notification shown tag:" + tag);
  }

  playSound(filename) {
    document.getElementById(filename).play();
  }

  render() {
    const { ignore } = this.state;
    const {
      direction,
      language: { locale },
      title,
      description: body,
    } = this.props;
    const isMobile = !!this.props.mobile;

    if (!isMobile)
      return (
        <>
          <Notification
            ignore={ignore}
            notSupported={this.handleNotSupported.bind(this)}
            onPermissionGranted={this.handlePermissionGranted.bind(this)}
            onPermissionDenied={this.handlePermissionDenied.bind(this)}
            onShow={this.handleNotificationOnShow.bind(this)}
            onClick={this.handleNotificationOnClick.bind(this)}
            onClose={this.handleNotificationOnClose.bind(this)}
            onError={this.handleNotificationOnError.bind(this)}
            timeout={5000}
            title={title}
            options={
              // Available options
              // See https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
              {
                tag: Date.now(),
                body,
                icon: require("./../../resources/images/notification.png"),
                lang: locale,
                dir: direction,
                sound: "./../../resources/media/sound.mp3", // no browsers supported https://developer.mozilla.org/en/docs/Web/API/notification/sound#Browser_compatibility
              }
            }
            swRegistration={{}}
          />
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio id="sound" preload="auto">
            <source src="./../../resources/media/sound.mp3" type="audio/mpeg" />
            <source src="./../../resources/media/sound.ogg" type="audio/ogg" />
            <embed
              hidden={true}
              autostart="false"
              loop={false}
              src="./../../resources/media/sound.mp3"
            />
          </audio>
        </>
      );
    else return null;
  }
}

export default WebNotification;

WebNotification.propTypes = {
  language: PropTypes.object,
  direction: PropTypes.string,
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  title: PropTypes.string,
  description: PropTypes.string,
};
