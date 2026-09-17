import { Navbar, Container, Nav } from "react-bootstrap";
import Logo from "./Logo";
import CategoriasMenu from "./CategoriasMenu";
import UbicacionBoton from "./UbicacionBoton";
import IconBotones from "./IconBotones";

const Header = () => (
  // 1. CLAVE: expand="xl"
  // Esto dice: "Mantén el menú hamburguesa en 320px y 768px.
  // Solo expándete (muestra todo horizontal) cuando llegues a pantallas grandes (1200px+), cubriendo tu meta de 1440px."
  <Navbar bg="light" expand="xl" className="py-2 shadow-sm sticky-top">
    {/* Usamos fluid para aprovechar el ancho, pero con padding controlado */}
    <Container fluid className="px-3 px-md-4 px-xxl-5">
      {/* 2. LOGO Y TOGGLE */}
      {/* En 320px, el logo y el botón de menú deben caber en una sola línea */}
      <div className="d-flex justify-content-between align-items-center w-100 w-xl-auto">
        <Logo />
        {/* El botón de las 3 rayitas solo aparece en móvil/tablet */}
        <Navbar.Toggle aria-controls="navbar-tambo" />
      </div>

      {/* 3. CONTENIDO COLAPSABLE (Para 320px y 768px) */}
      <Navbar.Collapse id="navbar-tambo">
        {/* Contenedor Flex que cambia de dirección según el tamaño */}
        <div className="d-flex flex-column flex-xl-row align-items-center w-100 mt-3 mt-xl-0 gap-3 gap-xl-5">
          {/* Bloque Central: Categorías y Ubicación */}
          {/* En 320px (xs) y 768px (md): Se apilan verticalmente y ocupan el 100% de ancho */}
          {/* En 1440px (xl): Se ponen en fila y se centran */}
          <Nav className="d-flex flex-column flex-xl-row align-items-center justify-content-center flex-grow-1 gap-3 w-100 w-xl-auto">
            <div className="w-100 w-xl-auto text-center">
              <CategoriasMenu />
            </div>
            <div className="w-100 w-xl-auto text-center">
              <UbicacionBoton />
            </div>
          </Nav>

          {/* Bloque Iconos */}
          {/* En móvil/tablet los ponemos dentro del menú para que no estorben arriba */}
          <Nav className="d-flex justify-content-center align-items-center gap-3 py-3 py-xl-0 border-top border-xl-0 w-100 w-xl-auto">
            <IconBotones />
          </Nav>
        </div>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default Header;
