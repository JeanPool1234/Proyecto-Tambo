from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from database.database import Base
from datetime import datetime

class Carrito(Base):
    __tablename__ = 'Carrito'

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'), nullable=False)
    producto_id = Column(Integer, ForeignKey('productos.id'), nullable=False)
    cantidad = Column(Integer, nullable=False)
    precio = Column(Float, nullable=False)
    fecha_agregado = Column(DateTime, default=datetime.utcnow)
    precio_descuento = Column(Float, nullable=True)
    imagen_url = Column(String, nullable=True)

    usuario = relationship("Usuario", back_populates="carritos")
    producto = relationship("Producto", back_populates="carritos")
