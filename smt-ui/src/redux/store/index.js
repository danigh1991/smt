import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { createLogger } from "redux-logger";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";

// Import Reducers
import config from "./../reducers/config";
import virtualDOM from "./../reducers/virtual-dom";

export default (url = "/") => {
  // Create a history depending on the environment
  const history = createBrowserHistory();

  const enhancers = [];
  const middleware = [thunk, routerMiddleware(history)];

  // Dev tools are helpful
  if (process.env.NODE_ENV === "development") {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
    middleware.push(createLogger());

    if (typeof devToolsExtension === "function") {
      enhancers.push(devToolsExtension());
    }
  }

  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  );

  // Do we have preloaded state available? Great, save it.
  const initialState = window.__PRELOADED_STATE__;

  // Delete it once we have it stored in a variable
  delete window.__PRELOADED_STATE__;

  // Create the store
  const store = createStore(
    combineReducers({
      router: connectRouter(history),
      config,
      virtualDOM,
    }),
    initialState,
    composedEnhancers
  );

  return {
    store,
    history,
  };
};
