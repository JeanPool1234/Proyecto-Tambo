import os
import pyodbc

def get_connection():
    server = os.getenv("DB_SERVER", "Wender")
    database = os.getenv("DB_NAME", "Tambo")
    driver = os.getenv("DB_DRIVER", "ODBC Driver 18 for SQL Server")
    conn_str = (
        f"DRIVER={{{driver}}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        "Trusted_Connection=yes;"
        "TrustServerCertificate=yes;"
    )
    return pyodbc.connect(conn_str)
