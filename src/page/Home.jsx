import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ImageSlider from "../components/ImageSlider";

function Home() {
  return (
    <>
      <NavBar />
      <ImageSlider></ImageSlider>
      <Footer />
    </>
  );
}

export default Home;
