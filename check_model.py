import google.generativeai as genai
from src.config import get_settings

def check():
    print("⏳ Đang kết nối tới Google để lấy danh sách Model...")
    settings = get_settings()
    genai.configure(api_key=settings.GEMINI_API_KEY)

    try:
        found = False
        print("\n✅ DANH SÁCH MODEL BẠN ĐƯỢC DÙNG:")
        for m in genai.list_models():
            # Chỉ lấy những model biết tạo nội dung (generateContent)
            if 'generateContent' in m.supported_generation_methods:
                print(f"   👉 {m.name}")
                found = True
        
        if not found:
            print("❌ Không tìm thấy model nào! Có thể Key bị lỗi quyền hạn.")
            
    except Exception as e:
        print(f"❌ Lỗi kết nối: {e}")

if __name__ == "__main__":
    check()