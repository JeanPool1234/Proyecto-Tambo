// src/components/RecojoEnTienda.tsx

import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

// Datos estáticos
const ALL_LOCALES = [
  { id: 1, name: 'TAMBO 12DEOCTUBRE-SMP', address: 'Avenida 12 de Octubre 1611, Los Libertadores' },
  { id: 2, name: 'TAMBO 17DENOVIEMBRE-INDEPENDENCIA', address: '17 de Noviembre 498, A.h Independencia' },
  { id: 3, name: 'TAMBO 1DEMAYO-VES', address: 'Estudio Jurídico A & R, Coop Jose Maria' },
  { id: 4, name: 'TAMBO EL SOL - SJM', address: 'Av. Los Faisanes 123, San Juan de Miraflores' },
  { id: 5, name: 'TAMBO RAMBLA - BREÑA', address: 'Av. Brasil 700, Breña' },
];

interface RecojoEnTiendaProps {
  onLocationSelected: (locationText: string) => void;
  onHide: () => void;
}

export default function RecojoEnTienda({ onLocationSelected, onHide }: RecojoEnTiendaProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocal, setSelectedLocal] = useState<string | null>(null);

  // Filtrado directo (Más rápido y legible para listas pequeñas)
  const filteredLocales = ALL_LOCALES.filter(local => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return local.name.toLowerCase().includes(term) || local.address.toLowerCase().includes(term);
  });

  const handleConfirm = () => {
    if (selectedLocal) {
      onLocationSelected(selectedLocal);
      onHide();
    }
  };

  return (
    <>
      {/* Buscador */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar local..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus // UX: Pone el cursor aquí al abrir
        />
      </Form.Group>

      {/* Lista de Locales con Scroll */}
      <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
        {filteredLocales.length > 0 ? (
          filteredLocales.map((local) => {
            const isSelected = selectedLocal === local.name;
            return (
              <Button
                key={local.id}
                variant={isSelected ? "light" : "outline-light"} // Feedback visual simple
                onClick={() => setSelectedLocal(local.name)}
                className={`text-start p-3 border rounded-3 text-dark ${isSelected ? 'border-primary bg-light shadow-sm' : 'border-light-subtle'}`}
              >
                {/* h6 es mejor para móviles de 320px que h5 */}
                <h6 className={`mb-1 fw-bold ${isSelected ? 'text-primary' : ''}`}>
                  {local.name}
                </h6>
                <small className="text-muted d-block text-truncate">
                  {local.address}
                </small>
              </Button>
            );
          })
        ) : (
          <div className="text-center py-4 text-muted">
            <small>No encontramos locales con ese nombre.</small>
          </div>
        )}
      </div>

      {/* Botón Confirmar */}
      <div className="d-grid">
        <Button
          variant="danger"
          onClick={handleConfirm}
          className="py-2 fw-bold"
          disabled={!selectedLocal}
        >
          Confirmar Local
        </Button>
      </div>
    </>
  );
}