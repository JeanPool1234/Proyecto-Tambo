// src/components/DeliveryForm.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { BsGeoAlt } from "react-icons/bs";

interface Distrito {
  id: number;
  nombre: string;
}

interface DeliveryFormProps {
  onLocationSelected: (locationText: string) => void;
  onHide: () => void;
  // Prop para inicializar el distrito y la dirección si es necesario
  initialDistrito?: string;
  initialNuevaDireccion?: string;
  // Prop para resetear externamente (si se cambia de modo en el padre)
  onReset?: () => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({
  onLocationSelected,
  onHide,
  initialDistrito = "",
  initialNuevaDireccion = "",
  onReset,
}) => {
  const [distrito, setDistrito] = useState(initialDistrito);
  const [distritoRecommendations, setDistritoRecommendations] = useState<
    Distrito[]
  >([]);
  const [showDistritoRecommendations, setShowDistritoRecommendations] =
    useState(false);
  const [nuevaDireccion, setNuevaDireccion] = useState(initialNuevaDireccion);

  // Efecto para la búsqueda de distritos con debounce
  useEffect(() => {
    const fetchDistritos = async () => {
      const trimmedDistrito = distrito.trim();
      if (trimmedDistrito.length >= 2) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/buscarDistrito/api/distritos/buscar_similar?texto=${trimmedDistrito}`
          );

          if (!response.ok) {
            if (response.status !== 404) {
              console.error(`HTTP error! status: ${response.status}`);
            }
            setDistritoRecommendations([]);
          } else {
            const data: Distrito[] = await response.json();
            setDistritoRecommendations(data);
          }
          // Actualiza la visibilidad solo si hay texto y recomendaciones
          setShowDistritoRecommendations(
            trimmedDistrito.length >= 2 && distritoRecommendations.length > 0
          );
        } catch (error) {
          console.error("Error al buscar distritos:", error);
          setDistritoRecommendations([]);
          setShowDistritoRecommendations(false);
        }
      } else {
        // Limpiar y ocultar si el texto es muy corto o vacío
        setDistritoRecommendations([]);
        setShowDistritoRecommendations(false);
      }
    };

    const delayDebounceFn = setTimeout(fetchDistritos, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [distrito, distritoRecommendations.length]); // Incluir .length para asegurar re-evaluación de visibilidad

  // Callback para seleccionar una recomendación de distrito
  const handleSelectDistritoRecommendation = useCallback(
    (selectedDistritoNombre: string) => {
      setDistrito(selectedDistritoNombre);
      setShowDistritoRecommendations(false);
    },
    []
  );

  // Callback para confirmar la dirección de delivery
  const handleConfirmDelivery = useCallback(() => {
    if (distrito.trim() && nuevaDireccion.trim()) {
      onLocationSelected(`${nuevaDireccion}, ${distrito}`);
      onHide();
    } else {
      alert("Por favor, ingresa tanto el distrito como la dirección.");
    }
  }, [distrito, nuevaDireccion, onLocationSelected, onHide]);

  // Si el padre necesita resetear este formulario (ej. al cambiar de modo)
  useEffect(() => {
    if (onReset) {
      onReset();
      // Resetear estados internos del formulario de delivery
      setDistrito("");
      setNuevaDireccion("");
      setDistritoRecommendations([]);
      setShowDistritoRecommendations(false);
    }
  }, [onReset]);

  return (
    <>
      <Form>
        <Form.Group
          className="mb-3"
          controlId="formDistrito"
          style={{ position: "relative" }}
        >
          <Form.Label className="d-flex align-items-center gap-2">
            <BsGeoAlt /> Distrito
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej: Chachapoyas"
            value={distrito}
            onChange={(e) => setDistrito(e.target.value)}
            onFocus={() => {
              if (
                distrito.trim().length >= 2 &&
                distritoRecommendations.length > 0
              ) {
                setShowDistritoRecommendations(true);
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                setShowDistritoRecommendations(false);
              }, 200);
            }}
          />
          {showDistritoRecommendations &&
            distritoRecommendations.length > 0 && (
              <ListGroup
                style={{
                  position: "absolute",
                  width: "100%",
                  zIndex: 1000,
                  maxHeight: "150px",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  borderRadius: "0 0 .25rem .25rem",
                  boxShadow: "0 2px 5px rgba(0,0,0,.1)",
                }}
              >
                {distritoRecommendations.map((d) => (
                  <ListGroup.Item
                    key={d.id}
                    action
                    onClick={() => handleSelectDistritoRecommendation(d.nombre)}
                  >
                    {d.nombre}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formNuevaDireccion">
          <Form.Label className="d-flex align-items-center gap-2">
            <BsGeoAlt /> Ingresa una nueva dirección
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Buscar dirección..."
            value={nuevaDireccion}
            onChange={(e) => setNuevaDireccion(e.target.value)}
          />
        </Form.Group>
      </Form>

      <div className="d-grid gap-2">
        <Button
          variant="danger"
          onClick={handleConfirmDelivery}
          className="py-2"
          disabled={!distrito.trim() || !nuevaDireccion.trim()}
        >
          Confirmar Dirección
        </Button>
        <Button variant="outline-secondary" onClick={onHide} className="py-2">
          Cerrar
        </Button>
      </div>
    </>
  );
};

export default DeliveryForm;
