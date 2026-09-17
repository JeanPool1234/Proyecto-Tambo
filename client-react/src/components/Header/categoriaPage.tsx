import Cabecera from "./Cabecera";
import Header from "./Navegacion/Header";
import ProductPage from "../Productos/ProductPage";
import { useParams } from "react-router-dom";

export default function CategoriaPage() {
  const { id } = useParams<{ id: string }>();

  // Verificamos si el ID existe y es un número válido
  const categoriaId = Number(id);

  return (
    <>
      <Cabecera />
      <Header />
      {/* Convertimos el id a número solo si es necesario */}
      <ProductPage cat={categoriaId} />
    </>
  );
}
