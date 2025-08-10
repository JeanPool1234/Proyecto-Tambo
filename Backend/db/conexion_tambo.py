import pyodbc

def get_connection():
    conn_str = (
        "DRIVER={ODBC Driver 18 for SQL Server};"
        "SERVER=Wender;"
        "DATABASE=Tambo;"
        "Trusted_Connection=yes;"
        "TrustServerCertificate=yes;"
    )
    return pyodbc.connect(conn_str)
