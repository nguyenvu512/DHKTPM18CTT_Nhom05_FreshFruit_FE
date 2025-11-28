import React from "react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageSlider from "../components/ImageSlider";
import ProductPreview from "../components/ProductPreview";

function Home() {
  return (
    <>
      <ImageSlider></ImageSlider>
      <ProductPreview></ProductPreview>
    </>
  );
}

export default Home;
