export const agregarAlCarrito = async (
  usuario_id: number,
  producto_id: number,
  cantidad: number
): Promise<void> => {
  const url = `http://localhost:5000/api/carrito/carrito/agregar?usuario_id=${usuario_id}&producto_id=${producto_id}&cantidad=${cantidad}`;

  const response = await fetch(url, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("No se pudo agregar el producto al carrito");
  }
};