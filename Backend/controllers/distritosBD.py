from fastapi import APIRouter
from db.conexion_distritos import get_connection

router = APIRouter()

@router.get("/")
def obtener_distritos():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre, provincia, departamento FROM distritos ORDER BY nombre")
    registros = cursor.fetchall()

    distritos_lista = []
    for fila in registros:
        distritos_lista.append({
            "id": fila.id,
            "nombre": fila.nombre,
            "provincia": fila.provincia,
            "departamento": fila.departamento
        })

    cursor.close()
    conn.close()
    return distritos_lista
