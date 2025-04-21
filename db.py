import mysql.connector
from mysql.connector import Error

def get_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='',  # leaving blank as there is no password for datbase on php Myadmin
        database='rakusen_dashboard'
    )

