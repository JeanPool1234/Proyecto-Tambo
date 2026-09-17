// src/components/DeliveryForm.tsx

import { useState, useEffect } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { BsGeoAlt } from "react-icons/bs";

// Tip: Mueve esto a tu archivo .env -> VITE_API_URL
const API_URL = "http://localhost:5000/api/distritos/buscar_similar"; 

interface Distrito {
  id: number;
  nombre: string;
}

interface DeliveryFormProps {
  onLocationSelected: (locationText: string) => void;
  onHide: () => void;
  initialDistrito?: string;
  initialNuevaDireccion?: string;
}

export default function DeliveryForm({
  onLocationSelected,
  onHide,
  initialDistrito = "",
  initialNuevaDireccion = "",
}: DeliveryFormProps) {
  const [distrito, setDistrito] = useState(initialDistrito);
  const [nuevaDireccion, setNuevaDireccion] = useState(initialNuevaDireccion);
  
  // Estado para las sugerencias
  const [suggestions, setSuggestions] = useState<Distrito[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Lógica de Búsqueda de Distritos (con Debounce y AbortController)
  useEffect(() => {
    const trimmedDistrito = distrito.trim();
    
    // Si borró el texto, limpiamos y salimos
    if (trimmedDistrito.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const controller = new AbortController(); // Para cancelar peticiones viejas
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}?texto=${trimmedDistrito}`, {
          signal: controller.signal,
        });

        if (response.ok) {
          const data: Distrito[] = await response.json();
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        } else {
          setSuggestions([]);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Error buscando distritos:", error);
          setSuggestions([]);
        }
      }
    }, 400); // 400ms de espera es suficiente

    // Cleanup: Se ejecuta si el usuario escribe otra letra antes de los 400ms
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [distrito]);

  const handleSelectSuggestion = (nombre: string) => {
    setDistrito(nombre);
    setShowSuggestions(false);
  };

  const handleConfirm = () => {
    if (!distrito.trim() || !nuevaDireccion.trim()) return;
    onLocationSelected(`${nuevaDireccion}, ${distrito}`);
    onHide();
  };

  return (
    <>
      <Form>
        {/* Input Distrito con Autocomplete */}
        <Form.Group className="mb-3 position-relative" controlId="formDistrito">
          <Form.Label className="d-flex align-items-center gap-2 fw-bold small">
            <BsGeoAlt /> Distrito
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej: Miraflores"
            value={distrito}
            onChange={(e) => setDistrito(e.target.value)}
            onFocus={() => distrito.length >= 2 && setShowSuggestions(true)}
            // El timeout permite que el click en la lista ocurra antes de que desaparezca
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            autoComplete="off"
          />

          {/* Lista Flotante de Sugerencias */}
          {showSuggestions && suggestions.length > 0 && (
            <ListGroup className="position-absolute w-100 shadow-sm" style={{ zIndex: 1050, maxHeight: "200px", overflowY: "auto" }}>
              {suggestions.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  action
                  onClick={() => handleSelectSuggestion(item.nombre)}
                  className="border-0 border-bottom"
                >
                  {item.nombre}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>

        {/* Input Dirección */}
        <Form.Group className="mb-4" controlId="formNuevaDireccion">
          <Form.Label className="d-flex align-items-center gap-2 fw-bold small">
            <BsGeoAlt /> Dirección Exacta
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej: Av. Larco 123, Dpto 401"
            value={nuevaDireccion}
            onChange={(e) => setNuevaDireccion(e.target.value)}
          />
        </Form.Group>
      </Form>

      {/* Botones de Acción */}
      <div className="d-grid gap-2">
        <Button
          variant="danger"
          onClick={handleConfirm}
          className="py-2 fw-bold"
          disabled={!distrito.trim() || !nuevaDireccion.trim()}
        >
          Confirmar Dirección
        </Button>
        <Button variant="outline-secondary" onClick={onHide} className="py-2">
          Cancelar
        </Button>
      </div>
    </>
  );
}