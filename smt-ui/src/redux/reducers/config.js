import * as types from "../actions/type";
import moment from "moment";
import "moment/locale/fa";

// Languages
import faIR from "../../resources/languages/fa_IR";
import enGB from "../../resources/languages/en_GB";

function getLanguage(locale) {
  let language;
  switch (locale) {
    case "fa":
      language = faIR;
      moment.locale("fa");
      break;
    case "en":
      language = enGB;
      moment.locale("en");
      break;
    default:
      language = enGB;
      moment.locale("en");
  }
  return language;
}

const initialState = {
  language: getLanguage("fa"),
  user: {},
  isAuthenticated: false,
  pendingRequests: 0,
  direction: "rtl",
  title: "App.title",
  mobile: false,
};

const config = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.SET_CURRENT_USER: {
      const { user } = action;
      return {
        ...state,
        user,
      };
    }
    case types.SET_AUTHENTICATE: {
      const { isAuthenticated } = action;
      return {
        ...state,
        isAuthenticated,
      };
    }
    case types.SET_PENDING_REQUESTS: {
      const { pendingRequests } = state;
      const { plus } = action;
      return {
        ...state,
        pendingRequests: plus
          ? pendingRequests + 1
          : pendingRequests > 0
          ? pendingRequests - 1
          : 0,
      };
    }
    case types.SET_DIRECTION: {
      const { direction } = action;
      return {
        ...state,
        direction,
      };
    }
    case types.SET_TITLE: {
      const { title } = action;
      return {
        ...state,
        title,
      };
    }
    case types.SET_IS_MOBILE: {
      const { mobile } = action;
      return {
        ...state,
        mobile,
      };
    }
    default:
      return state;
  }
};

export default config;
