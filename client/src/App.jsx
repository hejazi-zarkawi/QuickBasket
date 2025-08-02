import { Route } from 'react-router-dom';
import AuthLayout from './components/auth/layout.jsx';
import { Routes } from 'react-router-dom';
import Login from "./pages/auth/login.jsx";
import Register from "./pages/auth/register.jsx";
import AdminDashBoard from './pages/admin-view/dashboard.jsx';
import AdminFeatures from './pages/admin-view/features.jsx';
import AdminOrders from './pages/admin-view/orders.jsx';
import AdminProducts from './pages/admin-view/products.jsx';
import AdminLayout from './components/admin-view/layout.jsx';
import ShoppingLayout from './components/shopping-view/layout.jsx';
import PageNotFound from './pages/page-not-found/index.jsx'
import ShoppingHome from './pages/shopping-view/home.jsx';
import ShoppingListing from './pages/shopping-view/listing.jsx';
import ShoppingCheckout from './pages/shopping-view/checkout.jsx';
import ShoppingAccount from './pages/shopping-view/account.jsx';
import ShoppingSearch from './pages/shopping-view/search.jsx';
import CheckAuth from './components/common/chech-auth.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/auth-slice/index.js';
import { useEffect } from 'react';
import PaypalPaymentReturn from './pages/shopping-view/paypal-return.jsx';
import PaypalPaymentCancel from './pages/shopping-view/paypal-cancel.jsx';
import PaymentSuccessPage from './pages/shopping-view/payment-success.jsx';


function App() {

  const dispatch = useDispatch();
  const isLoading = useSelector((state)=> state.auth.isLoading)

  useEffect(()=>{
    const token = JSON.parse(sessionStorage.getItem('token'))
    dispatch(checkAuth(token)).then((data)=>{
      // console.log(data.payload.message);
    })
  },[dispatch])

  if(isLoading){
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return (
    <>
      <div className='flex flex-col min-h-screen'>

        <Routes>
          <Route path='/' element={
            <CheckAuth >
              
            </CheckAuth>
          }>
          </Route>
          <Route path="/auth" element={
            <CheckAuth >
              <AuthLayout />
            </CheckAuth>
          } >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path='/admin' element={
            <CheckAuth >
              <AdminLayout />
            </CheckAuth>
          }>
            <Route path="dashboard" element={<AdminDashBoard />} />
            <Route path="features" element={<AdminFeatures />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>

          <Route path='/shop' element={
            <CheckAuth >
              <ShoppingLayout />
            </CheckAuth>
          }>
            <Route path='home' element={<ShoppingHome />} />
            <Route path='listing' element={<ShoppingListing />} />
            <Route path='checkout' element={<ShoppingCheckout />} />
            <Route path='account' element={<ShoppingAccount />} />
            <Route path='paypal-return' element={<PaypalPaymentReturn />} />
            <Route path='paypal-cancel' element={<PaypalPaymentCancel />} />
            <Route path='payment-success' element={<PaymentSuccessPage />} />
            <Route path='search' element={<ShoppingSearch />} />
          </Route>
          <Route path='*' element={<PageNotFound />}>
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
