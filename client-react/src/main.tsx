import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx'
import CategoriaPage from "./components/Header/categoriaPage";
import PedidoPage from './pedidoPage.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/categoria/:id" element={<CategoriaPage />} />
        <Route path="/pedido" element={<PedidoPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
