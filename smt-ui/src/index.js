import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Switch } from "react-router-dom";
import { render, hydrate } from "react-dom";
import { connect, Provider } from "react-redux";
import { bindActionCreators } from "redux";
import { ConnectedRouter } from "connected-react-router";
import { ConfigProvider } from "antd";
import { enquireScreen, unenquireScreen } from "enquire-js";
import { withRouter } from "react-router";
import createStore from "./redux/store";
import {
  establishCurrentUser,
  setIsMobile,
  setDirection,
  setPendingRequests,
} from "./redux/actions";

// Styles
import "./resources/styles/antd.less";
import "./resources/styles/index.scss";

// Utils
import Routes from "./utils/Routes";

// Create a store and get back itself and its history object
const { store, history } = createStore();

let isMobile;

enquireScreen((mobile) => {
  isMobile = mobile;
});

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    user: state.config.user,
    isAuthenticated: state.config.isAuthenticated,
    direction: state.config.direction,
    mobile: state.config.mobile,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      establishCurrentUser,
      setIsMobile,
      setDirection,
    },
    dispatch
  );

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
class App extends Component {
  constructor(props) {
    super(props);
    document.body.classList.add(this.props.direction);
    // this.intervalGlobal = setInterval(() => {
    //     this.props.establishCurrentUser();
    // }, 10000);
    let routes = new Routes(props);
    this.routesItems = this.getRoutes(routes.getItems());
  }

  getRoutes = (routes) => {
    let routesItems = [];
    for (let [key, route] of routes.entries()) {
      const {
        exact = false,
        path = null,
        layout,
        roles = ["*"],
        component,
        url = null,
        routes,
      } = route;
      routesItems.push(
        <route.type
          key={`${key}-${path}`}
          exact={exact}
          path={path}
          layout={layout}
          roles={roles}
          component={component}
          url={url}
        />
      );
      if (routes) routesItems.push(...this.getRoutes(routes));
    }

    return routesItems;
  };

  setDirection(locale) {
    switch (locale) {
      case "fa":
        this.props.setDirection("rtl");
        break;
      case "en":
        this.props.setDirection("ltr");
        break;
    }
  }

  setRoute(language) {
    const url = new URL(window.location.href);
    url.searchParams.set("language", language);
    window.history.pushState("", "", url.pathname + url.search);
  }

  componentDidMount() {
    this.setDirection(this.props.language.locale);
    this.enquireHandler = enquireScreen((mobile) => {
      this.props.setIsMobile(mobile);
    });
  }

  componentWillUnmount() {
    // clearInterval(this.intervalGlobal);
    unenquireScreen(this.enquireHandler);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location !== prevProps.location) window.scrollTo(0, 0);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.language.locale !== this.props.language.locale)
      this.setDirection(nextProps.language.locale);
    // this.setRoute(nextProps.language.locale);

    return true;
  }

  render() {
    const { language: locale, direction } = this.props;

    return (
      <ConfigProvider locale={locale} direction={direction}>
        <Switch>{this.routesItems}</Switch>
      </ConfigProvider>
    );
  }
}

export default App;

App.propTypes = {
  language: PropTypes.object,
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  direction: PropTypes.string,
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  match: PropTypes.object,
  setDirection: PropTypes.func,
  establishCurrentUser: PropTypes.func,
  setIsMobile: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object,
};

async function startPoint() {
  // Saving all pending axios request
  // All axios request
  axios.interceptors.request.use(
    (config) => {
      store.dispatch(setPendingRequests(true));
      return config;
    },
    (error) => Promise.reject(error)
  );
  // All axios response
  axios.interceptors.response.use(
    (response) => {
      store.dispatch(setPendingRequests(false));
      return response;
    },
    (error) => {
      store.dispatch(setPendingRequests(false));
      return Promise.reject(error);
    }
  );

  // Initialization redux state
  await store.dispatch(establishCurrentUser());
  await store.dispatch(setIsMobile(isMobile));

  // Running locally, we should run on a <ConnectedRouter /> rather than on a <StaticRouter /> like on the server
  const Application = (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  );

  const root = document.querySelector("#root");

  // If we're not running on the server, just render like normal
  render(Application, root);

  if (process.env.NODE_ENV !== "development")
    document.addEventListener("contextmenu", (event) => event.preventDefault());

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: http://bit.ly/CRA-PWA
  import("./serviceWorker").then((serviceWorker) => serviceWorker.unregister());
}

startPoint();
