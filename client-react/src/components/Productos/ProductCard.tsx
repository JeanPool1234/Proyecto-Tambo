import React, { useState } from "react";
import type { Producto } from "../../types";
import { agregarAlCarrito } from "../Header/agregarAlCarrito";
import ModalProducto from "./ModalProducto";

const ProductCard: React.FC<{ producto: Producto }> = ({ producto }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  const handleAgregarAlCarrito = async () => {
    try {
      const idOfLocalStore = Number(localStorage.getItem("user_id"));
      const usuario_id = idOfLocalStore !== 0 ? idOfLocalStore : 1;
      await agregarAlCarrito(usuario_id, producto.id, cantidad);
      setMostrarModal(false);
    } catch (error) {
      console.error("❌ Error al agregar al carrito:", error);
      alert("❌ No se pudo agregar al carrito.");
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== "BUTTON") {
      setCantidad(1); // reiniciar cantidad al abrir
      setMostrarModal(true);
    }
  };

  return (
    <>
      <div
        className="card border"
        style={{
          width: "160px",
          height: "278px",
          cursor: "pointer",
          flex: "0 0 160px", // si el padre es flex, esto fija el ancho
        }}
        onClick={handleCardClick}
      >
        <span
          className="badge position-absolute m-2 rounded-pill"
          style={{ background: "#A81B8D" }}
        >
          {producto.descuento}%
        </span>
        <div className="relative">
          <img
            src={`http://localhost:5000/static/productos/${producto.imagen_url}`}
            alt={producto.nombre}
            style={{
              width: "100%", // ocupa todo el ancho disponible
              height: "auto", // ajusta altura proporcionalmente
              objectFit: "contain",
            }}
          />
        </div>

        <div className="card-body p-2 d-flex flex-column justify-content-between">
          <p className="card-title fw-bold small text-truncate me-4">
            {producto.nombre}
          </p>
          <div className="container d-flex gap-3 text-center">
            <p className="card-text mb-1 text-danger fw-bold">
              S/{producto.precio_descuento}
            </p>
            <p className="text-muted text-decoration-line-through">
              S/{producto.precio.toFixed(2)}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCantidad(1);
              handleAgregarAlCarrito();
            }}
            className="px-2 position-absolute bottom-0 end-0 translate-middle link-underline link-underline-opacity-0 rounded-circle border-0"
            style={{ background: "#A81B8D", color: "white" }}
          >
            +
          </button>
        </div>
      </div>

      <ModalProducto
        producto={producto}
        cantidad={cantidad}
        setCantidad={setCantidad}
        mostrar={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onAgregar={handleAgregarAlCarrito}
      />
    </>
  );
};

export default ProductCard;
