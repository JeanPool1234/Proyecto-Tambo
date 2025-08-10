import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Producto } from "../../types";
import ModalProducto from "./ModalProducto"; // 👈 Asegúrate de importar correctamente
import { agregarAlCarrito } from "../Header/agregarAlCarrito";

interface Props {
  show: boolean;
  onHide: () => void;
}

const SearchModal: React.FC<Props> = ({ show, onHide }) => {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      if (busqueda.trim() === "") {
        setResultados([]);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/productos_buscar/buscar?nombre=${busqueda}`);
        if (res.ok) {
          const data = await res.json();
          setResultados(data);
        } else if (res.status === 404) {
          setResultados([]);
        }
      } catch (err) {
        console.error("❌ Error al buscar productos:", err);
      }
    };

    const delayDebounce = setTimeout(fetchProductos, 300);
    return () => clearTimeout(delayDebounce);
  }, [busqueda]);

  const handleMostrarDetalle = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setCantidad(1);
    setMostrarModalProducto(true);
  };

  const handleCerrarModalProducto = () => {
    setMostrarModalProducto(false);
    setProductoSeleccionado(null);
  };

const handleAgregarAlCarrito = async () => {
  if (!productoSeleccionado) return;

  try {
    const usuario_id = 1; // Puedes ajustarlo si usas auth
    await agregarAlCarrito(usuario_id, productoSeleccionado.id, cantidad);
    console.log("✅ Agregado al carrito:", productoSeleccionado, cantidad);
    handleCerrarModalProducto();
  } catch (error) {
    console.error("❌ Error al agregar al carrito:", error);
    alert("❌ No se pudo agregar al carrito.");
  }
};

  return (
    <>
      {/* Modal de búsqueda */}
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Buscar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Buscar producto"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="mt-3 d-grid gap-2">
            {resultados.map((producto) => (
              <Button
                key={producto.id}
                variant="outline-primary"
                onClick={() => handleMostrarDetalle(producto)}
              >
                {producto.nombre}
              </Button>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      {/* ModalProducto */}
      {productoSeleccionado && (
        <ModalProducto
          producto={productoSeleccionado}
          cantidad={cantidad}
          setCantidad={setCantidad}
          mostrar={mostrarModalProducto}
          onClose={handleCerrarModalProducto}
          onAgregar={handleAgregarAlCarrito}
        />
      )}
    </>
  );
};

export default SearchModal;