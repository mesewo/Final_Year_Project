import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders"; // Keep this, you will need it.
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
// import PaypalReturnPage from "./pages/shopping-view/paypal-return"; // commented out
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";

// Import the new dashboard components
import AdminDashboardPage from './pages/admin-view/dashboard.jsx';  // Corrected paths
import SellerDashboardPage from './pages/seller-view/dashboard.jsx';
import StoreKeeperDashboardPage from './pages/store-keeper-view/dashboard.jsx';
import AccountantDashboardPage from './pages/accountant-view/dashboard.jsx';


function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={['admin']}> {/* Added role check */}
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          {/* Add the new admin route */}
          <Route path="admin-dashboard" element={<AdminDashboardPage />} />
        </Route>
        {/* Add routes for the other dashboards, with role checks
        <Route
          path="/buyer"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={['buyer']}>
              <BuyerDashboardPage />
            </CheckAuth>
          }
        /> */}
        <Route
          path="/seller"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={['seller']}>
              <SellerDashboardPage />
            </CheckAuth>
          }
        />
        <Route
          path="/store-keeper"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={['store-keeper']}>
              <StoreKeeperDashboardPage />
            </CheckAuth>
          }
        />
        <Route
          path="/accountant"
          element={
             <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={['accountant']}>
                <AccountantDashboardPage/>
             </CheckAuth>
          }
        />

        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          {/* <Route path="paypal-return" element={<PaypalReturnPage />} /> */}
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

