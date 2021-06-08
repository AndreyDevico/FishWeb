import {
  ADDTOCART,
  SEARCH,
  SETPRODUCTS,
  DELETEFROMCART,
  SETFILTERPRODUCTS,
  TOTALPRICE,
  DELETEFULLITEM,
  REFRESH,
  END,
  CORRECTNUMBER,
  SETORDERID
}
  from "../actions/actionsTypes";
import { ActionsTypes } from "../actions/actions";
import { product } from "../../Interfaces/Interfaces";
import { act } from "react-dom/test-utils";


interface IMain {
  products: Array<product>
  isSearch: boolean
  cart: Array<product>
  filterProducts: Array<product>
  totalPrice: number
  isCorrectPhone: boolean
  isEnd: boolean
  orderId: string
}

const initialState = {
  products: [],
  isSearch: false,
  cart: [],
  filterProducts: [],
  totalPrice: 0,
  isCorrectPhone: false,
  isEnd: false,
  orderId: ''
}

export default function mainReducer(state: IMain = initialState, action: ActionsTypes) {
  switch (action.type) {
    case SETORDERID:
      return { ...state, orderId: action.orderId }
    case SETPRODUCTS:
      return { ...state, products: [...action.products] }
    case SEARCH:
      return { ...state, isSearch: action.payload }
    case ADDTOCART:
      return { ...state, cart: [...action.products] }
    case DELETEFROMCART:
      return { ...state, cart: [...action.products] }
    case SETFILTERPRODUCTS:
      return { ...state, filterProducts: [...action.products] }
    case TOTALPRICE:
      return { ...state, totalPrice: action.price }
    case END:
      return { ...state, isEnd: action.payload }
    case CORRECTNUMBER:
      return { ...state, isCorrectPhone: action.payload }
    case REFRESH:
      return { ...state, totalPrice: 0, cart: [], isEnd: action.payload, isCorrectPhone: action.payload }
    case DELETEFULLITEM:
      return { ...state, cart: [...action.cart], totalPrice : action.totalPrice, products: [...action.products] }
    default:
      return state
  }
}