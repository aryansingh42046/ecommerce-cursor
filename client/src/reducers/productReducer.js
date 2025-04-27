import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from '../constants/productConstants';

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
    case PRODUCT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
        error: null,
      };
    case PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload,
        error: null,
      };
    case PRODUCT_LIST_FAIL:
    case PRODUCT_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}; 