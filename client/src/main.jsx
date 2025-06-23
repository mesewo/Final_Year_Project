// import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";
// import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./store/store.js";
// import { Toaster } from "./components/ui/toaster.jsx";

// createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <Provider store={store}>
//       <App />
//       <Toaster />
//     </Provider>
//   </BrowserRouter>
// );




import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "./components/ui/toaster.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "100533829641-ppkugdusfr353lm7r7ao1jh88pj9j09c.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
        <Toaster />
      </GoogleOAuthProvider>
    </Provider>
  </BrowserRouter>
);
