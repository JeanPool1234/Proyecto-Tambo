import TopBar from "../TopBar";
import Header from "../Header/Header";
import ProductPage from "../Productos/ProductPage";
import { useParams } from "react-router-dom";

export default function CategoriaPage() {
  const { id } = useParams<{ id: string }>();

  // Verificamos si el ID existe y es un número válido
  const categoriaId = Number(id)

  return (
    <>
      <TopBar />
      <Header />
      {/* Convertimos el id a número solo si es necesario */}
      <ProductPage cat={categoriaId} />
    </>
  );
}

