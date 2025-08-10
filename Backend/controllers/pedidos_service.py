# services/pedidos_service.py

from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import json
from datetime import datetime

# Importa tu configuración de base de datos
from database.database import get_db

# Importa tus modelos SQLAlchemy
from models.pedido import Pedido
# Si tienes otros modelos relacionados que necesitas validar o usar, impórtalos aquí
# from models.usuario import Usuario
# from models.producto import Producto

# Crea una instancia de APIRouter
router = APIRouter()

# Pydantic Modelos para la validación de los ítems del pedido
class PedidoItemBase(BaseModel):
    id: int
    nombre: str
    precio: float
    cantidad: int
    imagen_url: Optional[str] = None
    precio_original: Optional[float] = None

# Modelo Pydantic para la creación de un pedido completo
# Todos los campos del pedido, incluyendo la lista de ítems, estarán aquí.
class PedidoCreateRequest(BaseModel):
    usuario_id: int
    total_productos: float
    descuentos: float
    subtotal: float
    costo_envio: float
    total_a_pagar: float
    opcion_entrega: str
    ubicacion_seleccionada: str
    metodo_pago: str
    tipo_comprobante: str
    pedido_items: List[PedidoItemBase] # Lista de ítems del pedido
    
    # Campos opcionales para facturación
    documentType: Optional[str] = None
    documentNumber: Optional[str] = None
    billingAddress: Optional[str] = None
    razonSocial: Optional[str] = None

    class Config:
        orm_mode = True # Permite que Pydantic lea modelos de SQLAlchemy

# Endpoint para crear un nuevo pedido
@router.post('/api/pedidos/crear', status_code=status.HTTP_201_CREATED)
async def crear_pedido(
    pedido_data: PedidoCreateRequest = Body(..., description="Datos completos del pedido en formato JSON"),
    db: Session = Depends(get_db)
):
    """
    Crea un nuevo pedido en la base de datos.
    Todos los datos del pedido, incluyendo los ítems, se reciben como un único cuerpo JSON.
    """
    # --- INICIO DE DEPURACIÓN EN BACKEND ---
    print(f"Backend recibió pedido_data (parseado por Pydantic): {pedido_data.dict()}")
    print(f"Backend recibió usuario_id: {pedido_data.usuario_id}")
    print(f"Backend recibió tipo_comprobante: {pedido_data.tipo_comprobante}")
    print(f"Backend recibió pedido_items (parseado por Pydantic): {pedido_data.pedido_items}")
    # --- FIN DE DEPURACIÓN EN BACKEND ---

    try:
        # Pydantic ya ha validado y parseado pedido_items a una lista de objetos PedidoItemBase.
        # Ahora necesitamos convertirlo de nuevo a una cadena JSON para almacenarlo en la DB.
        items_pedido_json_string = json.dumps([item.dict() for item in pedido_data.pedido_items])

        # Inicializar variables para los datos de facturación condicionales
        documento_tipo_db = None
        documento_numero_db = None
        razon_social_db = None
        direccion_facturacion_db = None

        # Asignar los datos de facturación según el tipo de comprobante
        if pedido_data.tipo_comprobante == 'boleta':
            documento_tipo_db = pedido_data.documentType
            documento_numero_db = pedido_data.documentNumber
        elif pedido_data.tipo_comprobante == 'factura':
            documento_tipo_db = pedido_data.documentType # Para factura, se espera 'RUC'
            documento_numero_db = pedido_data.documentNumber # Para factura, se espera el número de RUC
            razon_social_db = pedido_data.razonSocial
            direccion_facturacion_db = pedido_data.billingAddress
            
        # Crear una nueva instancia del modelo Pedido de SQLAlchemy
        nuevo_pedido = Pedido(
            usuario_id=pedido_data.usuario_id,
            total_productos=pedido_data.total_productos,
            descuentos=pedido_data.descuentos,
            subtotal=pedido_data.subtotal,
            costo_envio=pedido_data.costo_envio,
            total_a_pagar=pedido_data.total_a_pagar,
            opcion_entrega=pedido_data.opcion_entrega,
            ubicacion_seleccionada=pedido_data.ubicacion_seleccionada,
            metodo_pago=pedido_data.metodo_pago, # ¡CORREGIDO AQUÍ!
            tipo_comprobante=pedido_data.tipo_comprobante,
            documento_tipo=documento_tipo_db,
            documento_numero=documento_numero_db,
            razon_social=razon_social_db,
            direccion_facturacion=direccion_facturacion_db,
            items_pedido_json=items_pedido_json_string, # Almacenar la cadena JSON generada
            fecha_pedido=datetime.utcnow() # La fecha se establece en UTC
        )

        # Añadir el nuevo pedido a la sesión de la base de datos
        db.add(nuevo_pedido)
        # Confirmar la transacción en la base de datos
        db.commit()
        # Refrescar el objeto para obtener el ID generado por la base de datos
        db.refresh(nuevo_pedido)

        # Devolver una respuesta exitosa con el ID del pedido
        return {"message": "Pedido creado con éxito", "pedido_id": nuevo_pedido.id}

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        db.rollback()
        print(f"Error al crear el pedido: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al crear el pedido: {e}")
