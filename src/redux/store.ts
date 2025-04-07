import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../pages/Home/Login/authSlice'
import carteiraReducer from '../pages/Home/Carteira/carteiraSlice'
import mesReducer from '../pages/Home/Mes/mesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    carteira: carteiraReducer,
    mes: mesReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch