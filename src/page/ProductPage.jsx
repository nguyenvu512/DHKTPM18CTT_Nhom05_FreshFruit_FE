import React from "react";
import ProductList from "../components/ProductList"; 
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

function ProductPage() {
  return (
    <>
      <NavBar></NavBar>
      <ProductList />
      <Footer></Footer>
      </>
  );
}

export default ProductPage;
