from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from models.distrito import Distrito
from database.database_distritos import get_db

router = APIRouter(prefix="/api/distritos", tags=["Distritos"])

@router.get("/buscar_similar")
def buscar_distritos_similares(texto: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    resultados = db.query(Distrito).filter(Distrito.nombre.ilike(f"%{texto}%")).all()
    
    if not resultados:
        raise HTTPException(status_code=404, detail="No se encontraron distritos similares")

    return [{"id": d.id, "nombre": d.nombre} for d in resultados]