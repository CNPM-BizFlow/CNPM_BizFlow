import sys
import os

sys.path.insert(0, os.path.join(os.getcwd(), 'src'))

from app import create_app
from infrastructure.models.store import Store
from infrastructure.models.user import User
from infrastructure.models.draft_order import DraftOrder

app = create_app()
with app.app_context():
    with open('diagnostic_result.txt', 'w', encoding='utf-8') as f:
        f.write("--- STORE INFO ---\n")
        for s in Store.query.all():
            f.write(f"Store ID: {s.id}, Name: {s.name}, Owner ID: {s.owner_id}\n")
        
        f.write("\n--- DRAFT ORDERS ---\n")
        drafts = DraftOrder.query.all()
        f.write(f"Total Drafts: {len(drafts)}\n")
        for d in drafts:
            f.write(f"ID: {d.id}, Text: {d.source_text[:30]}, Status: {d.status}\n")

        f.write("\n--- OWNER INFO ---\n")
        owner = User.query.filter_by(email='owner@bizflow.vn').first()
        if owner:
            f.write(f"Owner ID: {owner.id}, Email: {owner.email}\n")
            f.write(f"Owned Stores: {[s.id for s in owner.owned_stores]}\n")
        else:
            f.write("Owner not found!\n")
    print("Diagnostic complete. Results in diagnostic_result.txt")
