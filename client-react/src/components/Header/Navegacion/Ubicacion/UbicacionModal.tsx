// src/components/UbicacionModal.tsx

import { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";

// Importar sub-componentes
import DeliveryForm from "./UbicacionModalComp/deliveryForm";
import RecojoEnTienda from "./UbicacionModalComp/recojoEnTienda";

interface UbicacionModalProps {
  show: boolean;
  onHide: () => void;
  onLocationSelected: (locationText: string) => void;
}

type OrderMode = "delivery" | "pickup";

export default function UbicacionModal({ show, onHide, onLocationSelected }: UbicacionModalProps) {
  const [selectedMode, setSelectedMode] = useState<OrderMode>("delivery");

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center h5">
          ¿Cómo quieres tu pedido?
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* 'g-2' reduce el espacio entre columnas para que quepan bien en 320px */}
        <Row className="mb-4 g-2">
          <Col xs={6}>
            <Button
              variant={selectedMode === "delivery" ? "danger" : "outline-secondary"}
              className={`w-100 py-2 ${selectedMode === "delivery" ? "custom-purple-bg" : ""}`}
              onClick={() => setSelectedMode("delivery")}
            >
              Delivery
            </Button>
          </Col>
          
          <Col xs={6}>
            <Button
              variant={selectedMode === "pickup" ? "danger" : "outline-secondary"}
              className={`w-100 py-2 ${selectedMode === "pickup" ? "custom-purple-bg" : ""}`}
              onClick={() => setSelectedMode("pickup")}
            >
              Recojo en Tienda
            </Button>
          </Col>
        </Row>

        {/* Renderizado Condicional Simplificado */}
        {selectedMode === "delivery" ? (
          <DeliveryForm
            onLocationSelected={onLocationSelected}
            onHide={onHide}
          />
        ) : (
          <RecojoEnTienda
            onLocationSelected={onLocationSelected}
            onHide={onHide}
          />
        )}
      </Modal.Body>
    </Modal>
  );
}