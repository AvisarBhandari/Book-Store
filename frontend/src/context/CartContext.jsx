import { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

// Track IDs of books that already triggered a toast
const toastShown = new Set();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === book._id);

      if (existing) {
        // silently update quantity
        return prev.map((item) =>
          item._id === book._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Show toast only if not shown already
      if (!toastShown.has(book._id)) {
        toastShown.add(book._id);
        toast.success(`Added "${book.title}" to cart 🛒`, {
          duration: 2000,
          position: "top-right",
          style: {
            borderRadius: "8px",
            background: "#fff",
            color: "#333",
            padding: "12px 16px",
          },
        });
      }

      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
    toast("Item removed ❌", {
      duration: 2000,
      position: "top-right",
    });

    // Remove from toastShown so user can add again
    toastShown.delete(id);
  };

  const isInCart = (id) => cart.some((item) => item._id === id);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, isInCart, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
