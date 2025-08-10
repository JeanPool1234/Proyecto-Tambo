// src/services/pedidoService.ts

// Define las interfaces para los datos que se enviarán y recibirán
interface PedidoItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen_url: string;
  precio_original?: number;
}

interface PedidoDataToSend {
  usuario_id: number;
  total_productos: number;
  descuentos: number;
  subtotal: number;
  costo_envio: number;
  total_a_pagar: number;
  opcion_entrega: "delivery" | "retiro";
  ubicacion_seleccionada: string;
  metodo_pago: string;
  tipo_comprobante: "boleta" | "factura";
  pedido_items: PedidoItem[];
  documentType: string | null;
  documentNumber: string | null;
  billingAddress: string | null;
  razonSocial: string | null;
}

interface PedidoCreationResponse {
  message: string;
  pedido_id: number;
}

/**
 * Función para crear un nuevo pedido enviando los datos a la API de FastAPI.
 * @param orderData Los datos del pedido a enviar.
 * @returns Una promesa que resuelve con la respuesta de la API o lanza un error.
 */
export const createOrder = async (orderData: PedidoDataToSend): Promise<PedidoCreationResponse> => {
  console.log("Enviando datos al servicio de pedidos:", orderData);

  try {
    const response = await fetch('http://localhost:5000/api/pedidos/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Importante: indicar que se envía JSON
      },
      body: JSON.stringify(orderData), // Convertir el objeto a cadena JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from backend (createOrder service):", errorData);
      throw new Error(errorData.detail ? JSON.stringify(errorData.detail) : errorData.error || 'Error al procesar el pedido en el backend.');
    }

    const result: PedidoCreationResponse = await response.json();
    console.log('Respuesta exitosa del servicio de pedidos:', result);
    return result;

  } catch (error: any) {
    console.error('Error en la función createOrder:', error);
    throw error; // Re-lanzar el error para que sea manejado por el componente que llama
  }
};
