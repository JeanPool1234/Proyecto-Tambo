import React, { useEffect, useState } from "react";
// import type { Producto } from "../../types";
import type { Categoria } from "../../types";
import ProductSection from "./ProductSection";

interface ProductPageProps {
  cat: number; // Suponemos que 'cat' es un número de ID de categoría
}
const ProductPage: React.FC<ProductPageProps> = ({ cat }) => {
  // const [productos, setProductos] = useState<Producto[]>([]);
  // const [categoriasLista, setCategoriasLista] = useState<Categoria[]>([]);
  const [nombreCategoriaSeleccionada, setNombreCategoriaSeleccionada] =
    useState<string>("");

  // useEffect(() => {
  //   fetch("http://localhost:5000/api/productosLista")
  //     .then((res) => res.json())
  //     .then((data) => setProductos(data))
  //     .catch((err) => console.error("Error al cargar productos:", err));
  // }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/categorias/categorias/listar")
      .then((res1) => res1.json())
      .then((data1) => {
        // setCategoriasLista(data1); // Guarda la lista completa de categorías

        // 2. Busca el nombre de la categoría basado en la prop 'cat'
        const categoriaEncontrada = data1.find(
          (item: Categoria) => item.id === cat
        );
        if (categoriaEncontrada) {
          setNombreCategoriaSeleccionada(categoriaEncontrada.nombre);
        } else {
          setNombreCategoriaSeleccionada("Categoría Desconocida");
        }
      })
      .catch((err1) => console.error("Error al cargar categorías:", err1));
  }, [cat]); // Vuelve a ejecutar este efecto si 'cat' cambia

  return (
  <div className="container mt-3">
      <ProductSection
        key={cat}
        categoriaId={cat}
        titulo={nombreCategoriaSeleccionada}
      />
  </div>
  );
};

export default ProductPage;
