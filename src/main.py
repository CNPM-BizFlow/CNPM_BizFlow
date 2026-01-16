from fastapi import FastAPI
from src.api.controllers import order_controller as orders

app = FastAPI(
    title="BizFlow API",
    description="AI-powered Order Management System",
    version="1.0.0"
)

# Đăng ký router orders
app.include_router(orders.router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}
