// src/components/IconButtons.tsx

import React, { useState, useEffect } from "react";
import { Nav, Dropdown } from "react-bootstrap";
import { BsPerson, BsCart, BsSearch } from "react-icons/bs";
import LoginModal from "./LoginModal";
import BuscadorModal from "../Productos/BuscadorModal";
import CarritoLateral from '../Header/carritoLateral'; 
// Ya no necesitamos useCart si no mostramos el contador aquí
// import { useCart } from '../context/CartContext'; 

const IconButtons = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [showCarrito, setShowCarrito] = useState(false);
  const [showBuscador, setShowBuscador] = useState(false);
  
  // Eliminado: const { cartTotalQuantity, fetchCartTotalQuantity } = useCart(); 
  // Eliminado: const [cartTotalQuantity, setCartTotalQuantity] = useState(0); 

  const [showUserMenu, setShowUserMenu] = useState(false);

  // Eliminado: Función fetchCartTotalQuantity
  // Eliminado: useCallback para fetchCartTotalQuantity

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedToken = localStorage.getItem("token");

    if (storedUserId && storedToken) {
      const userId = parseInt(storedUserId, 10);
      setLoggedInUserId(userId);
      console.log(`Usuario ID ${storedUserId} restaurado desde localStorage.`);
      // Eliminado: fetchCartTotalQuantity(userId); 
    } else {
      setLoggedInUserId(1); 
      // Eliminado: fetchCartTotalQuantity(1); 
    }
  }, []); // Dependencias vacías, la lógica de carga inicial se mueve al contexto

  const handleShowLogin = () => setShowLogin(true);
  const handleHideLogin = () => setShowLogin(false);
  
  const handleLoginSuccess = (userId: number) => {
    setLoggedInUserId(userId);
    handleHideLogin();
    // Eliminado: fetchCartTotalQuantity(userId); 
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setLoggedInUserId(null); 
    setShowUserMenu(false); 
    // Eliminado: setCartTotalQuantity(0); 
    // Eliminado: fetchCartTotalQuantity(1); 
    console.log("Sesión cerrada. Datos de usuario eliminados de localStorage.");
  };

  const handleShowCarrito = () => setShowCarrito(true);
  const handleCloseCarrito = () => setShowCarrito(false);

  const userIdForOperations = loggedInUserId !== null ? loggedInUserId : 1;

  return (
    <>
      <Nav className="ms-auto align-items-center">
        {/* Botón de Buscar */}
        <Nav.Link onClick={() => setShowBuscador(true)}>
          <BsSearch size={20} />
        </Nav.Link>

        {/* --- Renderizado Condicional del Botón de Perfil --- */}
        {loggedInUserId ? (
          <Dropdown show={showUserMenu} onToggle={setShowUserMenu}>
            <Dropdown.Toggle as={Nav.Link} id="dropdown-user" onClick={() => setShowUserMenu(!showUserMenu)}>
              <BsPerson size={20} />
              <span className="ms-1">Hola!</span>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Nav.Link onClick={handleShowLogin}>
            <BsPerson size={20} />
            <span className="ms-1"></span>
          </Nav.Link>
        )}

        {/* Botón del Carrito */}
        <Nav.Link onClick={handleShowCarrito} className="position-relative">
          <BsCart size={20} />
          
        </Nav.Link>
      </Nav>

      {/* Modal de Buscador */}
      <BuscadorModal
        show={showBuscador}
        onHide={() => setShowBuscador(false)}
      />

      {/* Modal de Login (Solo se muestra si showLogin es true) */}
      <LoginModal
        show={showLogin}
        onHide={handleHideLogin}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Carrito Lateral */}
      <CarritoLateral
        usuarioId={userIdForOperations}
        show={showCarrito}
        handleClose={handleCloseCarrito}
        // Eliminado: onCartChange prop
      />
    </>
  );
};

export default IconButtons;

