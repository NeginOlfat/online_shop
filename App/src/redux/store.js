import { configureStore } from '@reduxjs/toolkit'
import userInfoSlice from './userInfo.slice'
import surveySlice from './survey.slice'
import cartSlice from './cart.slice'

export default configureStore({
    reducer: {
        userInfo: userInfoSlice,
        survey: surveySlice,
        cart: cartSlice
    },
})