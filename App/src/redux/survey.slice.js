import { createSlice } from '@reduxjs/toolkit'

export const surveySlice = createSlice({
    name: 'survey',
    initialState: {
        surveyItems: {}
    },
    reducers: {
        addSurvey: (state, action) => {
            state.surveyItems = action.payload;
        }
    }
})

export const { addSurvey } = surveySlice.actions
export const selectSurvey = state => state.survey
export default surveySlice.reducer