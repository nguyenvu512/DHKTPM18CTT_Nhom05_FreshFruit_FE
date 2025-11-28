import React from "react";
import { Carousel, Container } from "react-bootstrap";
import img1 from "../img/slide_1_img_2048x2048.jpg";
import img2 from "../img/slide_2_img.jpg";
import img3 from "../img/slide_4_img.jpg";

function ImageSlider() {
  const images = [
    { src: img1 },
    { src: img2 },
    { src: img3 },
  ];

  return (
    <Container className="my-4">
      <Carousel fade interval={3000}>
        {images.map((img, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 rounded-3 shadow-sm"
              src={img.src}
              style={{
                height: "100%",
                objectFit: "cover",
              }}
              alt={`Slide ${index + 1}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
}

export default ImageSlider;
