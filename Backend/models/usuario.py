from sqlalchemy import Column, Integer, String
from database.database import Base
from sqlalchemy.orm import relationship

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    telefono = Column(String, nullable=False)
    password = Column(String, nullable=False)
    direccion = Column(String,nullable=True)
    
    carritos = relationship("Carrito", back_populates="usuario")
    pedidos = relationship("Pedido", back_populates="usuario")
