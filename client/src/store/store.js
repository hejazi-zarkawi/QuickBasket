import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./auth-slice/index.js";
import AdminProductsReducer from "./admin/products-slice/index.js"
import AdminOrderReducer from "./admin/order-slice/index.js"
import ShoppingProductsReducer from "./shop/products-slice/index.js"
import ShoppingCartReducer from "./shop/cart-slice/index.js"
import ShoppingAddressReducer from "./shop/address-slice/index.js"
import ShoppingOrderReducer from "./shop/order-slice/index.js"
import ShoppingSearchReducer from "./shop/search-slice/index.js"
import ShoppingReviewReducer from "./shop/review-slice/index.js"
import commonFeatureSlice from "./common-slice/index.js"
const store = configureStore({
    reducer:{
        auth : authReducer,
        adminProducts : AdminProductsReducer,
        adminOrder : AdminOrderReducer,
        shopProducts : ShoppingProductsReducer,
        shopCart : ShoppingCartReducer,
        shopAddress: ShoppingAddressReducer,
        shopOrder : ShoppingOrderReducer,
        shopSearch: ShoppingSearchReducer,
        shopReview: ShoppingReviewReducer,
        commonFeature : commonFeatureSlice,
    }
})

export default store;