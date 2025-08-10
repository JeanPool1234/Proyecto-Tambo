import React from "react";
import { Navbar} from "react-bootstrap";

const Logo = () => (
  <Navbar.Brand href="/" className="py-0">
    <img
      src="http://localhost:5000/static/logos/tambo.webp"
      alt="Tambo Logo"
      height="48"
      className="d-inline-block align-top"
    />
  </Navbar.Brand>
);

export default Logo;
