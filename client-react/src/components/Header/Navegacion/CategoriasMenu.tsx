import { useState, useEffect } from "react";
import { Dropdown, Spinner } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import type { Categoria } from "../../../types";

// Tip: Idealmente mueve esto a tu .env
const API_URL = "http://127.0.0.1:8000/api/categorias/categorias/listar";

export default function CategoriasMenu() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Booleano es suficiente aquí

  useEffect(() => {
    // AbortController para evitar errores si el usuario cierra el componente rápido
    const controller = new AbortController();

    const fetchCategorias = async () => {
      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setCategorias(data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error categorías:", err);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
    return () => controller.abort();
  }, []);

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="outline-light"
        className="text-danger border rounded px-3 py-1 d-flex align-items-center gap-2"
        // Quitamos bsPrefix para asegurar que se vea bien con Bootstrap base
      >
        <GiHamburgerMenu />
        <span className="small fw-bold">Categorías</span>
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="shadow-sm border-0"
        // OPTIMIZACIÓN MÓVIL: Esto evita que el menú sea infinito en pantallas chicas
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        {loading && (
          <Dropdown.Item disabled className="small">
            <Spinner animation="border" size="sm" className="me-2" />
            Cargando...
          </Dropdown.Item>
        )}

        {error && (
          <Dropdown.Item disabled className="text-danger small">
            Error al cargar
          </Dropdown.Item>
        )}

        {!loading && !error && categorias.length === 0 && (
          <Dropdown.Item disabled className="small">
            Sin resultados
          </Dropdown.Item>
        )}

        {!loading &&
          !error &&
          categorias.map((cat) => (
            <Dropdown.Item
              key={cat.id}
              href={`/categoria/${cat.id}`} // Ojo: Esto recarga la página. Si usas React Router, cámbialo por 'as={Link} to={...}'
              className="small py-2 border-bottom"
            >
              {cat.nombre}
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
