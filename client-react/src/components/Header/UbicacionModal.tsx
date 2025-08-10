// src/components/UbicacionModal.tsx

import React, { useState, useCallback } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

// Importar el nuevo sub-componente
import DeliveryForm from './UbicacionModalComp/deliveryForm';
import RecojoEnTienda from './UbicacionModalComp/recojoEnTienda'; // <--- CAMBIO AQUÍ

interface UbicacionModalProps {
  show: boolean;
  onHide: () => void;
  onLocationSelected: (locationText: string) => void;
}

type OrderMode = 'delivery' | 'pickup'; // Mantén 'pickup' para la lógica interna si es más fácil

const UbicacionModal: React.FC<UbicacionModalProps> = ({ show, onHide, onLocationSelected }) => {
  const [selectedMode, setSelectedMode] = useState<OrderMode>('delivery');

  // Estado para forzar un reseteo en los componentes hijos
  const [resetKey, setResetKey] = useState(0);

  // Función para manejar el clic en los botones de modo
  const handleModeChange = useCallback((mode: OrderMode) => {
    setSelectedMode(mode);
    setResetKey(prevKey => prevKey + 1); // Incrementa la clave para forzar un reseteo en el hijo
  }, []);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">¿Cómo quieres tu pedido?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
          <Col>
            <Button
              variant={selectedMode === 'delivery' ? 'danger' : 'outline-secondary'}
              className={`w-100 py-2 ${selectedMode === 'delivery' ? 'custom-purple-bg' : ''}`}
              onClick={() => handleModeChange('delivery')}
            >
              Delivery
            </Button>
          </Col>
          <Col>
            <Button
              variant={selectedMode === 'pickup' ? 'danger' : 'outline-secondary'}
              className={`w-100 py-2 ${selectedMode === 'pickup' ? 'custom-purple-bg' : ''}`}
              onClick={() => handleModeChange('pickup')}
            >
              Recojo en Tienda {/* <--- CAMBIO AQUÍ EN EL TEXTO DEL BOTÓN */}
            </Button>
          </Col>
        </Row>

        {selectedMode === 'delivery' && (
          <DeliveryForm
            key={`delivery-${resetKey}`}
            onLocationSelected={onLocationSelected}
            onHide={onHide}
          />
        )}

        {selectedMode === 'pickup' && ( // <--- MANTENEMOS 'pickup' INTERNAMENTE PARA COHERENCIA CON OrderMode
          <RecojoEnTienda // <--- CAMBIO AQUÍ
            key={`recojo-en-tienda-${resetKey}`} // Asegura una key única
            onLocationSelected={onLocationSelected}
            onHide={onHide}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UbicacionModal;