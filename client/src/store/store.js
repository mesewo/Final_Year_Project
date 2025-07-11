import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/orders-slice";
import adminUsersSlice from "./admin/users-slice";
import adminDashboardReducer from "./admin/dashbard-slice";
import adminReportsReducer from "./admin/reports-slice";
import adminFeedbackReducer from "./admin/feedback-slice";
import adminFeaturesReducer from "./admin/features-slice";
import adminSettingsReducer from "./admin/settings-slice";
import accountantReducer from "@/store/admin/accountant-slice";

import factmanProductsSlice from "./factman/products-slice";
import factmanOrdersSlice from "./factman/orders-slice";
import factmanSettingsSlice  from "./factman/settings-slice";
import factmanUsersSlice from "./factman/users-slice";
import factmanReportsSlice from "./factman/reports-slice";
import factmanFeedbackSlice from "./factman/feedback-slice";
import factmanFeaturesSlice from "./factman/features-slice";
import factmanDashboardSlice from "./factman/dashboard-slice";


import shopProductsSlice from "./shop/products-slice";
import userSlice from "./shop/user-slice";
import storeSlice from "./shop/store-slice";
import shopCartSlice from "./shop/cart-slice";
import bulkCartReducer from "./shop/bulkcart-slice";
import shopAddressSlice from "./shop/address-slice";
import shoppingOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
// import shopReviewSlice from "./shop/review-slice";
import shopFeedbackSlice from "./shop/feedback-slice";
import storesReducer from "./shop/store-slice";
import { fetchAllStores } from "@/store/shop/store-slice";


import sellerProductsSlice from "./seller/products-slice";
import sellerOrdersSlice from "./seller/orders-slice";
import sellerDashboardSlice from "./seller/dashboard-slice";
import sellerReportsReducer from "./seller/reports-slice";
import sellerSettingsReducer from "./seller/settings-slice";

import StoreKeeperInventorySlice from "./store-keeper/inventory-slice";
import StorekeeperDashboardSlice from "./store-keeper/dashboard-slice";
import StoreKeeperStoreSlice from "./store-keeper/store-slice";
import storeKeeperReportReducer from "./store-keeper/report-slice";
import storekeeperSettingsReducer from "./store-keeper/settings-slice";


import commonFeatureSlice from "./common-slice";
import commonFeedbackSlice from "./common-slice/feedback-slice";
import  productRequestSlice  from "./productRequest-slice";





const store = configureStore({
  reducer: {
    // Authentication
    auth: authReducer,

    // Admin
    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    adminUsers: adminUsersSlice,
    adminDashboard: adminDashboardReducer,
    adminReports: adminReportsReducer,
    settings: adminSettingsReducer,
    adminFeedback: adminFeedbackReducer,
    adminFeatures: adminFeaturesReducer,
    accountant: accountantReducer,

    // Factman
    factmanProducts: factmanProductsSlice,
    factmanOrders: factmanOrdersSlice,
    factmanUsers: factmanUsersSlice,
    factmanDashboard: factmanDashboardSlice,
    factmanReports: factmanReportsSlice,
    factmanFeedback: factmanFeedbackSlice,
    factmanSettings: factmanSettingsSlice,
    factmanFeatures: factmanFeaturesSlice,

    // Buyer (shop)
    shopProducts: shopProductsSlice,
    store: storeSlice,
    shopCart: shopCartSlice,
    bulkCart: bulkCartReducer,
    shopAddress: shopAddressSlice,
    shopOrder: shoppingOrderSlice,
    shopSearch: shopSearchSlice,
    // shopReview: shopReviewSlice,
    shopFeedback: shopFeedbackSlice,
    stores: storesReducer,
    user: userSlice,

    // Seller
    sellerProducts: sellerProductsSlice,
    sellerOrders: sellerOrdersSlice,
    sellerDashboard: sellerDashboardSlice,
    sellerReports: sellerReportsReducer,
    sellerSettings: sellerSettingsReducer,

    // Store Keeper
    inventory: StoreKeeperInventorySlice,
    storeKeeperDashboard: StorekeeperDashboardSlice,
    storeKeeperStore: StoreKeeperStoreSlice,
    storeKeeperReports: storeKeeperReportReducer,
    storekeeperSettings: storekeeperSettingsReducer,

    // Common
    commonFeature: commonFeatureSlice,
    commonFeedback: commonFeedbackSlice,
    // Product Requests
    productRequest: productRequestSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;