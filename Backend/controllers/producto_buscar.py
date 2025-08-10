from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.producto import Producto

router = APIRouter(prefix="/api/productos_buscar", tags=["Productos"])

@router.get("/buscar")
def buscar_productos(nombre: str, db: Session = Depends(get_db)):
    productos = db.query(Producto).filter(Producto.nombre.ilike(f"%{nombre}%")).all()
    if not productos:
        raise HTTPException(status_code=404, detail="No se encontraron productos similares")
    return productos
