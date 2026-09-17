// src/components/CarritoLateral.tsx

import React, { useState, useEffect } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import { BsGeoAlt } from "react-icons/bs";
// import type { CarritoItem } from "../../types"; // Ajusta la ruta a tu archivo types.ts - ¡Eliminado!
import UbicacionModal from "../Ubicacion/UbicacionModal";
import { useNavigate } from "react-router-dom"; // ¡Importa useNavigate!

const LOCATION_STORAGE_KEY = "selectedUserLocation";
const DEFAULT_LOCATION_TEXT = "¿Dónde quieres pedir?";

// Definición de la interfaz CarritoItem directamente en este archivo.
// Es crucial que esta definición coincida con la estructura de datos que tu backend devuelve para el carrito.
// La propiedad 'producto_id' es necesaria para identificar qué producto eliminar del carrito.
interface CarritoItem {
  id: number; // Este es el ID del registro del carrito (ej. id de la fila en la tabla 'Carrito')
  producto_id: number; // Este es el ID del producto real, necesario para las operaciones de eliminación
  nombre: string;
  precio: number;
  cantidad: number;
  imagen_url: string;
  precio_original?: number;
  usuario_id: number; // El ID del usuario asociado a este ítem del carrito
}

interface CarritoLateralProps {
  show: boolean;
  handleClose: () => void;
  usuarioId: number; // El ID de usuario que se recibe de IconButtons (el propietario del carrito)
}

