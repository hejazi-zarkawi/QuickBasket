import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


const initialState ={
    isLoading: false,
    orderList : [],
    orderDetails : null,
}

export const getAllOrdersForAllUsers = createAsyncThunk(
  "/order/getAllOrdersForAllUsers",
  async (_, {rejectWithValue}) => {
    try{
        const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/get`,
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

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id, {rejectWithValue}) => {
    try{
        const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`,
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

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({id, orderStatus}, {rejectWithValue}) => {
    try{
        const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,{orderStatus}
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

const AdminOrderSlice = createSlice({
    name : 'adminOrder',
    initialState,
    reducers : {
        resetOrderDetails : (state)=>{
            state.orderDetails = null;
        }
    },
    extraReducers : (builder) =>{
        builder.addCase(getAllOrdersForAllUsers.pending, (state) => {
                state.isLoading = true;
              })
              .addCase(getAllOrdersForAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data;
              })
              .addCase(getAllOrdersForAllUsers.rejected, (state) => {
                state.isLoading = false;
                state.orderList = [];
              })
              .addCase(getOrderDetailsForAdmin.pending, (state) => {
                state.isLoading = true;
              })
              .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
              })
              .addCase(getOrderDetailsForAdmin.rejected, (state) => {
                state.isLoading = false;
                state.orderDetails = null;
              });
    }
})

export const {resetOrderDetails} = AdminOrderSlice.actions;

export default AdminOrderSlice.reducer;