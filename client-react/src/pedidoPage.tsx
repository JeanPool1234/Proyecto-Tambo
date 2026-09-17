// src/pages/PedidoPage.tsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
} from "react-bootstrap";
import { BsPencilFill } from "react-icons/bs"; // Para el icono de edición
import { useLocation } from "react-router-dom";
import LogoComponent from "./components/Header/Navegacion/Logo"; // Asegúrate de que esta ruta sea correcta
import UbicacionSelectorContent from "./components/UbicacionSelectorContent"; // ¡Importa el nuevo componente de contenido!
// import OrderConfirmationModal from "./components/OrderConfirmationModal"; // ¡Eliminado: Importación del modal de confirmación!
import { createOrder } from "./pedidoService"; // ¡IMPORTACIÓN CLAVE AQUÍ!
import Image from "react-bootstrap/Image"; // Mantener la importación original de Image de react-bootstrap
// Importamos Image de react-bootstrap con un alias para evitar conflictos con el constructor global Image
// import { Image as BootstrapImage } from "react-bootstrap";

// Simula la obtención de datos del usuario y del carrito
interface UserInfo {
  email: string;
  nombre: string;
  id: number; // Asegúrate de que el ID del usuario esté aquí
}

interface PedidoItem {
  id: number; // Este debe ser el ID del producto
  nombre: string;
  precio: number; // Este debe ser el precio final del producto
  cantidad: number;
  imagen_url: string;
  precio_original?: number; // Este puede ser el precio original del producto
}

const LOCATION_STORAGE_KEY = "selectedUserLocation";
const DEFAULT_LOCATION_TEXT = "¿Dónde quieres pedir?";

const PedidoPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [pedidoItems, setPedidoItems] = useState<PedidoItem[]>([]);
  const [deliveryOption, setDeliveryOption] = useState<"delivery" | "retiro">(
    "delivery"
  );

  const [selectedLocationText, setSelectedLocationText] = useState(
    DEFAULT_LOCATION_TEXT
  );

  // ESTADOS PARA PAGO Y FACTURACIÓN
  const [paymentMethod, setPaymentMethod] = useState<string>("yape"); // 'card', 'mobile', 'yape'
  const [billingOption, setBillingOption] = useState<"boleta" | "factura">(
    "boleta"
  ); // 'boleta', 'factura'
  const [documentType, setDocumentType] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [billingAddress, setBillingAddress] = useState<string>("");
  const [razonSocial, setRazonSocial] = useState<string>("");

  const location = useLocation();

  useEffect(() => {
    // Lee el usuarioId del estado de navegación
    const navigatedUserId = location.state?.usuarioId;
    console.log(
      "Usuario ID recibido del estado de navegación:",
      navigatedUserId
    );

    // Determina el ID de usuario final: si viene de navegación, úsalo; si no, usa 1 por defecto.
    // Asegúrate de que el ID 1 exista en tu tabla de Usuarios para evitar errores de clave foránea.
    const finalUserId =
      navigatedUserId !== undefined && navigatedUserId !== null
        ? navigatedUserId
        : 1;

    setUserInfo({
      id: finalUserId,
      email: "pericianos37@gmail.com", // Esto podría ser dinámico también
      nombre: "Jean Pool Lozano Fernandez", // Esto podría ser dinámico también
    });

    if (location.state && location.state.cartItems) {
      console.log(
        "Datos brutos de cartItems desde location.state:",
        location.state.cartItems
      );

      // Mapea los cartItems a la estructura esperada por PedidoItem
      const mappedPedidoItems: PedidoItem[] = location.state.cartItems.map(
        (cartItem: any) => {
          // Asegura que 'nombre' siempre sea una cadena. Si cartItem.nombre es undefined/null, usa un fallback.
          const productName =
            typeof cartItem.nombre === "string" && cartItem.nombre.trim() !== ""
              ? cartItem.nombre
              : `Producto ID ${
                  cartItem.producto_id || "Desconocido"
                } (Nombre No Disponible)`;

          return {
            id: cartItem.producto_id, // Asume que 'producto_id' es el ID del producto real
            nombre: productName,
            precio: cartItem.precio_descuento || cartItem.precio, // Usa precio_descuento si existe, sino precio
            cantidad: cartItem.cantidad,
            imagen_url:
              cartItem.imagen_url ||
              "https://placehold.co/50x50/cccccc/ffffff?text=NoImg", // Proporciona una imagen por defecto
            precio_original: cartItem.precio || undefined, // Asume que 'precio' es el original, o undefined
          };
        }
      );
      setPedidoItems(mappedPedidoItems);
      console.log(
        "PedidoItems cargados y mapeados para el envío:",
        mappedPedidoItems
      );
    } else {
      console.warn(
        "No se encontraron ítems del carrito en el estado de navegación. Considera cargar el carrito desde la API si el usuario llega directamente a esta página."
      );
      // Opcional: Para pruebas, puedes inicializar pedidoItems aquí si no vienen del estado de navegación
      // Esto asegura que siempre haya datos para probar el envío del formulario.
      setPedidoItems([
        {
          id: 101,
          nombre:
            "Vapeador Electronico Geekbar Meloso Mini Blueberry Ice 1500 Puff 1 und",
          precio: 32.0,
          cantidad: 1,
          imagen_url: "https://placehold.co/50x50/aabbcc/ffffff?text=Vape",
          precio_original: 35.0,
        },
        {
          id: 102,
          nombre:
            "Vapeador Electronico Geekbar Meloso Mini Peach Berry 1500 Puff 1 und",
          precio: 24.9,
          cantidad: 2,
          imagen_url: "https://placehold.co/50x50/ccbbaa/ffffff?text=Vape",
          precio_original: 28.0,
        },
      ]);
    }

    const storedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (storedLocation) {
      setSelectedLocationText(storedLocation);
    }
  }, [location.state]); // Dependencia en location.state para re-evaluar si cambia

  const handleLocationSelected = (locationText: string) => {
    setSelectedLocationText(locationText);
    localStorage.setItem(LOCATION_STORAGE_KEY, locationText);
  };

  // Cálculo de totales
  let totalProductos = 0;
  let descuentos = 0;

  pedidoItems.forEach((item) => {
    totalProductos += item.precio * item.cantidad;
    if (item.precio_original && item.precio_original > item.precio) {
      descuentos += (item.precio_original - item.precio) * item.cantidad;
    }
  });

  const subtotal = totalProductos - descuentos;
  const costoEnvio = deliveryOption === "delivery" ? 5.0 : 0;
  const totalAPagar = subtotal + costoEnvio;

  // Función para manejar el pago: ahora utiliza la función del servicio
  const handlePagarAhora = async () => {
    console.log("Iniciando handlePagarAhora...");
    console.log("Estado actual de pedidoItems ANTES DE ENVIAR:", pedidoItems); // Log adicional

    // Validaciones básicas antes de enviar
    if (
      !selectedLocationText ||
      selectedLocationText === DEFAULT_LOCATION_TEXT
    ) {
      alert("Por favor, selecciona una dirección o local para continuar.");
      return;
    }
    if (pedidoItems.length === 0) {
      alert("Tu carrito está vacío. No se puede procesar el pedido.");
      return;
    }
    if (billingOption === "factura") {
      if (!billingAddress || !documentNumber || !razonSocial) {
        alert(
          "Por favor, completa todos los campos de facturación para la factura."
        );
        return;
      }
      if (documentType !== "RUC") {
        alert("Para factura, el tipo de documento debe ser RUC.");
        return;
      }
    }
    if (billingOption === "boleta") {
      if (!documentType || !documentNumber) {
        alert(
          "Por favor, selecciona el tipo y número de documento para la boleta."
        );
        return;
      }
    }

    if (!userInfo || userInfo.id === undefined || userInfo.id === null) {
      alert(
        "Error: No se pudo obtener la información del usuario. Por favor, inicia sesión."
      );
      return;
    }

    // Construir el objeto completo para enviar como JSON
    const orderDataToSend = {
      usuario_id: userInfo.id,
      total_productos: totalProductos,
      descuentos: descuentos,
      subtotal: subtotal,
      costo_envio: costoEnvio,
      total_a_pagar: totalAPagar,
      opcion_entrega: deliveryOption,
      ubicacion_seleccionada: selectedLocationText,
      metodo_pago: paymentMethod,
      tipo_comprobante: billingOption,
      pedido_items: pedidoItems, // pedidoItems ya es un array de objetos

      // Campos opcionales para facturación:
      // Se envían como null si están vacíos para coincidir con Optional[str] en FastAPI
      documentType: documentType === "" ? null : documentType,
      documentNumber: documentNumber === "" ? null : documentNumber,
      billingAddress: billingAddress === "" ? null : billingAddress,
      razonSocial: razonSocial === "" ? null : razonSocial,
    };

    console.log("Datos del pedido a enviar (JSON Body):", orderDataToSend);

    try {
      // Llama a la función del servicio para crear el pedido
      const result = await createOrder(orderDataToSend);

      console.log("Pedido procesado con éxito:", result);

      // En lugar de mostrar el modal, ahora se muestra una alerta simple de confirmación
      alert(`¡Pedido creado con éxito! ID del pedido: ${result.pedido_id}`);

      // Opcional: Redirigir al usuario o limpiar el carrito después de un pedido exitoso
      // history.push('/confirmacion', { orderId: result.pedido_id });
    } catch (error: any) {
      console.error("Error al pagar:", error);
      alert(`Error al procesar el pago: ${error.message}`);
    }
  };

  return (
    <div className="pedido-page">
      {/* Encabezado con Logo */}
      <div className="d-flex justify-content-center py-3 bg-light border-bottom">
        <LogoComponent /> {/* Usando el componente Logo */}
      </div>

      <Container className="my-4">
        <Row>
          {/* Columna Izquierda: Contacto, Entrega, Pago y Facturación */}
          <Col md={7}>
            {/* Tarjeta de Contacto */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h4 className="mb-3">Contacto</h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted small mb-1">
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        value={userInfo?.email || ""}
                        readOnly
                        className="fw-bold"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted small mb-1">
                        Nombre
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={userInfo?.nombre || ""}
                        readOnly
                        className="fw-bold"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Tarjeta de Entrega: Ahora el contenido del selector de ubicación se mostrará aquí */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h4 className="mb-3">Entrega</h4>
                {/* Muestra la ubicación seleccionada en la parte superior de la tarjeta */}
                <div className="d-flex align-items-center mb-3">
                  <span className="fw-bold fs-5 me-2">0 min</span>
                  <span className="fw-bold fs-5 me-2">
                    {selectedLocationText}
                  </span>
                  {/* El icono de lápiz ahora es solo indicativo o si lo deseas, 
                                            podría activar alguna edición de la dirección seleccionada */}
                  <BsPencilFill
                    className="text-muted"
                    style={{ cursor: "pointer" }}
                  />
                </div>

                <h5 className="mb-3">¿Cómo quieres tu pedido?</h5>
                <div className="d-flex mb-3">
                  <Button
                    className={`w-50 me-2 rounded-pill py-2 ${
                      deliveryOption === "delivery"
                        ? "btn-tambo-active"
                        : "btn-tambo-outline"
                    }`}
                    onClick={() => setDeliveryOption("delivery")}
                  >
                    Delivery
                  </Button>
                  <Button
                    className={`w-50 rounded-pill py-2 ${
                      deliveryOption === "retiro"
                        ? "btn-tambo-active"
                        : "btn-tambo-outline"
                    }`}
                    onClick={() => setDeliveryOption("retiro")}
                  >
                    Retiro
                  </Button>
                </div>

                {/* ¡Aquí se inserta el contenido del selector de ubicación! */}
                {/* Ya no es un modal, es parte de la tarjeta */}
                <UbicacionSelectorContent
                  onLocationSelected={handleLocationSelected}
                  deliveryOption={deliveryOption} // Le pasamos la opción de entrega actual
                />
              </Card.Body>
            </Card>

            {/* Nueva Tarjeta de Pago (MOVIMIENTO) */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h4 className="mb-3">Pago</h4>
                <h5 className="mb-3">Medios de pago</h5>
                <div className="mb-3">
                  <ListGroup variant="flush">
                    <ListGroup.Item
                      action
                      onClick={() => setPaymentMethod("card")}
                      className={`d-flex align-items-center px-3 py-2 ${
                        paymentMethod === "card" ? "border border-primary" : ""
                      }`}
                      style={{
                        borderColor: paymentMethod === "card" ? "#800080" : "",
                      }}
                    >
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                        alt="Visa"
                        style={{ height: "1.5em", marginRight: "5px" }}
                      />
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/2560px-MasterCard_Logo.svg.png"
                        alt="MasterCard"
                        style={{ height: "1.5em", marginRight: "5px" }}
                      />
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo.svg/2560px-American_Express_logo.svg.png"
                        alt="Amex"
                        style={{ height: "1.5em", marginRight: "5px" }}
                      />
                      Tarjeta de Crédito o Débito
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      onClick={() => setPaymentMethod("mobile")}
                      className={`d-flex align-items-center px-3 py-2 ${
                        paymentMethod === "mobile"
                          ? "border border-primary"
                          : ""
                      }`}
                      style={{
                        borderColor:
                          paymentMethod === "mobile" ? "#800080" : "",
                      }}
                    >
                      {/* Image of Mercado Pago */}
                      <Image
                        src="https://www.mercadopago.com/tools/app/logo/logo-square.svg"
                        alt="Mercado Pago"
                        style={{ height: "1.5em", marginRight: "5px" }}
                      />
                      Banca móvil, QR (Yape, Plin) y Agentes
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      onClick={() => setPaymentMethod("yape")}
                      className={`d-flex align-items-center px-3 py-2 ${
                        paymentMethod === "yape" ? "border border-primary" : ""
                      }`}
                      style={{
                        borderColor: paymentMethod === "yape" ? "#800080" : "",
                      }}
                    >
                      {/* Image of Yape */}
                      <Image
                        src="https://play-lh.googleusercontent.com/y3yL4pI3T9F3-F52t5B19d08uC5Jj5N1q1k1_2h3L5oF5L3o3a6L4x4f2F3s4G3g4g=s128"
                        alt="Yape"
                        style={{ height: "1.5em", marginRight: "5px" }}
                      />
                      Yape y otras billeteras
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              </Card.Body>
            </Card>

            {/* Nueva Tarjeta de Datos de Facturación (MOVIMIENTO) */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Datos de facturación</h4>
                  <span className="badge bg-danger rounded-pill px-3 py-2">
                    Requerido
                  </span>
                </div>

                <div className="d-flex mb-3">
                  <Button
                    className={`w-50 me-2 rounded-pill py-2 ${
                      billingOption === "boleta"
                        ? "btn-tambo-active"
                        : "btn-tambo-outline"
                    }`}
                    onClick={() => setBillingOption("boleta")}
                  >
                    Pago con boleta
                  </Button>
                  <Button
                    className={`w-50 rounded-pill py-2 ${
                      billingOption === "factura"
                        ? "btn-tambo-active"
                        : "btn-tambo-outline"
                    }`}
                    onClick={() => setBillingOption("factura")}
                  >
                    Pago con factura
                  </Button>
                </div>

                {/* Campos condicionales para Factura */}
                {billingOption === "factura" && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted">
                        Dirección
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Dirección de facturación"
                        className="rounded-pill"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted">
                        Tipo de documento de identidad
                      </Form.Label>
                      <Form.Select
                        className="rounded-pill"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                      >
                        {/* La única opción para factura será RUC */}
                        <option value="RUC">RUC</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted">
                        Número de documento de identidad
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Número de RUC"
                        className="rounded-pill"
                        value={documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted">
                        Nombre o Razón Social
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nombre o Razón Social"
                        className="rounded-pill"
                        value={razonSocial}
                        onChange={(e) => setRazonSocial(e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}

                {/* Campos para Boleta (se muestran si no es factura o si es boleta) */}
                {billingOption === "boleta" && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted">
                        Tipo de documento de identidad
                      </Form.Label>
                      <Form.Select
                        className="rounded-pill"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                      >
                        <option value="">Selecciona uno...</option>
                        <option value="DNI">DNI</option>
                        <option value="Pasaporte">Pasaporte</option>
                        {/* Puedes añadir más opciones si son válidas para boleta */}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted">
                        Número de documento de identidad
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Número de documento"
                        className="rounded-pill"
                        value={documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}
              </Card.Body>
            </Card>

            {/* Botón grande "Pagar ahora" (MOVIMIENTO y ESTILO) */}
            <Button
              variant="dark"
              size="lg"
              className="w-100 rounded-pill py-3 mb-4"
              style={{ backgroundColor: "#800080", borderColor: "#800080" }}
              onClick={handlePagarAhora} // Asigna la función al botón
            >
              Pagar ahora
            </Button>
          </Col>

          {/* Columna Derecha: Resumen del Pedido (sin cambios mayores) */}
          <Col md={5}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h4 className="mb-3">Tu Pedido</h4>
                {pedidoItems.length === 0 ? (
                  <p className="text-muted text-center">
                    No hay productos en tu pedido.
                  </p>
                ) : (
                  <ListGroup variant="flush" className="mb-3">
                    {pedidoItems.map((item) => (
                      <ListGroup.Item
                        key={item.id}
                        className="d-flex justify-content-between align-items-center px-0"
                      >
                        <span>
                          {item.cantidad} x {item.nombre}
                        </span>
                        <span className="fw-bold">
                          S/ {item.precio.toFixed(2)}
                        </span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}

                {/* Resumen de totales */}
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Productos</span>
                  <span>S/ {totalProductos.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Descuentos</span>
                  <span>- S/ {descuentos.toFixed(2)}</span>
                </div>
                {deliveryOption === "delivery" && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Costo de envío</span>
                    <span>S/ {costoEnvio.toFixed(2)}</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-4 mb-3">
                  <span>Total a pagar</span>
                  <span>S/ {totalAPagar.toFixed(2)}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal de Confirmación de Pedido (Eliminado) */}
      {/* <OrderConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        orderId={confirmedOrderId}
        orderData={confirmedOrderData}
      /> */}
    </div>
  );
};

export default PedidoPage;
