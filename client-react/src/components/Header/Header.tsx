import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import Logo from "./Logo";
import CategoriasMenu from "./CategoriasMenu";
import UbicacionButton from "./UbicacionButton";
import IconButtons from "./IconButtons";

const Header = () => {


  return (
    <>
      <Navbar bg="light" expand="lg" className="py-0 shadow-sm">
        <Container className="d-flex justify-content-between align-items-center px-4">
          <div className="d-flex align-items-center gap-4 py-2">
            <Logo />
            <CategoriasMenu />
            <UbicacionButton/>
          </div>

          <Nav className="d-flex align-items-center gap-3">
            <IconButtons />
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
