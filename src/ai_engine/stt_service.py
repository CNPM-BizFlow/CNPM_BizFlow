import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API Key từ file .env
load_dotenv()

class STTService:
    def __init__(self):
        # Lấy Key từ biến môi trường
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("❌ Chưa cấu hình GEMINI_API_KEY trong file .env")
            
        genai.configure(api_key=api_key)
        
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    async def transcribe(self, audio_path: str) -> str:
        print(f"📢 [Gemini] Đang xử lý file: {audio_path}...")
        
        try:
            # 1. Upload file lên Google
            audio_file = genai.upload_file(path=audio_path)
            
            # 2. Gửi yêu cầu dịch
            response = self.model.generate_content(
                ["Hãy nghe file âm thanh này và trích xuất (transcribe) chính xác nội dung văn bản tiếng Việt. Chỉ trả về văn bản, không thêm lời dẫn.", audio_file]
            )
            
            # 3. Trả về kết quả
            print(f"✅ [Gemini] Kết quả: {response.text.strip()}")
            return response.text.strip()
            
        except Exception as e:
            print(f"❌ [Lỗi Gemini]: {str(e)}")
            return "Lỗi nhận diện giọng nói"