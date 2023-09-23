import * as types from "./../actions/type";

const initialState = {
  buttonBar: null,
};

const virtualDOM = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.SET_BUTTON_BAR: {
      const { buttonBar } = action;
      return {
        ...state,
        buttonBar,
      };
    }
    default:
      return state;
  }
};

export default virtualDOM;
