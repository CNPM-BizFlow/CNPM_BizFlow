import logging
import google.generativeai as genai
from src.config import get_settings

logger = logging.getLogger(__name__)

class STTService:
    def __init__(self):
        self.settings = get_settings()
        genai.configure(api_key=self.settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(self.settings.LLM_MODEL)

    async def transcribe(self, audio_path: str) -> str:
        # --- ĐOẠN IN RA MÀN HÌNH ĐỂ KIỂM TRA ---
        print(f"\n\n📢 [BẮT ĐẦU] Đang nhận file âm thanh: {audio_path}")
        
        try:
            print("📢 [BƯỚC 1] Đang upload file lên Google Gemini...")
            # Upload file
            audio_file = genai.upload_file(path=audio_path)
            print("📢 [BƯỚC 2] Upload XONG. Đang yêu cầu AI dịch sang chữ...")

            # Gọi AI
            response = self.model.generate_content(
                [
                    "Hãy nghe file âm thanh này và viết lại chính xác nội dung văn bản (Transcribe) bằng tiếng Việt. Chỉ trả về nội dung văn bản, không thêm lời dẫn.", 
                    audio_file
                ]
            )

            # In kết quả ra màn hình đen
            text_result = response.text.strip()
            print(f"📢 [KẾT QUẢ AI TRẢ VỀ]: '{text_result}'")
            
            return text_result
            
        except Exception as e:
            # Nếu lỗi thì in lỗi to đùng ra
            print(f"❌ [LỖI NGHIÊM TRỌNG]: {str(e)}")
            return ""