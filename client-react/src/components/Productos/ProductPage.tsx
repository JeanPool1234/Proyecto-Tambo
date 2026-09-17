import React, { useEffect, useState } from "react";
import type { Categoria } from "../../types";
import ProductSection from "./ProductSection";

interface ProductPageProps {
  cat: number;
}

const ProductPage: React.FC<ProductPageProps> = ({ cat }) => {
  const [nombreCategoriaSeleccionada, setNombreCategoriaSeleccionada] =
    useState<string | null>(null); // null = aún cargando
  const [categoriaValida, setCategoriaValida] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categorias/categorias/listar")
      .then((res1) => res1.json())
      .then((data1) => {
        const categoriaEncontrada = data1.find(
          (item: Categoria) => item.id === cat
        );
        if (categoriaEncontrada) {
          setNombreCategoriaSeleccionada(categoriaEncontrada.nombre);
          setCategoriaValida(true);
        } else {
          setNombreCategoriaSeleccionada("Categoría no disponible");
          setCategoriaValida(false);
        }
      })
      .catch((err1) => {
        console.error("Error al cargar categorías:", err1);
        setCategoriaValida(false);
      });
  }, [cat]);

  return (
    <div className="container mt-3">
      {categoriaValida ? (
        <ProductSection
          key={cat}
          categoriaId={cat}
          titulo={nombreCategoriaSeleccionada ?? ""}
        />
      ) : (
        <p>{nombreCategoriaSeleccionada}</p>
      )}
    </div>
  );
};

export default ProductPage;