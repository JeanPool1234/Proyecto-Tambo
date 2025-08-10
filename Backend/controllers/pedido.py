from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.carrito import Carrito
from models.usuario import Usuario
from models.producto import Producto

router = APIRouter()

@router.post("/realizar-pedido/{usuario_id}")
def realizar_pedido(usuario_id: int, db: Session = Depends(get_db)):
    # 1. Obtener productos del carrito del usuario
    productos_carrito = db.query(Carrito).filter(Carrito.usuario_id == usuario_id).all()

    # 2. Si no hay productos en el carrito, lanzar error
    if not productos_carrito:
        return {"message": "Carrito sin productos"}

    # 3. Aquí podrías guardar los productos como pedido en una tabla de pedidos (opcional)
    detalles_pedido = []
    for item in productos_carrito:
        detalles_pedido.append({
            "producto_id": item.producto_id,
            "precio": item.precio,
            "cantidad": item.cantidad,
        })

    # 4. Vaciar el carrito
    for item in productos_carrito:
        db.delete(item)
    db.commit()

    return {
        "message": "Pedido realizado exitosamente",
        "detalle": detalles_pedido
    }