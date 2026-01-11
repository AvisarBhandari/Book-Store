import { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export function formatPrice(value) {
  return Number(value).toFixed(2);
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    // Check if already in cart first
    const exists = cart.find((item) => item._id === book._id);
    if (exists) {
      toast("Book already in cart");
      return;
    }

    // Show success toast
    toast.success(`Added "${book.title}" to cart 🛒`);

    // Add book to cart
    setCart((prev) => [
      ...prev,
      {
        _id: book._id,
        title: book.title,
        coverImage: book.coverImage,
        finalPrice: book.finalPrice,
        author: book.author, // new
        rating: book.ratings, // new
      },
    ]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
    toast.error("Item removed ❌");
  };

  const isInCart = (id) => cart.some((item) => item._id === id);

  const subtotal = cart.reduce((sum, item) => sum + item.finalPrice, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, isInCart, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
