import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Layouts
import AuthLayout from "./components/auth/layout";
import AdminLayout from "./components/admin-view/layout";
import FactmanLayout from "./components/factman-view/layout";
import ShoppingLayout from "./components/shopping-view/layout";
import StoreKeeperLayout from "./components/store-keeper-view/layout";
import SellerLayout from "./components/seller-view/layout";
import AccountantLayout from "./components/accountant-view/Layout";
// import SellerSideBar from "./components/seller-view/side-bar";

// Auth pages
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import ForgotPasswordPage from "@/pages/auth/forgot-password";

// Admin pages
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminFeedback from "./pages/admin-view/feedback";
import AdminReports from "./pages/admin-view/reports";
import SystemSettings from "./pages/admin-view/settings";
import AdminUsers from "./pages/admin-view/users";

// Factman pages
import FactmanProducts from "./pages/factman-view/products";
import FactmanUsers from "./pages/factman-view/users";
import FactmanOrders from "./pages/factman-view/orders";
import FactmanReports from "./pages/factman-view/reports";
import FactmanFeedback from "./pages/factman-view/feedback";
import FactmanFeatures from "./pages/factman-view/features";
import FactmanSettings from "./pages/factman-view/settings";
import FactmanDashboard from "./pages/factman-view/dashboard";

// Role-specific dashboards

<<<<<<< HEAD

=======
>>>>>>> 6d70975 (integrate Chapa payment gateway)
import StoreKeeperDashboard from "./pages/store-keeper-view/dashboard";
import StoreKeeperStore from "./pages/store-keeper-view/store";
import InventoryManagement from "./pages/store-keeper-view/inventory";
import StorekeeperProductRequests from "./pages/store-keeper-view/product-request";
import StoreKeeperReports from "./pages/store-keeper-view/reports";

import AccountantDashboardPage from "./pages/accountant-view/dashboard";

// Shopping pages
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import StorePage from "@/pages/shopping-view/store";
import SearchProducts from "./pages/shopping-view/search";
import AboutPage from "@/pages/shopping-view/about";
import ContactPage from "@/pages/shopping-view/contact";

// Other components
import NotFound from "./pages/not-found";
import UnauthPage from "./pages/unauth-page";
import CheckAuth from "./components/common/check-auth";
import { Skeleton } from "@/components/ui/skeleton";

//seller pages
import SellerProducts from "./pages/seller-view/products";
import SellerOrders from "./pages/seller-view/orders";
import SellerReports from "./pages/seller-view/reports";
<<<<<<< HEAD
import SellerDashboard from "./pages/seller-view/dashboard"; 
// import SellerLayout from "./components/seller-view/Layout";
import SellerRequestProducts from "./pages/seller-view/product-request"
=======
import SellerDashboard from "./pages/seller-view/dashboard";
// import SellerLayout from "./components/seller-view/Layout";
import SellerRequestProducts from "./pages/seller-view/product-request";
>>>>>>> 6d70975 (integrate Chapa payment gateway)

//acountant pages
import AccountantDashboard from "./pages/accountant-view/dashboard";
import AccountantFinances from "./pages/accountant-view/finances";
import AccountantReports from "./pages/accountant-view/reports";
import AccountantTransaction from "./pages/accountant-view/Transaction";

<<<<<<< HEAD
=======
//payemnt
>>>>>>> 6d70975 (integrate Chapa payment gateway)

// Redux
import { checkAuth } from "./store/auth-slice";

function App() {
  const dispatch = useDispatch();
<<<<<<< HEAD
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
=======
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
>>>>>>> 6d70975 (integrate Chapa payment gateway)
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
<<<<<<< HEAD

        {/* Root Auth Check */}
        <Route path="/" element={<CheckAuth isAuthenticated={isAuthenticated} user={user} />} />
=======
        {/* Root Auth Check */}
        <Route
          path="/"
          element={<CheckAuth isAuthenticated={isAuthenticated} user={user} />}
        />
>>>>>>> 6d70975 (integrate Chapa payment gateway)

        {/* Auth Pages */}
        <Route
          path="/auth"
<<<<<<< HEAD
          element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AuthLayout /></CheckAuth>}
