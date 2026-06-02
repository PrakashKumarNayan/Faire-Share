import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: null,
    chatData: null,
    allChats: null
}

const chatSlice = createSlice({
    name: "chatHistory",
    initialState,
    reducers:{
        chatHistory(state,action){
            state.status = true,
            state.chatData=action.payload.chatData,
            state.allChats = action.payload.allChats;
        }
    }
})

export const {chatHistory} = chatSlice.actions
export default chatSlice.reducer;