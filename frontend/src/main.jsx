import "./index.css";
import { Toaster } from "react-hot-toast";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2000,
            style: {
              borderRadius: "8px",
              background: "#fff",
              color: "#333",
            },
          }}
        />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
