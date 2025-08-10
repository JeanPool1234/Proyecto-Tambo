import React, { useState, useEffect } from "react";
import { Dropdown, Spinner, Alert } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import type { Categoria } from "../../types";

// ------------------------------------

const CategoriasMenu = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]); // Usa la interfaz Categoria
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        setError(null);
        // La URL de tu servicio de categorías
        const response = await fetch(
          "http://localhost:5000/api/categorias/categorias/listar"
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        // Casting a Categoria[] porque tu servicio devuelve una lista de ellas
        const data: Categoria[] = await response.json();
        setCategorias(data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        setError("No se pudieron cargar las categorías.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="outline-light"
        className="text-danger border rounded px-3 py-1 d-flex align-items-center gap-2"
        bsPrefix="custom-toggle"
      >
        <GiHamburgerMenu />
        <span className="small">Categorías</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {loading && (
          <Dropdown.Item disabled>
            <Spinner animation="border" size="sm" className="me-2" />
            Cargando categorías...
          </Dropdown.Item>
        )}
        {error && (
          <Dropdown.Item disabled className="text-danger">
            <Alert variant="danger" className="p-1 mb-0">
              {error}
            </Alert>
          </Dropdown.Item>
        )}

        {!loading && !error && categorias.length === 0 && (
          <Dropdown.Item disabled>No hay categorías disponibles.</Dropdown.Item>
        )}

        {!loading &&
          !error &&
          categorias.length > 0 &&
          categorias.map((categoria) => (
            // Como tu API devuelve una lista plana, todos serán Dropdown.Item simples.
            // El href es solo un ejemplo, puedes adaptarlo a tu lógica de enrutamiento de categorías.
            <Dropdown.Item
              key={categoria.id}
              href={`/categoria/${categoria.id}`}
            >
              {categoria.nombre}
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CategoriasMenu;
