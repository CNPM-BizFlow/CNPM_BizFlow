import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), 'src'))

from app import create_app
from extensions import db
from infrastructure.models import User, Store

def verify_auth_data():
    app = create_app()
    with app.app_context():
        print("--- OWNER CHECK ---")
        owner = User.query.filter_by(email='owner@bizflow.vn').first()
        if owner:
            print(f"Owner ID: {owner.id}")
            print(f"Role: {owner.role}")
            stores = owner.owned_stores
            print(f"Owned stores: {[s.id for s in stores]}")
        else:
            print("Owner not found!")

        print("\n--- STORES CHECK ---")
        all_stores = Store.query.all()
        for s in all_stores:
            print(f"Store ID: {s.id}, OwnerID: {s.owner_id}")

if __name__ == "__main__":
    verify_auth_data()