const CarritoLateral: React.FC<CarritoLateralProps> = ({
  show,
  handleClose,
  usuarioId, // Se recibe el usuarioId aquí
}) => {
  const [cartItems, setCartItems] = useState<CarritoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLocationText, setSelectedLocationText] = useState(
    DEFAULT_LOCATION_TEXT
  );
  const [showLocationModalInLateral, setShowLocationModalInLateral] =
    useState(false);

  // Inicializa useNavigate
  const navigate = useNavigate();

  useEffect(() => {
    const storedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (storedLocation) {
      setSelectedLocationText(storedLocation);
    }
  }, []);

  const handleShowLocationModalInLateral = () =>
    setShowLocationModalInLateral(true);
  const handleCloseLocationModalInLateral = () =>
    setShowLocationModalInLateral(false);

  const handleLocationSelectedInLateral = (locationText: string) => {
    setSelectedLocationText(locationText);
    localStorage.setItem(LOCATION_STORAGE_KEY, locationText);
    handleCloseLocationModalInLateral();
  };

  const isLocationSelected = selectedLocationText !== DEFAULT_LOCATION_TEXT;

  const handleContinuarClick = () => {
    handleClose(); // Cierra el carrito
    // Pasa tanto los cartItems como el usuarioId al estado de navegación
    navigate("/pedido", {
      state: { cartItems: cartItems, usuarioId: usuarioId },
    });
  };

  // Función para cargar el carrito desde la API
  const fetchCartItems = async () => {
    if (!usuarioId) {
      console.warn("No hay usuarioId para cargar el carrito.");
      setCartItems([]); // Limpiar carrito si no hay usuario
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/carrito/carrito/${usuarioId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: CarritoItem[] = await response.json();
      setCartItems(data);
    } catch (err: any) {
      console.error("Error al cargar el carrito:", err);
      setError("No se pudo cargar el carrito. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar el carrito cuando el componente se muestra o el usuarioId cambia
  useEffect(() => {
    if (show) {
      // Solo cargar si el carrito lateral está visible
      fetchCartItems();
    } else if (!show) {
      setCartItems([]); // Limpiar carrito cuando se cierra
      setError(null);
    }
  }, [show, usuarioId]); // Depende de 'show' y 'usuarioId'

  // Nueva función para eliminar un ítem del carrito
  const handleRemoveItem = async (productoId: number) => {
    if (!usuarioId) {
      alert("No se pudo eliminar el producto: No hay ID de usuario.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/carrito/carrito/eliminar?usuario_id=${usuarioId}&producto_id=${productoId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        // Log the full error response from the backend
        console.error("Error detallado del backend al eliminar:", errorData);
        throw new Error(
          errorData.detail
            ? JSON.stringify(errorData.detail)
            : errorData.error ||
              `Error al eliminar el producto: ${response.statusText}`
        );
      }
      fetchCartItems(); // Recargar el carrito para actualizar la UI
    } catch (err: any) {
      console.error("Error al eliminar el producto:", err);
      alert(`Error al eliminar el producto: ${err.message}`);
    }
  };

  // Nueva función para vaciar el carrito completo
  const handleEmptyCart = async () => {
    if (!usuarioId) {
      alert("No se pudo vaciar el carrito: No hay ID de usuario.");
      return;
    }
    if (
      window.confirm("¿Estás seguro de que quieres vaciar todo el carrito?")
    ) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/carrito/carrito/vaciar/${usuarioId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.detail ||
              `Error al vaciar el carrito: ${response.statusText}`
          );
        }
        fetchCartItems(); // Recargar el carrito para actualizar la UI
      } catch (err: any) {
        console.error("Error al vaciar el carrito:", err);
        alert(`Error al vaciar el carrito: ${err.message}`);
      }
    }
  };

  let totalProductos = 0;
  let descuentos = 0;

  cartItems.forEach((item) => {
    totalProductos += item.precio * item.cantidad;
    if (item.precio_original && item.precio_original > item.precio) {
      descuentos += (item.precio_original - item.precio) * item.cantidad;
    }
  });

  const subtotal = totalProductos - descuentos;

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Tu Carrito ({cartItems.length})</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading && <p>Cargando carrito...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && (
          <>
            <div className="mb-3">
              <Form.Group controlId="formLocation">
                <Form.Label className="text-muted">
                  ¿Dónde quieres pedir?
                </Form.Label>
                <Button
                  variant="outline-light"
                  className="border rounded-pill text-danger px-3 py-1 d-flex align-items-center gap-2"
                  onClick={handleShowLocationModalInLateral}
                >
                  <BsGeoAlt /> {selectedLocationText}
                </Button>
              </Form.Group>
            </div>

            <div className="cart-items-list mb-4">
              {cartItems.length === 0 ? (
                <p>Tu carrito está vacío.</p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id} // Usar item.id como key, que es el ID del registro del carrito
                    className="d-flex align-items-center mb-3 border-bottom pb-3"
                  >
                    <Image
                      src={`http://127.0.0.1:8000/static/productos/${item.imagen_url}`}
                      alt={item.nombre}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        marginRight: "15px",
                      }}
                      rounded
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.nombre}</h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          {item.precio_original &&
                          item.precio_original > item.precio ? (
                            <>
                              <span className="text-decoration-line-through text-muted small me-2">
                                S/ {item.precio_original.toFixed(2)}
                              </span>
                              <span className="fw-bold">
                                S/ {item.precio.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="fw-bold">
                              S/ {item.precio.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {/* Botón de Eliminar */}
                        <Button
                          variant="danger" // Cambiado a variant="danger" para indicar eliminación
                          size="sm"
                          className="ms-auto"
                          onClick={() => handleRemoveItem(item.producto_id)} // Llama a la nueva función
                        >
                          Eliminar
                        </Button>
                      </div>
                      <div className="d-flex align-items-center mt-2">
                        {/* Los botones de cantidad se mantienen si son funcionales */}
                        <Button variant="outline-secondary" size="sm">
                          -
                        </Button>
                        <span className="mx-2">{item.cantidad}</span>
                        <Button variant="outline-secondary" size="sm">
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-summary mb-4">
              <div className="d-flex justify-content-between">
                <span>Total Productos</span>
                <span>S/ {totalProductos.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between text-success">
                <span>Descuentos</span>
                <span>- S/ {descuentos.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
                <span>Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="cart-actions">
              {!isLocationSelected && (
                <Button
                  variant="warning"
                  className="w-100 mb-2"
                  onClick={handleShowLocationModalInLateral}
                >
                  Ingresa tu dirección o selecciona un local para continuar
                </Button>
              )}

              <Button
                variant="light"
                className="w-100 border"
                disabled={!isLocationSelected}
                onClick={handleContinuarClick}
              >
                Continuar
              </Button>
              {/* Nuevo botón para vaciar el carrito */}
              {cartItems.length > 0 && ( // Solo muestra el botón si hay ítems en el carrito
                <Button
                  variant="outline-danger" // Estilo para indicar una acción destructiva
                  className="w-100 mt-2" // Margen superior para separarlo del botón "Continuar"
                  onClick={handleEmptyCart}
                >
                  Vaciar Carrito
                </Button>
              )}
            </div>
          </>
        )}
      </Offcanvas.Body>

      <UbicacionModal
        show={showLocationModalInLateral}
        onHide={handleCloseLocationModalInLateral}
        onLocationSelected={handleLocationSelectedInLateral}
      />
    </Offcanvas>
  );
};

export default CarritoLateral;
