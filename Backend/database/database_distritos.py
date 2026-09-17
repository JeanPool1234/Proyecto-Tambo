import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configuración de base de datos (con soporte para variables de entorno)
DB_SERVER = os.getenv("DB_SERVER", "Wender")
DB_NAME_DISTRITOS = os.getenv("DB_NAME_DISTRITOS", "geoDistritosLima")
DB_DRIVER = os.getenv("DB_DRIVER", "ODBC Driver 18 for SQL Server")

DATABASE_URL = (
    f"mssql+pyodbc://{DB_SERVER}/{DB_NAME_DISTRITOS}"
    f"?driver={DB_DRIVER.replace(' ', '+')}"
    "&trusted_connection=yes"
    "&TrustServerCertificate=yes"
)

engine = create_engine(
    DATABASE_URL,
    echo=False,
    fast_executemany=True,
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()

# Dependency para obtener una sesión
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
