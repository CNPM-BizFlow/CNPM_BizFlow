import pymysql
import os
from dotenv import load_dotenv

# Load env from src/.env
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

host = os.getenv('MYSQL_HOST', '127.0.0.1')
user = os.getenv('MYSQL_USER', 'root')
password = os.getenv('MYSQL_PASSWORD', 'root')
port = int(os.getenv('MYSQL_PORT', 3306))
dbname = os.getenv('MYSQL_DATABASE', 'bizflow')

print(f"Attempting to connect to MySQL ({host}:{port}) as {user}...")

try:
    conn = pymysql.connect(host=host, user=user, password=password, port=port)
    cursor = conn.cursor()
    print("Connected successfully.")
    
    print(f"Creating database '{dbname}' if not exists...")
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {dbname} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    print("Database ready.")
    
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
    print("Please check if MySQL server is running and credentials in src/.env are correct.")
