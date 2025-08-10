from fastapi import APIRouter, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from database.database import get_db
from models.usuario import Usuario
from passlib.hash import bcrypt
import jwt
from datetime import datetime, timedelta

router = APIRouter()
SECRET_KEY = "clave-secreta-123"  # ¡Cambia esto en producción por una clave más segura!

@router.post("/register")
def register(
    nombre: str = Form(...),
    email: str = Form(...),
    telefono: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    if db.query(Usuario).filter(Usuario.email == email).first():
        raise HTTPException(status_code=400, detail="Email ya registrado")

    hashed_pw = bcrypt.hash(password)
    nuevo_usuario = Usuario(nombre=nombre, email=email, telefono=telefono, password=hashed_pw)
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return {"message": "Usuario creado exitosamente", "usuario_id": nuevo_usuario.id}

@router.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        usuario = db.query(Usuario).filter(Usuario.email == email).first()

        if not usuario:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        if not bcrypt.verify(password, usuario.password):
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        payload = {
            "sub": usuario.email,
            "exp": datetime.utcnow() + timedelta(hours=6),
            # ¡Aquí está el cambio! Añadimos el ID del usuario al payload del token
            "user_id": usuario.id,
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        # Y también devolvemos el ID del usuario directamente en la respuesta
        return {
            "access_token": token,
            "token_type": "bearer",
            "user_id": usuario.id  # <-- ¡Añadido aquí!
        }

    except HTTPException as e:
        # Re-raise las HTTPExceptions ya definidas (401)
        raise e
    except Exception as e:
        # Captura cualquier otra excepción inesperada
        print(f"Error durante el login: {e}") # Para depuración en el servidor
        raise HTTPException(status_code=500, detail="Error interno del servidor")