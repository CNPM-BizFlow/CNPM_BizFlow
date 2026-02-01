import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), 'src'))

from app import create_app
from extensions import db
from sqlalchemy import inspect

def list_tables():
    app = create_app()
    with app.app_context():
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"Tables in Database: {tables}")

if __name__ == "__main__":
    list_tables()
