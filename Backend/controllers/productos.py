from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from models.producto import Producto

router = APIRouter()

@router.get("/")
def listar_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).all()
    return [
        {
            "id": producto.id,
            "nombre": producto.nombre,
            "descripcion": producto.descripcion,
            "precio_descuento":producto.precio_descuento,
            "descuento": producto.descuento,
            "precio": producto.precio,
            "imagen_url": producto.imagen_url
        }
        for producto in productos
    ]
