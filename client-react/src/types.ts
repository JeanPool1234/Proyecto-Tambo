export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_descuento: number;
  descuento: number;
  imagen_url: string;
  categoria: number;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface CarritoItem {
  id: number; // ID del ítem en el carrito
  nombre: string; // Nombre del producto
  imagen_url: string; // URL de la imagen del producto
  precio: number; // Precio actual del producto (por unidad)
  cantidad: number; // Cantidad de este producto en el carrito
  precio_original?: number;
}
