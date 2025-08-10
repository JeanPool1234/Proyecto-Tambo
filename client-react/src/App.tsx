// import React from "react";
import TopBar from "./components/TopBar";
import Header from "./components/Header/Header";
import MainBanner from "./components/MainBanner";
import ProductPage from "./components/Productos/ProductPage";

function App() {
  const misImagenesParaBanner = [
    "http://localhost:5000/static/logos/carrusel1-x-1920.webp",
    "http://localhost:5000/static/logos/carrusel2-x-1920.webp",
    "http://localhost:5000/static/logos/carrusel3-x-1920.webp",
  ];

  return (
    <>
      <TopBar />
      <Header />
      <MainBanner images={misImagenesParaBanner} />
      <ProductPage cat={1} />
      <ProductPage cat={2} />
      <ProductPage cat={3} />
      <ProductPage cat={4} />
    </>
  );
}

export default App;