=======
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
>>>>>>> 6d70975 (integrate Chapa payment gateway)
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
<<<<<<< HEAD
            <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={["admin"]}>
=======
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              allowedRoles={["admin"]}
            >
>>>>>>> 6d70975 (integrate Chapa payment gateway)
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

        {/* Factman Routes */}
        <Route
          path="/factman"
          element={
<<<<<<< HEAD
            <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={["factman"]}>
=======
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              allowedRoles={["factman"]}
            >
>>>>>>> 6d70975 (integrate Chapa payment gateway)
              <FactmanLayout />
            </CheckAuth>
          }
        >
          <Route path="products" element={<FactmanProducts />} />
          <Route path="users" element={<FactmanUsers />} />
<<<<<<< HEAD
          <Route path="orders" element={<FactmanOrders />} /> 
=======
          <Route path="orders" element={<FactmanOrders />} />
>>>>>>> 6d70975 (integrate Chapa payment gateway)
          <Route path="reports" element={<FactmanReports />} />
          <Route path="feedback" element={<FactmanFeedback />} />
          <Route path="features" element={<FactmanFeatures />} />
          <Route path="settings" element={<FactmanSettings />} />
          <Route path="dashboard" element={<FactmanDashboard />} />
        </Route>
<<<<<<< HEAD
          

        {/* Role-based Dashboards */}
        <Route
        path="/seller"
        element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={["seller"]}>
          {/* You can optionally wrap in a layout like <SellerLayout /> */}
          <div className="p-4"> {/* Replace with <SellerLayout /> if you have one */}
            <SellerLayout/>
          </div>
        </CheckAuth>
=======

        {/* Role-based Dashboards */}
        <Route
          path="/seller"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              allowedRoles={["seller"]}
            >
              {/* You can optionally wrap in a layout like <SellerLayout /> */}
              <div className="p-4">
                {" "}
                {/* Replace with <SellerLayout /> if you have one */}
                <SellerLayout />
              </div>
            </CheckAuth>
>>>>>>> 6d70975 (integrate Chapa payment gateway)
          }
        >
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="request-products" element={<SellerRequestProducts />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="reports" element={<SellerReports />} />
        </Route>

<<<<<<< HEAD


        <Route
          path="/storekeeper"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={["store_keeper"]}>
=======
        <Route
          path="/storekeeper"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              allowedRoles={["store_keeper"]}
            >
>>>>>>> 6d70975 (integrate Chapa payment gateway)
              <StoreKeeperLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<StoreKeeperDashboard />} />
          <Route path="stores" element={<StoreKeeperStore />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="requests" element={<StorekeeperProductRequests />} />
          <Route path="reports" element={<StoreKeeperReports />} />
<<<<<<< HEAD

=======
>>>>>>> 6d70975 (integrate Chapa payment gateway)
        </Route>

        <Route
          path="/accountant"
          element={
<<<<<<< HEAD
            <CheckAuth isAuthenticated={isAuthenticated} user={user} allowedRoles={["accountant"]}>
=======
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              allowedRoles={["accountant"]}
            >
>>>>>>> 6d70975 (integrate Chapa payment gateway)
              <AccountantLayout />
            </CheckAuth>
          }
        >
<<<<<<< HEAD
        <Route path="dashboard" element={<AccountantDashboard />} />
        <Route path="finance" element={<AccountantFinances />}/>
        <Route path="transactions" element={<AccountantTransaction/>}/>
        <Route path="reports" element={<AccountantReports/>}/>

</Route>
=======
          <Route path="dashboard" element={<AccountantDashboard />} />
          <Route path="finance" element={<AccountantFinances />} />
          <Route path="transactions" element={<AccountantTransaction />} />
          <Route path="reports" element={<AccountantReports />} />
        </Route>
>>>>>>> 6d70975 (integrate Chapa payment gateway)
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
          <Route path="store/:storeId" element={<StorePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        {/* Other Pages */}
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
<<<<<<< HEAD


=======
>>>>>>> 6d70975 (integrate Chapa payment gateway)
