from fastapi import APIRouter, Depends, Form, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.categoria import Categoria

router = APIRouter(prefix="/categorias", tags=["Categorías"])

# 1. Crear categoría
@router.post("/crear")
def crear_categoria(nombre: str = Form(...), db: Session = Depends(get_db)):
    nueva_categoria = Categoria(nombre=nombre)
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return {
        "message": "Categoría creada exitosamente",
        "categoria_id": nueva_categoria.id
    }

# 2. Listar todas las categorías
@router.get("/listar")
def listar_categorias(db: Session = Depends(get_db)):
    categorias = db.query(Categoria).all()
    return categorias

# 3. Obtener una categoría por ID
@router.post("/obtener")
def obtener_categoria_por_id(categoria_id: int = Form(...), db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

# 4. Actualizar una categoría
@router.put("/actualizar/{categoria_id}")
def actualizar_categoria(
    categoria_id: int,
    nombre: str = Form(...),
    db: Session = Depends(get_db)
):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    categoria.nombre = nombre
    db.commit()
    db.refresh(categoria)
    return {"message": "Categoría actualizada correctamente"}

# 5. Eliminar una categoría
@router.delete("/eliminar")
def eliminar_categoria(categoria_id: int = Form(...), db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    db.delete(categoria)
    db.commit()
    return {"message": "Categoría eliminada correctamente"}