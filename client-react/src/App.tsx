// import React from "react";
import Cabecera from "./components/Header/Cabecera";
import Header from "./components/Header/Navegacion/Header";
import MainBanner from "./components/MainBanner";
import ProductPage from "./components/Productos/ProductPage";

function App() {
  const misImagenesParaBanner = [
    "http://127.0.0.1:8000/static/logos/carrusel1-x-1920.webp",
    "http://127.0.0.1:8000/static/logos/carrusel2-x-1920.webp",
    "http://127.0.0.1:8000/static/logos/carrusel3-x-1920.webp",
  ];

  return (
    <>
      <Cabecera />
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
