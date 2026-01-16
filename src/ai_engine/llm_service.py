import json
import google.generativeai as genai
from src.config import get_settings
from src.ai_engine.rag_service import RAGService

class LLMService:
    def __init__(self):
        self.settings = get_settings()
        genai.configure(api_key=self.settings.GEMINI_API_KEY)
        self.rag = RAGService()
        
        # Cấu hình model trả về JSON
        self.model = genai.GenerativeModel(
            self.settings.LLM_MODEL,
            generation_config={"response_mime_type": "application/json"}
        )

    async def parse_order_intent(self, text: str, business_id: str):
        # 1. Tìm sản phẩm liên quan từ Database
        products = await self.rag.search_products(business_id, text, top_k=5)
        product_context = "\n".join([f"- {p['name']} (ID: {p['id']})" for p in products])

        # 2. Tạo Prompt cho Google Gemini
        prompt = f"""
        Bạn là nhân viên bán hàng. Hãy trích xuất đơn hàng từ câu nói sau: "{text}"
        
        Dữ liệu sản phẩm có sẵn trong kho:
        {product_context}
        
        Yêu cầu:
        - Chỉ trả về JSON thuần túy.
        - Mapping sản phẩm trong câu nói với sản phẩm trong kho (dựa vào tên gần đúng nhất).
        - Nếu tìm thấy, điền ID và Tên chuẩn vào.
        
        Cấu trúc JSON mong muốn:
        {{
            "items": [
                {{
                    "raw_name": "tên khách nói",
                    "matched_name": "tên trong kho",
                    "product_id": "ID sản phẩm",
                    "quantity": số lượng (số),
                    "unit": "đơn vị"
                }}
            ],
            "customer_name": "tên khách (nếu có)",
            "note": "ghi chú thêm"
        }}
        """

        # 3. Gọi Google Gemini
        response = self.model.generate_content(prompt)
        
        # 4. Parse kết quả
        try:
            return json.loads(response.text)
        except:
            return {"error": "Lỗi phân tích cú pháp JSON từ AI"}