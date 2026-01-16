import asyncio
from src.ai_engine.rag_service import RAGService

async def main():
    print("⏳ Đang nạp dữ liệu mẫu vào ChromaDB...")
    
    rag = RAGService()
    
    # Danh sách sản phẩm giả lập
    sample_products = [
        {"id": "SP01", "name": "Xi măng Hà Tiên", "price": 95000, "unit": "bao"},
        {"id": "SP02", "name": "Xi măng Nghi Sơn", "price": 88000, "unit": "bao"},
        {"id": "SP03", "name": "Thép cuộn Pomina phi 6", "price": 16000, "unit": "kg"},
        {"id": "SP04", "name": "Sơn Dulux trắng", "price": 1200000, "unit": "thùng"},
        {"id": "SP05", "name": "Cát xây tô", "price": 350000, "unit": "khối"}
    ]
    
    business_id = "demo_store_1"
    
    try:
        count = await rag.index_products(business_id, sample_products)
        print(f"✅ Đã nạp thành công {count} sản phẩm cho shop '{business_id}'")
    except Exception as e:
        print(f"❌ Lỗi: {e}")

if __name__ == "__main__":
    asyncio.run(main())