from sqlalchemy import Column, Integer, String
from database.database import Base
from sqlalchemy.orm import relationship


class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)

    productos = relationship("Producto", back_populates="categoria")