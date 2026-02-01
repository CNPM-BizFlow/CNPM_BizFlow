import json
import google.generativeai as genai
from src.config import get_settings
# from src.ai_engine.rag_service import RAGService 

class LLMService:
    def __init__(self):
        self.settings = get_settings()
        
        # Cấu hình API Key
        genai.configure(api_key=self.settings.GEMINI_API_KEY)
        
        # self.rag = RAGService() 
        
        # --- SỬA LẠI ĐOẠN NÀY CHO ĐÚNG THỤT DÒNG ---
        self.model = genai.GenerativeModel(
            "gemini-2.5-flash", 
            generation_config={"response_mime_type": "application/json"}
        )

    async def parse_order_intent(self, text: str, business_id: str):
        # 1. Giả lập dữ liệu sản phẩm để test
        products = [
            {"name": "Cà phê đen đá", "id": "CF01"},
            {"name": "Cà phê sữa đá", "id": "CF02"},
            {"name": "Trà đào cam sả", "id": "TD01"},
            {"name": "Bạc xỉu", "id": "BX01"}
        ]
        
        product_context = "\n".join([f"- {p['name']} (ID: {p['id']})" for p in products])

        # 2. Tạo Prompt
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
        try:
            response = self.model.generate_content(prompt)
            return json.loads(response.text)
        except Exception as e:
            return {"error": f"Lỗi AI: {str(e)}"}