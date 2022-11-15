// ================ Action types ================ //

export const CHANGE_MODAL_VALUE_REQUEST = 'app/TopbarContainer/CHANGE_MODAL_VALUE_REQUEST';
export const CHANGE_MODAL_VALUE_SUCCESS = 'app/TopbarContainer/CHANGE_MODAL_VALUE_SUCCESS';
export const CHANGE_MODAL_VALUE_ERROR = 'app/TopbarContainer/CHANGE_MODAL_VALUE_ERROR';

// ================ Reducer ================ //

const initialState = {
  modalValue: null,
  changeModalValueInProgress: false,
  changeModalValueError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case CHANGE_MODAL_VALUE_REQUEST:
      return {
        ...state,
        changeModalValueInProgress: true,
        changeModalValueError: false,
      };
    case CHANGE_MODAL_VALUE_SUCCESS:
      return {
        ...state,
        modalValue: payload,
        changeModalValueInProgress: false,
      };
    case CHANGE_MODAL_VALUE_ERROR:
      return {
        ...state,
        changeModalValueInProgress: false,
        changeModalValueError: payload,
      };
    default:
      return state;
  }
}

// ================ Action creators ================ //

export const changeModalValueRequest = () => ({
  type: CHANGE_MODAL_VALUE_REQUEST,
});

export const changeModalValueSuccess = modalType => ({
  type: CHANGE_MODAL_VALUE_SUCCESS,
  payload: modalType,
});

export const changeModalValueError = e => ({
  type: CHANGE_MODAL_VALUE_ERROR,
  payload: e,
  error: true,
});

// ================ Thunks ================ //

export const changeModalValue = value => (dispatch, getState, sdk) => {
  return dispatch(changeModalValueSuccess(value));
};

export const loadData = () => (dispatch, getState, sdk) => {
  return getState().modalValue;
};
