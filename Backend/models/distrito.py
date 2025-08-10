from sqlalchemy import Column, Integer, String
from database.database_distritos import Base

class Distrito(Base):
    __tablename__ = "distritos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False, index=True)