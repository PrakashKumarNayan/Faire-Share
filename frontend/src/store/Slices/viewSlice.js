import { createSlice } from "@reduxjs/toolkit";

const initialState={
    status : false
};


const viewSlice =createSlice({
    name: "view",
    initialState,
    reducers:{
        viewStatus(state){
            state.status=true
        },
        resetStatus(state){
            state.status =false
        }
    }
})

    

export const {viewStatus,resetStatus} = viewSlice.actions

export default viewSlice.reducer;