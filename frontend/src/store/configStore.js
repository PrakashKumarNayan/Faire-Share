import {configureStore} from '@reduxjs/toolkit'
import authSlice from './Slices/authSlice'
import eventSlice from './Slices/eventSlice'
import chatSlice from './Slices/chatSlice'
import viewSlice  from './Slices/viewSlice'
const store = configureStore({
    reducer: {
        auth:authSlice,
        event:eventSlice,
        chats:chatSlice,
        view:viewSlice
    }
})

export default store