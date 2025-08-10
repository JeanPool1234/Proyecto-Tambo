// src/components/Header/UbicacionButton.tsx

import React, { useState, useEffect } from "react"; // Necesita useEffect para la lectura inicial
import { Button } from "react-bootstrap";
import { BsGeoAlt } from "react-icons/bs";
import UbicacionModal from "./UbicacionModal";

// Constante para la clave de localStorage y el texto por defecto
const LOCATION_STORAGE_KEY = 'selectedUserLocation';
const DEFAULT_LOCATION_TEXT = "¿Dónde quieres pedir?";

interface UbicacionButtonProps {
  // No necesita props adicionales para este comportamiento
}

const UbicacionButton: React.FC<UbicacionButtonProps> = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocationText, setSelectedLocationText] = useState(DEFAULT_LOCATION_TEXT);

  // useEffect para leer de localStorage al montar el componente
  useEffect(() => {
    const storedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (storedLocation) {
      setSelectedLocationText(storedLocation); // Usa la ubicación guardada
    }
  }, []); // El array vacío asegura que esto se ejecute solo una vez al montar

  const handleShowLocationModal = () => setShowLocationModal(true);
  const handleCloseLocationModal = () => setShowLocationModal(false);

  const handleLocationSelected = (locationText: string) => {
    setSelectedLocationText(locationText); // Actualiza el texto en el botón
    localStorage.setItem(LOCATION_STORAGE_KEY, locationText); // ¡Guarda en localStorage!
    handleCloseLocationModal(); // Cierra el modal
  };

  return (
    <>
      <Button
        variant="outline-light"
        className="border rounded text-danger px-3 py-1 d-flex align-items-center gap-2"
        onClick={handleShowLocationModal}
      >
        <BsGeoAlt />
        <span className="small">{selectedLocationText}</span>
      </Button>

      {/* Renderiza el UbicacionModal dentro de UbicacionButton */}
      <UbicacionModal
        show={showLocationModal}
        onHide={handleCloseLocationModal}
        onLocationSelected={handleLocationSelected}
      />
    </>
  );
};

export default UbicacionButton;