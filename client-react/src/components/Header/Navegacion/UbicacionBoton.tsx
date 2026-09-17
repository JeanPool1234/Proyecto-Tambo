// src/components/Header/UbicacionButton.tsx

import { useState } from "react";
import { Button } from "react-bootstrap";
import { BsGeoAlt } from "react-icons/bs";
import UbicacionModal from "./Ubicacion/UbicacionModal";

const LOCATION_STORAGE_KEY = "selectedUserLocation";
const DEFAULT_LOCATION_TEXT = "¿Dónde quieres pedir?";

export default function UbicacionButton() {
  const [showModal, setShowModal] = useState(false);

  // OPTIMIZACIÓN 1: Lazy Initialization
  // En lugar de usar useEffect, leemos el localStorage solo una vez al iniciar.
  // Si existe valor lo usa, si no, usa el default.
  const [locationText, setLocationText] = useState(() => {
    return localStorage.getItem(LOCATION_STORAGE_KEY) || DEFAULT_LOCATION_TEXT;
  });

  const handleLocationSelected = (text: string) => {
    setLocationText(text);
    localStorage.setItem(LOCATION_STORAGE_KEY, text);
    setShowModal(false);
  };

  return (
    <>
      <Button
        variant="outline-light"
        onClick={() => setShowModal(true)}
        className="d-inline-flex align-items-center gap-2 px-3 py-1 border rounded text-danger"
        title={locationText}
        style={{ maxWidth: "100%" }}
      >
        <BsGeoAlt className="flex-shrink-0" />

        <span
          className="small text-truncate"
          // Mantenemos el maxWidth de 140px para que no rompa en pantallas de 320px
          style={{ maxWidth: "140px" }}
        >
          {locationText}
        </span>
      </Button>

      <UbicacionModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onLocationSelected={handleLocationSelected}
      />
    </>
  );
}
