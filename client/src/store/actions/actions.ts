import {
  SETPRODUCTS,
  SEARCH,
  ADDTOCART,
  DELETEFROMCART,
  SETFILTERPRODUCTS,
  TOTALPRICE,
  DELETEFULLITEM,
  CORRECTNUMBER,
  REFRESH,
  END,
  SETORDERID
} from './actionsTypes'
import axios from 'axios'
import { Dispatch } from 'react'
import { product } from '../../Interfaces/Interfaces'
import { AppState } from '../reducers/rootReducer'
import { OrderInitialValue } from '../../containers/OrderPage/types'

type dispatchType = Dispatch<ActionsTypes>

export const getProducts = () => {
  return async (dispatch: dispatchType) => {
    const res = await axios.get('http://localhost:5000/api/products')
    dispatch(setProducts(res.data))
  }
}

export const filterThunk = (product: string) => {
  return async (dispatch: dispatchType, getState: () => AppState) => {
    const products = getState().mainReducer.products
    const filteredProducts = products.filter(item => item.name.slice(0, product.length).toLowerCase() === product.toLowerCase())
    dispatch(setFilterProducts(filteredProducts))
  }
}

export const buyThunk =
  (productId: string | any, action: string, size: string) => {
    return (dispatch: dispatchType, getState: () => AppState) => {
      const products = getState().mainReducer.products
      if (action === 'add') {
        products.forEach(item => {
          if (item._id === productId) {
            item.count = +item.count + 1
            item.selectedSize.push(size)
          }
        })

        const cart = products.filter(item => item.count > 0)

        const initialValue = 0;
        const totalPrice = cart.reduce(
          (accumulator, currentValue) => accumulator + +currentValue.count * +currentValue.price,
          initialValue
        );


        dispatch(setTotalPrice(totalPrice))
        dispatch(setProducts(products))
        dispatch(addToCart(cart))
      } else {
        products.forEach(item => {
          if (item._id === productId) {
            item.count = +item.count - 1
            item.selectedSize.pop()
          }
        })

        const cart = products.filter(item => item.count > 0)

        const initialValue = 0;
        const totalPrice = cart.reduce(
          (accumulator, currentValue) => accumulator + +currentValue.count * +currentValue.price,
          initialValue
        );


        dispatch(setTotalPrice(totalPrice))
        dispatch(deleteFromCart(cart))
        dispatch(setProducts(products))
      }
    }
  }

export const deleteFullItemThunk = (id: string) => {
  return (dispatch: dispatchType, getState: () => AppState) => {
    const cart = getState().mainReducer.cart
    let totalPrice = getState().mainReducer.totalPrice
    const products = getState().mainReducer.products

    const filteredCart = cart.filter(item => item._id !== id)

    products.forEach(item => {
      if (item._id === id) {
        totalPrice = totalPrice - +item.price
        item.count = 0
        item.selectedSize = []
      }
    })

    dispatch(deleteFullItem(filteredCart, totalPrice, products))
  }
}

export const createOrder = (userInfo: OrderInitialValue) => {
  return async (dispatch: dispatchType, getState: () => AppState) => {
    const cart = getState().mainReducer.cart
    const totalPrice = getState().mainReducer.totalPrice
    const res = await axios.post('http://localhost:5000/api/order', { userInfo, cart, totalPrice })
    console.log("🚀 ~ file: actions.ts ~ line 109 ~ return ~ res", res)
    dispatch(setOrderId(res.data.orderID))
  }
}

type setTotalPriceType = {
  type: typeof TOTALPRICE,
  price: number
}

const setTotalPrice = (price: number): setTotalPriceType => {
  return {
    type: TOTALPRICE,
    price
  }
}


type setProductsType = {
  type: typeof SETPRODUCTS,
  products: Array<product>
}

export const setProducts = (products: Array<product>): setProductsType => {
  return {
    type: SETPRODUCTS,
    products
  }
}

type searchType = {
  type: typeof SEARCH,
  payload: boolean
}

export const setSearch = (payload: boolean): searchType => {
  return {
    type: SEARCH,
    payload
  }
}

type addToCartType = {
  type: typeof ADDTOCART,
  products: Array<product>
}

export const addToCart = (products: Array<product>): addToCartType => {
  return {
    type: ADDTOCART,
    products
  }
}

type deleteFromCartType = {
  type: typeof DELETEFROMCART,
  products: Array<product>
}

export const deleteFromCart = (products: Array<product>): deleteFromCartType => {
  return {
    type: DELETEFROMCART,
    products
  }
}

type setFilterProductsType = {
  type: typeof SETFILTERPRODUCTS,
  products: Array<product>
}

export const setFilterProducts = (products: Array<product>): setFilterProductsType => {
  return {
    type: SETFILTERPRODUCTS,
    products
  }
}

type setCorrectNumberType = {
  type: typeof CORRECTNUMBER,
  payload: boolean
}

export const setCorrectNumber = (payload: boolean): setCorrectNumberType => {
  return {
    type: CORRECTNUMBER,
    payload
  }
}

type setIsEndType = {
  type: typeof END
  payload: boolean
}

export const setIsEnd = (payload: boolean): setIsEndType => {
  return {
    type: END,
    payload
  }
}

type refreshType = {
  type: typeof REFRESH
  payload: boolean
}

export const refresh = (payload: boolean): refreshType => {
  return {
    type: REFRESH,
    payload
  }
}

type deleteFullItemType = {
  type: typeof DELETEFULLITEM
  cart: Array<product>
  totalPrice: number
  products: Array<product>

}

export const deleteFullItem = (cart: Array<product>, totalPrice: number, products: Array<product>): deleteFullItemType => {
  return {
    type: DELETEFULLITEM,
    cart,
    totalPrice,
    products,
  }
}

type setOrderIdType = {
  type: typeof SETORDERID,
  orderId: string
}

export const setOrderId = (orderId: string): setOrderIdType => {
  return {
    type: SETORDERID,
    orderId
  }
}

export type ActionsTypes =
  setProductsType |
  searchType |
  addToCartType |
  deleteFromCartType |
  setFilterProductsType |
  setTotalPriceType |
  setCorrectNumberType |
  setIsEndType |
  refreshType |
  deleteFullItemType | 
  setOrderIdType