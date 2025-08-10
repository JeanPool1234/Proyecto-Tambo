// src/components/RecojoEnTienda.tsx

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

// Datos estáticos: se definen una sola vez fuera del componente
const ALL_LOCALES = [
  { id: 1, name: 'TAMBO 12DEOCTUBRE-SMP', address: 'Avenida 12 de Octubre 1611, Los Libertadores' },
  { id: 2, name: 'TAMBO 17DENOVIEMBRE-INDEPENDENCIA', address: '17 de Noviembre 498, A.h Independencia' },
  { id: 3, name: 'TAMBO 1DEMAYO-VES', address: 'Estudio Jurídico A & R, Coop Jose Maria' },
  { id: 4, name: 'TAMBO EL SOL - SJM', address: 'Av. Los Faisanes 123, San Juan de Miraflores' },
  { id: 5, name: 'TAMBO RAMBLA - BREÑA', address: 'Av. Brasil 700, Breña' },
];

// Renombrar la interfaz de props
interface RecojoEnTiendaProps {
  onLocationSelected: (locationText: string) => void;
  onHide: () => void;
  // Prop para inicializar el local seleccionado si es necesario
  initialSelectedLocal?: string | null;
  // Prop para resetear externamente (si se cambia de modo en el padre)
  onReset?: () => void;
}

// Renombrar el componente
const RecojoEnTienda: React.FC<RecojoEnTiendaProps> = ({ onLocationSelected, onHide, initialSelectedLocal = null, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocal, setSelectedLocal] = useState<string | null>(initialSelectedLocal);

  // Memoriza los locales filtrados
  const filteredLocales = useMemo(() => {
    if (!searchTerm) {
      return ALL_LOCALES;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return ALL_LOCALES.filter(local =>
      local.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      local.address.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm]);

  // Callback para confirmar el local de retiro
  const handleConfirmLocal = useCallback(() => {
    if (selectedLocal) {
      onLocationSelected(selectedLocal);
      onHide();
    } else {
      alert('Por favor, selecciona un local para retiro.');
    }
  }, [selectedLocal, onLocationSelected, onHide]);

  // Si el padre necesita resetear este formulario (ej. al cambiar de modo)
  useEffect(() => {
    if (onReset) {
      onReset();
      // Resetear estados internos del formulario de recojo en tienda
      setSearchTerm('');
      setSelectedLocal(null);
    }
  }, [onReset]);

  return (
    <>
      <Form.Group className="mb-3" controlId="formBuscarLocal">
        <Form.Control
          type="text"
          placeholder="Buscar local por nombre o dirección"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      <div className="list-group list-group-flush mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {filteredLocales.length > 0 ? (
          filteredLocales.map((local) => (
            <Button
              key={local.id}
              variant="light"
              className={`list-group-item list-group-item-action text-start mb-2 border rounded-3 p-3
                          ${selectedLocal === local.name ? 'active-local-selection' : ''}`}
              onClick={() => setSelectedLocal(local.name)}
            >
              <h5 className="mb-1">{local.name}</h5>
              <p className="mb-1 text-muted">{local.address}</p>
            </Button>
          ))
        ) : (
          <p className="text-center text-muted mt-3">No se encontraron locales.</p>
        )}
      </div>

      <div className="d-grid gap-2 mt-3">
        <Button
          variant="danger"
          onClick={handleConfirmLocal}
          className="py-2 custom-purple-bg mb-2"
          disabled={!selectedLocal}
        >
          Confirmar Local
        </Button>
             </div>
    </>
  );
};

export default RecojoEnTienda;