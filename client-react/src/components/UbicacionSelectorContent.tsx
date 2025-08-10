// src/components/UbicacionSelectorContent.tsx
import React, { useState, useEffect } from 'react';
import { Form, ListGroup, Button } from 'react-bootstrap';
import { BsGeoAlt, BsPinMapFill } from 'react-icons/bs';

interface UbicacionData {
  id: number;
  nombre: string;
  direccion: string;
}

interface UbicacionSelectorContentProps {
  onLocationSelected: (locationText: string) => void;
  deliveryOption: 'delivery' | 'retiro';
}

const UbicacionSelectorContent: React.FC<UbicacionSelectorContentProps> = ({ onLocationSelected, deliveryOption }) => {
  const [distrito, setDistrito] = useState('');
  const [direccionManual, setDireccionManual] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<UbicacionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Datos simulados de locales/direcciones
  const allLocations: UbicacionData[] = [
    { id: 1, nombre: 'TAMBO 12OCTUBRE-SMP', direccion: 'Avenida 12 de Octubre 1611, Los Libertadores' },
    { id: 2, nombre: 'TAMBO 17NOVIEMBRE-INDEPENDENCIA', direccion: '17 de Noviembre 498, A.h Independencia' },
    { id: 3, nombre: 'TAMBO 1DEMAYO-VES', direccion: 'Estudio Julio A & R, Coop. Jose Maria Arguedas' },
    { id: 4, nombre: 'TAMBO 28DEJULIO-CERCADO DE LIMA', direccion: 'Avenida 28 de Julio 1000, Lima' },
    { id: 5, nombre: 'TAMBO LOS OLIVOS', direccion: 'Av. Las Palmeras 123, Los Olivos' },
    { id: 6, nombre: 'TAMBO MIRAFLORES', direccion: 'Calle Schell 456, Miraflores' },
    { id: 7, nombre: 'Casa de Juan', direccion: 'Av. Siempre Viva 742, Springfield' },
    { id: 8, nombre: 'TAMBO SURCO', direccion: 'Av. Aviacion 5000, Surco' },
    { id: 9, nombre: 'TAMBO BARRANCO', direccion: 'Jiron Union 100, Barranco' },
    { id: 10, nombre: 'TAMBO LA MOLINA', direccion: 'Av. La Molina 200, La Molina' },
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);

    const filterLocations = () => {
      let searchTerm = '';
      if (deliveryOption === 'delivery') {
        searchTerm = `${distrito} ${direccionManual}`.trim();
      } else { // 'retiro'
        searchTerm = searchQuery.trim();
      }

      let filtered = allLocations.filter(loc => {
        const locInfo = `${loc.nombre} ${loc.direccion}`.toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();

        const matchesSearch = searchTermLower ? locInfo.includes(searchTermLower) : true; 

        if (deliveryOption === 'retiro') {
          return matchesSearch && loc.nombre.startsWith('TAMBO');
        } else {
          return matchesSearch && !loc.nombre.startsWith('TAMBO'); 
        }
      });
      return filtered;
    };

    // Lógica para manejar el delay o la inmediatez
    if (deliveryOption === 'retiro' && !searchQuery) {
        // En modo "Retiro" y sin búsqueda, mostrar la lista de inmediato
        // Asume que los 'allLocations' ya están cargados o son estáticos.
        const filtered = filterLocations();
        setLocations(filtered);
        setLoading(false);
    } else if (deliveryOption === 'delivery' && !distrito && !direccionManual && !searchQuery) {
        // En modo "Delivery" y sin búsqueda, limpiar la lista de inmediato
        setLocations([]);
        setLoading(false);
    } else {
        // Para cualquier otra búsqueda activa, simular un delay de API
        setTimeout(() => {
            const filtered = filterLocations();
            setLocations(filtered);
            setLoading(false);
        }, 300); // Mantiene el delay para búsquedas activas
    }

  }, [distrito, direccionManual, searchQuery, deliveryOption]); // Dependencias del useEffect

  const handleSelectLocation = (location: UbicacionData) => {
    const locationText = deliveryOption === 'delivery' ? location.direccion : `${location.nombre} - ${location.direccion}`;
    onLocationSelected(locationText);
    setDistrito('');
    setDireccionManual('');
    setSearchQuery('');
  };

  // Determinar si la lista de ubicaciones debe mostrarse
  const showLocationsList = (
    !loading && 
    locations.length > 0 && 
    (
      deliveryOption === 'retiro' || // Siempre mostrar en modo retiro si hay resultados
      (deliveryOption === 'delivery' && (distrito || direccionManual || searchQuery)) // Solo mostrar en delivery si hay algo escrito
    )
  );

  return (
    <div>
      {/* Campos de entrada para "Delivery" */}
      {deliveryOption === 'delivery' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label className="small text-muted">Distrito</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Chachapoyas"
              value={distrito}
              onChange={(e) => setDistrito(e.target.value)}
              className="rounded-pill"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small text-muted d-flex align-items-center">
              <BsPinMapFill className="me-2" /> Ingresa una nueva dirección
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar dirección..."
              value={direccionManual}
              onChange={(e) => setDireccionManual(e.target.value)}
              className="rounded-pill"
            />
          </Form.Group>
        </>
      )}

      {/* Campo de búsqueda genérico para "Retiro" */}
      {deliveryOption === 'retiro' && (
        <Form.Group className="mb-3">
          <Form.Label className="small text-muted">Buscar local por nombre o dirección</Form.Label>
          <Form.Control
            type="text"
            placeholder="Buscar local por nombre o dirección"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-pill"
          />
        </Form.Group>
      )}

      {/* Mensajes de estado (cargando, error, sin resultados) */}
      {loading && <p className="text-center text-muted">Cargando ubicaciones...</p>}
      {error && <p className="text-center text-danger">{error}</p>}
      
      {/* Condición para mostrar "No se encontraron resultados" */}
      {!loading && locations.length === 0 && (distrito || direccionManual || searchQuery || deliveryOption === 'retiro') && (
         <p className="text-center text-muted">
            {deliveryOption === 'retiro' && !searchQuery ? 'No hay locales disponibles.' : 'No se encontraron resultados.'}
         </p>
      )}


      {showLocationsList && (
        <ListGroup variant="flush" className="border rounded" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {locations.map(loc => (
            <ListGroup.Item
              key={loc.id}
              action
              onClick={() => handleSelectLocation(loc)}
              className="py-3 px-3 d-flex flex-column align-items-start"
            >
              <h6 className="mb-1 fw-bold">{loc.nombre}</h6>
              <p className="text-muted mb-0 small">{loc.direccion}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      
      <div className="text-center mt-3">
        <Button variant="outline-primary" className="rounded-pill px-4 py-2">
          <BsGeoAlt className="me-2" /> Usar mi ubicación actual
        </Button>
      </div>
    </div>
  );
};

export default UbicacionSelectorContent;