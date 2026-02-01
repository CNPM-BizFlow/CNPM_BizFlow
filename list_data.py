import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), 'src'))

from app import create_app
from extensions import db
from infrastructure.models import Store, User

def list_data():
    app = create_app()
    with app.app_context():
        stores = Store.query.all()
        print(f"Total Stores: {len(stores)}")
        for s in stores:
            print(f"ID: {s.id}, Name: {s.name}, OwnerID: {s.owner_id}")
        
        users = User.query.all()
        print(f"Total Users: {len(users)}")
        for u in users:
            print(f"ID: {u.id}, Email: {u.email}, Role: {u.role}")

if __name__ == "__main__":
    list_data()
