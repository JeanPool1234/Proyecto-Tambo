from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
from models.categoria import Categoria

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion= Column(String, nullable=False)
    precio = Column(Float, nullable=False)
    precio_descuento = Column(Float, nullable=True)
    descuento = Column(Float, nullable=True)
    imagen_url = Column(String, nullable=True)
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)

    categoria = relationship("Categoria", back_populates="productos")
    carritos = relationship("Carrito", back_populates="producto")