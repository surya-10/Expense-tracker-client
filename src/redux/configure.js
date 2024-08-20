import mySliceData from "./mySlice";
import { configureStore } from "@reduxjs/toolkit";

export let myStore = configureStore({
    reducer:{
        chartDatareducer:mySliceData
    }
});