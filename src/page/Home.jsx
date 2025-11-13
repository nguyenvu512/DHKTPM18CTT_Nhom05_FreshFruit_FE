import React from "react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageSlider from "../components/ImageSlider";
import ProductPreview from "../components/ProductPreview";

function Home() {
  return (
    <>
      <NavBar />
      <ImageSlider></ImageSlider>
      <ProductPreview></ProductPreview>
      <Footer />
    </>
  );
}

export default Home;
