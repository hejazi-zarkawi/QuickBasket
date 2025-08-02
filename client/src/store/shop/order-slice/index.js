import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

const initialState ={
    approvalURL : null,
    isLoading : false,
    orderId : null,
    orderList : [],
    orderDetails : null,
}

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, {rejectWithValue}) => {
    try{
        const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/order/create`,
      orderData
    );

    return response.data;
    }
    catch(err){
        if (err.response) {
                // Server responded with non-2xx status
                return rejectWithValue(err.response.data?.error || err.response.data);
            } else if (err.request) {
                // Request made but no response received
                return rejectWithValue("No response from server");
            } else {
                // Other errors (network issues, etc)
                return rejectWithValue(err.message || "Network error");
            }
    }
  }
);

export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({tokenId, orderId, payerId}, {rejectWithValue}) => {
    try{
        const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/order/capture`,
      {tokenId, orderId, payerId}
    );

    return response.data;
    }
    catch(err){
        if (err.response) {
                // Server responded with non-2xx status
                return rejectWithValue(err.response.data?.error || err.response.data);
            } else if (err.request) {
                // Request made but no response received
                return rejectWithValue("No response from server");
            } else {
                // Other errors (network issues, etc)
                return rejectWithValue(err.message || "Network error");
            }
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId, {rejectWithValue}) => {
    try{
        const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`,
    );

    return response.data;
    }
    catch(err){
        if (err.response) {
                // Server responded with non-2xx status
                return rejectWithValue(err.response.data?.error || err.response.data);
            } else if (err.request) {
                // Request made but no response received
                return rejectWithValue("No response from server");
            } else {
                // Other errors (network issues, etc)
                return rejectWithValue(err.message || "Network error");
            }
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id, {rejectWithValue}) => {
    try{
        const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`,
    );

    return response.data;
    }
    catch(err){
        if (err.response) {
                // Server responded with non-2xx status
                return rejectWithValue(err.response.data?.error || err.response.data);
            } else if (err.request) {
                // Request made but no response received
                return rejectWithValue("No response from server");
            } else {
                // Other errors (network issues, etc)
                return rejectWithValue(err.message || "Network error");
            }
    }
  }
);

const shoppingOrderSlice = createSlice({
    name : "shoppingOrderSlice",
    initialState,
    reducers :{
      resetOrderDetails : (state)=>{
        state.orderDetails = null;
      }
    },
    extraReducers : (builder)=>{
        
      builder.addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
        state.approvalURL = action.payload.approvalURL;
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
    }
})

export const {resetOrderDetails} = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;