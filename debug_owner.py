import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), 'src'))

from app import create_app
from extensions import db
from infrastructure.models import User, Store, Customer
from domain.constants import Role

def debug_owner_permissions():
    app = create_app()
    with app.app_context():
        try:
            owner = User.query.filter_by(email='owner@bizflow.vn').first()
            if not owner:
                print("Error: owner@bizflow.vn not found.")
                return

            print(f"User: {owner.full_name}, Role: {owner.role}")
            print(f"Owned stores: {[s.id for s in owner.owned_stores]}")
            
            store_id_to_check = 1
            has_access = owner.can_access_store(store_id_to_check)
            print(f"Can access store {store_id_to_check}? {has_access}")

            # Check for existing customers with this phone
            existing = Customer.query.filter_by(phone='0962667833').first()
            if existing:
                print(f"WARNING: Customer with phone 0962667833 already exists (ID: {existing.id})")

        except Exception as e:
            print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    debug_owner_permissions()
