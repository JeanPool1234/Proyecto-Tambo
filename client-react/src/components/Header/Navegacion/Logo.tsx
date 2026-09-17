// src/components/Logo.tsx
import { Navbar } from "react-bootstrap";

const Logo = () => (
  <Navbar.Brand href="/" className="py-0 me-0">
    <img
      // ✅ AHORA SÍ funciona la ruta relativa gracias al Proxy
      src="/static/logos/tambo.webp" 
      alt="Tambo"
      className="d-inline-block align-top"
      style={{ 
        height: 'clamp(35px, 5vw, 48px)',
        width: 'auto' 
      }}
    />
  </Navbar.Brand>
);

export default Logo;
