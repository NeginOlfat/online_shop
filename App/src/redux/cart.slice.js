import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
    name: 'cartList',
    initialState: {
        cartItems: []
    },
    reducers: {
        addCart: (state, action) => {
            let arry = [...state.cartItems]
            arry.push(action.payload)
            state.cartItems = [...arry];
        },
        increment: (state, action) => {
            let arry = [...state.cartItems]
            let productIndex = arry.findIndex(item => item.id == action.payload)
            arry[productIndex].number = arry[productIndex].number + 1
            state.cartItems = [...arry];
        },
        deleteProduct: (state, action) => {
            let arry = [...state.cartItems]
            let index = arry.findIndex(item => item.id == action.payload)
            arry.splice(index, 1)
            state.cartItems = [...arry];
        },
        deleteAll: (state) => {
            state.cartItems = [];
        }
    }
})

export const { addCart, increment, deleteProduct, deleteAll } = cartSlice.actions
export const selectCart = state => state.cartList
export default cartSlice.reducer