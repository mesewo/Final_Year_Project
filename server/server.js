import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
// console.log("DEBUG CHAPA_SECRET_KEY:", process.env.CHAPA_SECRET_KEY);

import authRouter from "./routes/auth/auth-routes.js";
import adminProductsRouter from "./routes/admin/products-routes.js";
import adminOrderRouter from "./routes/admin/orders-routes.js";
import adminDashboardRoutes from "./routes/admin/dashboard-routes.js";
import adminUsersRouter from "./routes/admin/users-routes.js";
import adminReportsRouter from "./routes/admin/reports-routes.js";
import adminFeedbackRouter from "./routes/admin/feedback-routes.js";
import adminSettingsRouter from "./routes/admin/settings-routes.js";

import shopProductsRouter from "./routes/shop/products-routes.js";
import shopCartRouter from "./routes/shop/cart-routes.js";
import shopAddressRouter from "./routes/shop/address-routes.js";
import shopOrderRouter from "./routes/shop/order-routes.js";
import shopSearchRouter from "./routes/shop/search-routes.js";
// import shopReviewRouter from "./routes/shop/review-routes.js";
import bulkCartRoutes from "./routes/shop/bulk-cart-routes.js";
import shopFeedbackRouter from "./routes/shop/feedback-routes.js";

import factmanDashboardRouter from "./routes/factman/dashboard-routes.js";
import factmanProductsRouter from "./routes/factman/products-routes.js";
import factmanOrdersRouter from "./routes/factman/orders-routes.js";
import factmanUsersRouter from "./routes/factman/users-routes.js";
import factmanReportsRouter from "./routes/factman/reports-routes.js";
import factmanFeedbackRouter from "./routes/factman/feedback-routes.js";
import factmanSettingsRouter from "./routes/factman/settings-routes.js";
import factmanFeaturesRouter from "./routes/factman/features-routes.js";

import sellerProductsRouter from "./routes/seller/products-routes.js";
import sellerOrdersRouter from "./routes/seller/orders-routes.js";
import sellerDashboardRouter from "./routes/seller/dashboard-routes.js";
import sellerReportRoutes from "./routes/seller/reports-routes.js";
import sellerStoreRoutes from "./routes/seller/store-routes.js";
import sellerRequestsRoutes from "./routes/seller/requests-routes.js";

import storeKeeperStoreRoutes from "./routes/store-keeper/store-routes.js";
import storeKeeeperUserRoutes from "./routes/store-keeper/user-routes.js";
import storekeeperDashboardRoutes from "./routes/store-keeper/dashboard-routes.js";
import storeKeeperInventoryRoutes from "./routes/store-keeper/inventory-routes.js";
import storeKeeperReportRoutes from "./routes/store-keeper/report-routes.js";

import commonFeatureRouter from "./routes/common/feature-routes.js";
import productRequestRoutes from "./routes/productRequest-routes.js";
import notificationsRouter from "./routes/notifications.js";
import accountantRouter from "./routes/accountant/accountant.js";

import paymentroute from "./routes/payment/payment.js";
import verifyQRRoutes from "./routes/payment/verifyQr.js";
import paymentVerify from "./routes/payment/paymentVerify.js";

// Create a database connection
mongoose
  .connect(
    "mongodb+srv://abrshmelkamu3:v1DyNH0TFNv8QUcr@cluster0.l1r1qbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/users", adminUsersRouter);
app.use("/api/admin/reports", adminReportsRouter);
app.use("/api/admin/feedback", adminFeedbackRouter);
app.use("/api/admin/settings", adminSettingsRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/bulk-cart", bulkCartRoutes);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
// app.use("/api/shop/review", shopReviewRouter);
app.use("/api/shop/feedback", shopFeedbackRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.use("/api/factman/products", factmanProductsRouter);
app.use("/api/factman/orders", factmanOrdersRouter);
app.use("/api/factman/users", factmanUsersRouter);
app.use("/api/factman/reports", factmanReportsRouter);
app.use("/api/factman/feedback", factmanFeedbackRouter);
app.use("/api/factman/settings", factmanSettingsRouter);
app.use("/api/factman/features", factmanFeaturesRouter);
app.use("/api/factman", factmanDashboardRouter);

app.use("/api/seller/products", sellerProductsRouter);
app.use("/api/seller/stores", sellerStoreRoutes);
app.use("/api/seller/reports", sellerReportRoutes);
app.use("/api/seller/orders", sellerOrdersRouter);
app.use("/api/seller", sellerDashboardRouter);
app.use("/api/seller", sellerRequestsRoutes);

app.use("/api/storekeeper/stores", storeKeeperStoreRoutes);
app.use("/api/storekeeper/users", storeKeeeperUserRoutes);
app.use("/api/storekeeper/inventory", storeKeeperInventoryRoutes);
app.use("/api/storekeeper", storekeeperDashboardRoutes);
app.use("/api/product-requests", productRequestRoutes);
app.use("/api/storekeeper/reports", storeKeeperReportRoutes);
app.use("/api/notifications", notificationsRouter);
app.use("/api/accountant", accountantRouter);

app.use("/api/payment", paymentroute);
app.use("/api/payment/verify-qr", verifyQRRoutes);
app.use("/api/payment/verifypaymet", paymentVerify);

import { notifyAllLowOrOutOfStockProducts } from "./controllers/productRequest-controller.js";
notifyAllLowOrOutOfStockProducts();

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));