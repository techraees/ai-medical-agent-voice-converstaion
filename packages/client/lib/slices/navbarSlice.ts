import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NavbarState {
   height: number
}

const initialState: NavbarState = {
   height: 64, // Default height (h-16 = 64px)
}

const navbarSlice = createSlice({
   name: 'navbar',
   initialState,
   reducers: {
      setNavbarHeight: (state, action: PayloadAction<number>) => {
         state.height = action.payload
      },
   },
})

export const { setNavbarHeight } = navbarSlice.actions
export default navbarSlice.reducer
