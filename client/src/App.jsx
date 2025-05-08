import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Layouts
import AuthLayout from "./components/auth/layout";
import AdminLayout from "./components/admin-view/layout";
import ShoppingLayout from "./components/shopping-view/layout";

// Auth pages
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";

// Admin pages
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminFeedback from "./pages/admin-view/feedback";
import AdminReports from "./pages/admin-view/reports";
import SystemSettings from "./pages/admin-view/settings";
import AdminUsers from "./pages/admin-view/users";

// Role-specific dashboards
import AdminDashboardPage from "./pages/admin-view/dashboard";
import SellerDashboardPage from "./pages/seller-view/dashboard";
import StoreKeeperDashboardPage from "./pages/store-keeper-view/dashboard";
import AccountantDashboardPage from "./pages/accountant-view/dashboard";

// Shopping pages
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";

// Other components
import NotFound from "./pages/not-found";
import UnauthPage from "./pages/unauth-page";
import CheckAuth from "./components/common/check-auth";
import { Skeleton } from "@/components/ui/skeleton";

// Redux
import { checkAuth } from "./store/auth-slice";

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>

        {/* Root Auth Check */}
        <Route path="/" element={<CheckAuth isAuthenticated={isAuthenticated} user={user} />} />

        {/* Auth Pages */}
        <Route
          path="/auth"
          element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AuthLayout /></CheckAuth>}
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={["admin"]}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* Role-based Dashboards */}
        <Route
          path="/seller"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={["seller"]}>
              <SellerDashboardPage />
            </CheckAuth>
          }
        />
        <Route
          path="/store-keeper"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={["store-keeper"]}>
              <StoreKeeperDashboardPage />
            </CheckAuth>
          }
        />
        <Route
          path="/accountant"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={["accountant"]}>
              <AccountantDashboardPage />
            </CheckAuth>
          }
        />

        {/* Shopping Routes */}
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
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>

        {/* Other Pages */}
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
