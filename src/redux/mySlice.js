import { createSlice } from "@reduxjs/toolkit";

let myDataSlice = createSlice({
    name:"expense tracker",
    initialState:{data:[], msg:"loading !.. Please wait"},
    reducers:{
        getAllExpense:(state, action)=>{
            state.data=action.payload;
        },
        editExpense:(state, action)=>{
            let {id, editedExpense } = action.payload;
            let ind = state.data.findIndex((expense)=>expense._id==id);
            state.data[ind] = {...state.data[ind], ...editedExpense};
        },
        addExpense:(state, action)=>{
            state.data.push(action.payload);
        },
        deleteExpense:(state, action)=>{
            let {id} = action.payload;
            state.data = state.data.filter((expense) => expense._id !== id);
        }
    }
})

export let {getAllExpense, editExpense, addExpense, deleteExpense} = myDataSlice.actions;
export default myDataSlice.reducer;