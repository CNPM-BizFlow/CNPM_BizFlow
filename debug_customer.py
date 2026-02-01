import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), 'src'))

from app import create_app
from extensions import db
from infrastructure.models import Customer, User
from domain.constants import Role

def test_create_customer():
    app = create_app()
    with app.app_context():
        try:
            # Check if store 1 exists
            from infrastructure.models import Store
            store = Store.query.get(1)
            if not store:
                print("Error: Store 1 does not exist. Please run seed script.")
                return

            print(f"Using Store: {store.name} (ID: {store.id})")
            
            # Try to create a test customer
            customer = Customer(
                store_id=1,
                name="Test Customer Diagnostic",
                phone="000111222",
                address="Diagnostic Addr",
                is_active=True
            )
            
            db.session.add(customer)
            db.session.commit()
            print(f"Successfully created customer: {customer.name} (ID: {customer.id})")
            
            # Clean up
            db.session.delete(customer)
            db.session.commit()
            print("Cleanup successful.")

        except Exception as e:
            print(f"ERROR CAUGHT: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    test_create_customer()
