import React from "react";
import NavBar from "../components/navBar.jsx";
import Cart from "../components/Card.jsx";
import Footer from '../components/footer.jsx'
const CartPage = () => {
  return (
    <div className="bg-[#FAFAFA] min-h-screen ">
      <div>
        <NavBar />
      </div>

      <Cart />
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default CartPage;
