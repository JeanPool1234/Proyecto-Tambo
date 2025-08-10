from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.producto import Producto
from models.categoria import Categoria

router = APIRouter()

@router.get("/categoria/id/{categoria_id}")
def obtener_productos_por_categoria_id(categoria_id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    productos = db.query(Producto).filter(Producto.categoria_id == categoria_id).all()
    return [
        {
            "id": producto.id,
            "nombre": producto.nombre,
            "descripcion": producto.descripcion,
            "precio": producto.precio,
            "precio_descuento": producto.precio_descuento,
            "descuento": producto.descuento,
            "imagen_url": producto.imagen_url,
            "categoria": categoria.nombre
        }
        for producto in productos
    ]

