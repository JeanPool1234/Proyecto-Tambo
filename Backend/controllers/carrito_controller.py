from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.carrito import Carrito
from models.usuario import Usuario
from models.producto import Producto

router = APIRouter()

# 1. Agregar producto al carrito
@router.post("/carrito/agregar")
def agregar_producto(usuario_id: int, producto_id: int, cantidad: int = 1, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Obtener la URL de la imagen del producto
    imagen_url_del_producto = producto.imagen_url

    existente = db.query(Carrito).filter_by(usuario_id=usuario_id, producto_id=producto_id).first()

    if existente:
        existente.cantidad += cantidad
        # --- INICIO DE LÍNEAS MODIFICADAS/AÑADIDAS PARA EL EXISTENTE ---
        # Asegúrate de actualizar también estos campos en el carrito existente
        existente.precio = producto.precio # Actualiza el precio final por si ha cambiado en el producto
        existente.precio_descuento = producto.precio # Usa el nombre de columna correcto
        existente.imagen_url = imagen_url_del_producto
        # existente.fecha_agregado = datetime.now() # Opcional: actualizar fecha si se modifica
        # --- FIN DE LÍNEAS MODIFICADAS/AÑADIDAS PARA EL EXISTENTE ---
    else:
        nuevo = Carrito(
            usuario_id=usuario_id,
            producto_id=producto_id,
            cantidad=cantidad,
            precio=producto.precio, # Este es el precio que se usará para el cálculo final
            # --- INICIO DE LÍNEAS AÑADIDAS PARA EL NUEVO ---
            precio_descuento=producto.precio_descuento, # Usa el nombre de columna correcto
            imagen_url=imagen_url_del_producto, # La URL de la imagen del producto
            # --- FIN DE LÍNEAS AÑADIDAS PARA EL NUEVO ---
        )
        db.add(nuevo)
    
    db.commit()
    return {"message": "Producto agregado al carrito"}

# 2. Ver carrito del usuario
@router.get("/carrito/{usuario_id}")
def ver_carrito(usuario_id: int, db: Session = Depends(get_db)):
    items = db.query(Carrito).filter(Carrito.usuario_id == usuario_id).all()
    return items

# 3. Eliminar un producto del carrito
@router.delete("/carrito/eliminar")
def eliminar_producto(usuario_id: int, producto_id: int, db: Session = Depends(get_db)):
    item = db.query(Carrito).filter_by(usuario_id=usuario_id, producto_id=producto_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Producto no encontrado en el carrito")
    db.delete(item)
    db.commit()
    return {"message": "Producto eliminado del carrito"}

# 4. Vaciar carrito
@router.delete("/carrito/vaciar/{usuario_id}")
def vaciar_carrito(usuario_id: int, db: Session = Depends(get_db)):
    db.query(Carrito).filter(Carrito.usuario_id == usuario_id).delete()
    db.commit()
    return {"message": "Carrito vaciado"}
