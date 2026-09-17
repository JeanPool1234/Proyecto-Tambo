import React from "react";
import type { Producto } from "../../types";

interface ModalProductoProps {
  producto: Producto;
  cantidad: number;
  setCantidad: (cantidad: number) => void;
  mostrar: boolean;
  onClose: () => void;
  onAgregar: () => void;
}

const ModalProducto: React.FC<ModalProductoProps> = ({
  producto,
  cantidad,
  setCantidad,
  mostrar,
  onClose,
  onAgregar,
}) => {
  const precioTotal = (producto.precio_descuento * cantidad).toFixed(2);

  if (!mostrar) return null;

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{producto.nombre}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body text-center">
            <img
              src={`http://localhost:5000/static/productos/${producto.imagen_url}`}
              alt={producto.nombre}
              className="img-fluid mb-3"
              style={{ maxHeight: "200px" }}
            />
            <p>{producto.descripcion}</p>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="form-control my-2"
              style={{ width: "100px", margin: "0 auto" }}
            />
            <p>
              Total: <strong>S/ {precioTotal}</strong>
            </p>
          </div>
          <div className="modal-footer">
            <button onClick={onAgregar} className="btn btn-primary">
              Agregar al carrito
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalProducto;
