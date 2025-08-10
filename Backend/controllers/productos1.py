from fastapi import APIRouter, Depends, Form, HTTPException, File, UploadFile, status
from sqlalchemy.orm import Session
from database.database import get_db
from models.producto import Producto
import shutil # Importa shutil para manejar archivos
import os # Importa os para operaciones de sistema de archivos

router = APIRouter(prefix="/productos", tags=["Productos"])

# Define el directorio donde se guardarán las imágenes de los productos
# Asegúrate de que esta ruta sea correcta y que la carpeta exista.
# Por ejemplo, si tu main.py está en la raíz, UPLOAD_DIRECTORY podría ser "static/productos"
UPLOAD_DIRECTORY = "static/productos"

# Asegúrate de que el directorio de subida exista al iniciar la aplicación
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)


# 1. Crear producto (AHORA CON SUBIDA DE IMAGEN Y RENOMBRADO)
@router.post("/") # La ruta es /productos/ (debido al prefix)
def crear_producto(
    nombre: str = Form(...),
    descripcion: str = Form(...),
    precio_descuento: float = Form(...),
    imagen_file: UploadFile = File(..., description="Archivo de imagen del producto (JPG, PNG)"), # Ahora es obligatorio
    precio: float = Form(..., description="Precio con descuento (obligatorio)"), # Ahora es obligatorio
    categoria_id: int = Form(...),
    db: Session = Depends(get_db)
):
    # Calcular el porcentaje de descuento (si se proporcionó precio_descuento)
    if precio_descuento is not None and precio > 0:
        descuento = round((1 - (precio_descuento / precio)) * 100, 1)
    else:
        descuento = None 
    
    # Paso 1: Guardar el archivo temporalmente con su nombre original
    # Esto es necesario porque el ID del producto no está disponible hasta después del primer commit
    temp_filename = imagen_file.filename
    file_extension = os.path.splitext(temp_filename)[1] # Obtener la extensión del archivo
    temp_file_location = os.path.join(UPLOAD_DIRECTORY, temp_filename)
    
    try:
        with open(temp_file_location, "wb+") as file_object:
            shutil.copyfileobj(imagen_file.file, file_object)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al guardar la imagen temporalmente: {e}")

    # Paso 2: Crear el producto en la base de datos con un nombre temporal (o None) para la imagen
    # y obtener el ID asignado por la DB
    nuevo_producto = Producto(
        nombre=nombre,
        descripcion=descripcion,
        precio=precio,
        imagen_url=temp_filename, # Guardar temporalmente el nombre original
        precio_descuento=precio_descuento,
        descuento=descuento,
        categoria_id=categoria_id
    )
    
    db.add(nuevo_producto)
    db.commit() # Guarda el producto y obtiene su ID
    db.refresh(nuevo_producto) # Refresca el objeto para tener el ID

    # Paso 3: Renombrar el archivo de imagen usando el ID del producto
    new_filename = f"img{nuevo_producto.id}{file_extension}"
    new_file_location = os.path.join(UPLOAD_DIRECTORY, new_filename)

    try:
        os.rename(temp_file_location, new_file_location)
    except Exception as e:
        # Si falla el renombrado, intenta revertir la creación del producto (opcional, pero buena práctica)
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al renombrar la imagen: {e}. Producto no creado.")

    # Paso 4: Actualizar la base de datos con el nuevo nombre de la imagen
    nuevo_producto.imagen_url = new_filename
    db.commit() # Guarda el cambio del nombre de la imagen en la DB
    db.refresh(nuevo_producto)

    return {
        "message": "Producto creado exitosamente",
        "producto_id": nuevo_producto.id,
        "descuento_calculado": descuento,
        "imagen_guardada": new_filename # Confirmar el nuevo nombre del archivo
    }

# 2. Listar todos los productos
@router.get("/") # La ruta es /productos/ (debido al prefix)
def listar_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).all()
    return productos

# 3. Obtener un producto por ID
@router.post("/obtener") # La ruta es /productos/obtener (debido al prefix)
def obtener_producto_por_id(producto_id: int = Form(...), db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

# 4. Actualizar un producto
@router.put("/{producto_id}") # La ruta es /productos/{producto_id} (debido al prefix)
def actualizar_producto(
    producto_id: int,
    nombre: str = Form(...),
    descripcion: str = Form(...),
    precio: float = Form(...),
    precio_descuento: float = Form(..., description="Precio con descuento"), # Ahora es obligatorio
    imagen_url: str = Form(..., description="URL de la imagen"), # Ahora es obligatorio
    # Opcional: Si también quieres actualizar la imagen subiendo un nuevo archivo
    # imagen_file: Optional[UploadFile] = File(None), 
    categoria_id: int = Form(...),
    db: Session = Depends(get_db)
):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    producto.nombre = nombre
    producto.descripcion = descripcion
    producto.precio = precio
    producto.precio_descuento = precio_descuento
    producto.imagen_url = imagen_url # Actualiza la URL de la imagen si se proporciona
    # Lógica para manejar la subida de una nueva imagen si se implementa imagen_file aquí
    producto.categoria_id = categoria_id

    # 🧠 Cálculo automático del porcentaje de descuento si hay precio con descuento
    if precio_descuento is not None and precio_descuento < precio:
        producto.descuento = round((1 - (precio_descuento / precio)) * 100, 1)
    else:
        producto.descuento = None  # o 0, dependiendo de tu lógica

    db.commit()
    db.refresh(producto)
    return {"message": "Producto actualizado correctamente"}

# 5. Eliminar un producto
@router.delete("/eliminar") # La ruta es /productos/eliminar (debido al prefix)
def eliminar_producto(producto_id: int = Form(...), db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(producto)
    db.commit()
    return {"message": "Producto eliminado correctamente"}