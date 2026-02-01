from src.app import create_app
from src.extensions import db

app = create_app()
with app.app_context():
    db.create_all()
    print("--- CHUC MUNG! DATABASE DA TAO BANG THANH CONG ---")