import React from "react";
import { useCart, formatPrice } from "../context/CartContext";
import { handleEsewaPayment, confirmPurchase } from "../utils/paymentUtil";

const Cart = () => {
  const { cart, removeFromCart, subtotal } = useCart();

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="mt-20 px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-6 ">Your Cart</h1>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-lg">Your cart is empty.</p>
            ) : (
              <div className="space-y-4 pt-6">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white p-4 flex justify-between items-center gap-4 rounded-2xl  w-[760px] h-[128px] "
                  >
                    {/* Book Cover */}
                    <img
                      src={`http://localhost:5001/${item.coverImage}`}
                      alt={item.title}
                      className="w-[64px] h-[96px] object-cover rounded-lg"
                    />

                    {/* Book Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-1">
                        Author: {item.author}
                      </p>

                      {/* Rating */}
                      <div className="rating rating-sm">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const numericRating = item.rating
                            ? Math.round(Number(item.rating))
                            : 0;
                          return (
                            <input
                              key={star}
                              type="radio"
                              name={`rating-${item._id}`}
                              className="mask mask-star-2 bg-orange-400"
                              checked={star <= numericRating}
                              readOnly
                              tabIndex={-1}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="grid grid-row-2">
                      <div className="">
                        {/* Subtotal per book */}
                        <p className="mt-2 font-semibold">
                          Rs {formatPrice(item.finalPrice)}
                        </p>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 transition text-xl"
                        >
                          <div className="group">
                            <svg
                              width="19"
                              height="22"
                              viewBox="0 0 19 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.53125 0C6.24594 0 6.01562 0.230313 6.01562 0.515625C6.01562 0.800937 6.24594 1.03125 6.53125 1.03125H11.6875C11.9728 1.03125 12.2031 0.800937 12.2031 0.515625C12.2031 0.230313 11.9728 0 11.6875 0H6.53125ZM2.23438 2.40625C1.00203 2.40625 0 3.40828 0 4.64062C0 5.87297 1.00203 6.875 2.23438 6.875H15.4688V17.7031C15.4688 19.3136 14.1573 20.625 12.5469 20.625H5.67188C4.06141 20.625 2.75 19.3136 2.75 17.7031V8.76562C2.75 8.48031 2.51969 8.25 2.23438 8.25C1.94906 8.25 1.71875 8.48031 1.71875 8.76562V17.7031C1.71875 19.8825 3.4925 21.6562 5.67188 21.6562H12.5469C14.7262 21.6562 16.5 19.8825 16.5 17.7031V6.81323C17.4831 6.57948 18.2188 5.69594 18.2188 4.64062C18.2188 3.40828 17.2167 2.40625 15.9844 2.40625H2.23438ZM2.23438 3.4375H15.9844C16.6478 3.4375 17.1875 3.97719 17.1875 4.64062C17.1875 5.30406 16.6478 5.84375 15.9844 5.84375H2.23438C1.57094 5.84375 1.03125 5.30406 1.03125 4.64062C1.03125 3.97719 1.57094 3.4375 2.23438 3.4375ZM6.70312 9.28125C6.41781 9.28125 6.1875 9.51156 6.1875 9.79688V17.7031C6.1875 17.9884 6.41781 18.2188 6.70312 18.2188C6.98844 18.2188 7.21875 17.9884 7.21875 17.7031V9.79688C7.21875 9.51156 6.98844 9.28125 6.70312 9.28125ZM11.5156 9.28125C11.2303 9.28125 11 9.51156 11 9.79688V17.7031C11 17.9884 11.2303 18.2188 11.5156 18.2188C11.8009 18.2188 12.0312 17.9884 12.0312 17.7031V9.79688C12.0312 9.51156 11.8009 9.28125 11.5156 9.28125Z"
                                fill="#52525B"
                                className="transition-colors duration-300 group-hover:fill-[#FF0004]"
                              />
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className=" p-6 mb-6 flex justify-end gap-2 ">
              <span>{cart.length}</span> <span> Items</span>
            </div>
            <div className="bg-white p-6 space-y-4">
              <h2 className="text-1xl font-bold mb-6">Order Summary</h2>

              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between font-medium text-gray-700"
                >
                  <span>Subtotal</span>
                  <span>Rs. {formatPrice(item.finalPrice)}</span>
                </div>
              ))}

              {/* Total */}
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>Rs {formatPrice(subtotal)}</span>
              </div>

              <button
                onClick={() =>
                  handleEsewaPayment({ _id: "bookId", finalPrice: subtotal })
                }
                className="w-full btn btn-neutral rounded-none hover:bg-white hover:text-black py-3 font-semibold text-white  hover:border-black  transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
