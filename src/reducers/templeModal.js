import { OPEN_TEMPLE_MODAL, CLOSE_TEMPLE_MODAL } from '../actions/temple';

const initialState = {
  open: false,
  targetPath: '/',
};

export default function templeModal(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN_TEMPLE_MODAL:
      return {
        ...state,
        open: true,
        targetPath: action.targetPath || '/',
      };
    case CLOSE_TEMPLE_MODAL:
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
}
