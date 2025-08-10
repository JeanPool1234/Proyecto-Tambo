from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL para SQL Server con pyodbc
DATABASE_URL = (
    "mssql+pyodbc://Wender/Tambo"
    "?driver=ODBC+Driver+18+for+SQL+Server"
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
