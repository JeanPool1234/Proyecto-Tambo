import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Alert } from "react-bootstrap";

interface LoginRegisterModalProps {
  show: boolean;
  onHide: () => void;
  onLoginSuccess: (userId: number) => void;
}

const LoginRegisterModal: React.FC<LoginRegisterModalProps> = ({
  show,
  onHide,
  onLoginSuccess,
}) => {
  const [isRegister, setIsRegister] = useState(false);

  // Campos comunes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Solo para registro
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE = "http://localhost:5000/api/auth";

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await axios.post(`${API_BASE}/login`, formData);

      const { access_token, user_id } = res.data; 

      localStorage.setItem("token", access_token); // Almacena el token
      localStorage.setItem("user_id", user_id.toString()); // Almacena el user_id

      
      onLoginSuccess(user_id);

      setSuccess("Inicio de sesión exitoso.");
      setError("");
      onHide(); // Cierra el modal
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al iniciar sesión.");
      setSuccess("");
    }
  };

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("email", email);
      formData.append("telefono", telefono);
      formData.append("password", password);

      await axios.post(`${API_BASE}/register`, formData);

      setSuccess("Registro exitoso.");
      setError("");
      setIsRegister(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al registrar.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isRegister ? "Registrarse" : "Iniciar sesión"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form>
          {isRegister && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </Form.Group>
            </>
          )}

          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={() => setIsRegister(!isRegister)}>
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </Button>
        <Button
          onClick={isRegister ? handleRegister : handleLogin}
          variant="success"
        >
          {isRegister ? "Registrarme" : "Iniciar sesión"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginRegisterModal;
