import React, { useEffect, useState } from 'react';
import type { Producto } from "../../types";
import ProductCard from './ProductCard';

interface Props {
  categoriaId: number;  // <-- Nuevo nombre para evitar conflicto con key
  titulo: string;
}

const ProductSection: React.FC<Props> = ({ titulo, categoriaId }) => {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/categorias/categoria/id/${categoriaId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener productos");
        return res.json();
      })
      .then((data: Producto[]) => {
        setProductos(data);
      })
      
      .catch((err) => {
        console.error("Error al cargar productos por categoría:", err);
      });
  }, [categoriaId]);

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center px-2">
        <h5 className="fw-bold">{titulo}</h5>
        {productos.length > 0 && (
          <a href="#" className="text-primary small">
            Ver más ({productos.length})
          </a>
        )}
      </div>
      <div className="d-flex overflow-x-auto gap-3 p-2">
        {productos.length > 0 ? (
          productos.map((prod) => (
            <ProductCard key={prod.id} producto={prod} />
          ))
        ) : (
          <p>Cargando productos o no hay productos para esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default ProductSection;

