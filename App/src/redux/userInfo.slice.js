import { createSlice } from '@reduxjs/toolkit'

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState: {
        userId: '',
        fname: '',
        lname: '',
        token: '',
        isSignUp: false
    },
    reducers: {
        login: (state, action) => {
            state.userId = action.payload.userId;
            state.fname = action.payload.fname;
            state.lname = action.payload.lname;
            state.token = action.payload.token;
        },
        signup: state => {
            state.isSignUp = true
        },
        reset: state => {
            state.userId = '';
            state.fname = '';
            state.lname = '';
            state.token = '';
        },
    }
})

export const { login, signup, reset } = userInfoSlice.actions
export const selectUserInfo = state => state.userInfo
export default userInfoSlice.reducer