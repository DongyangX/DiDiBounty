import { createSlice } from '@reduxjs/toolkit'

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    detail: null
  },
  reducers: {
    setDetail: (state, action) => {
      state.detail = action.payload
    }
  },
})

export const { setDetail } = globalSlice.actions

export default globalSlice.reducer
