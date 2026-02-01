import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), 'src'))

from app import create_app
from extensions import db
from sqlalchemy import inspect

def inspect_columns():
    app = create_app()
    with app.app_context():
        inspector = inspect(db.engine)
        columns = inspector.get_columns('customers')
        print(f"--- CUSTOMERS COLUMNS ({len(columns)}) ---")
        for column in columns:
            print(f"COL: {column['name']}")
        sys.stdout.flush()

if __name__ == "__main__":
    inspect_columns()
