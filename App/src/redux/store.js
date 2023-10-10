import { configureStore } from '@reduxjs/toolkit'
import userInfoSlice from './userInfo.slice'
import surveySlice from './survey.slice'

export default configureStore({
    reducer: {
        userInfo: userInfoSlice,
        survey: surveySlice
    },
})