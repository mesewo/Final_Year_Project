import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/orders-slice";
import adminUsersSlice from "./admin/users-slice";
import adminDashboardReducer from "./admin/dashbard-slice";
import reportsReducer from "./admin/reports-slice";
import feedbackReducer from "./admin/feedback-slice";
import featuresReducer from "./admin/features-slice";
import settingsReducer from "./admin/settings-slice";

import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shoppingOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import shopFeedbackSlice from "./shop/feedback-slice";

import sellerProductsSlice from "./seller/products-slice";
import sellerOrdersSlice from "./seller/orders-slice";
import sellerDashboardReducer from "./seller/dashboard-slice";

import storeKeeperInventorySlice from "./store-keeper/inventory-slice";

import accountantReportsSlice from "./accountant/reports-slice";
import accountantFinanceSlice from "./accountant/finance-slice";

import commonFeatureSlice from "./common-slice";
import commonFeedbackSlice from "./common-slice/feedback-slice";





const store = configureStore({
  reducer: {
    // Authentication
    auth: authReducer,

    // Admin
    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    adminUsers: adminUsersSlice,
    adminDashboard: adminDashboardReducer,
    adminReports: reportsReducer,
    settings: settingsReducer,
    adminFeedback: feedbackReducer,
    adminFeatures: featuresReducer,

    // Buyer (shop)
    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shoppingOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    shopFeedback: shopFeedbackSlice,

    // Seller
    sellerProducts: sellerProductsSlice,
    sellerOrders: sellerOrdersSlice,
    sellerDashboard: sellerDashboardReducer,
    // Store Keeper
    inventory: storeKeeperInventorySlice,

    // Accountant
    accountantReports: accountantReportsSlice,
    accountantFinance: accountantFinanceSlice,

    // Common
    commonFeature: commonFeatureSlice,
    commonFeedback: commonFeedbackSlice,

    // Feedback
    

    // Features
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;