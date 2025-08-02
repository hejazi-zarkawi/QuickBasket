import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios";

const initialState ={
    reviews: [],
    isLoading: false,
}

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (data, {rejectWithValue}) => {
    try{
        const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/review/add`,data,
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

export const getReviews = createAsyncThunk(
  "/order/getReviews",
  async (id, {rejectWithValue}) => {
    try{
        const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/review/${id}`,
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

const reviewSlice = createSlice({
    name : "reviewSlice",
    initialState,
    reducers: {

    },
    extraReducers: (builder)=>{
        builder.addCase(getReviews.pending, (state)=>{
            state.isLoading = true;
        }).addCase(getReviews.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.reviews = action.payload.data;
        }).addCase(getReviews.rejected, (state,action)=>{
            state.isLoading = false;
            state.reviews = [];
        });
    }

})

export default reviewSlice.reducer; 