import google.generativeai as genai

# --- 👇 DÁN API KEY CỦA BẠN VÀO GIỮA 2 DẤU NHÁY DƯỚI ĐÂY 👇 ---
my_api_key = "AIzaSyCAVTxwdo3tSUTxgtn4tmXyL0LP2RN_sNs" 
# Ví dụ: my_api_key = "AIzaSyDxxxxxxxxx..."
# -------------------------------------------------------------

print(f"🔑 Đang kiểm tra với Key: {my_api_key[:10]}...")

try:
    genai.configure(api_key=my_api_key)
    print("\n📋 DANH SÁCH MODEL GOOGLE CHO PHÉP BẠN DÙNG:")
    
    found = False
    for m in genai.list_models():
        # Chỉ lấy những model có khả năng tạo nội dung (generateContent)
        if 'generateContent' in m.supported_generation_methods:
            print(f"   ✅ {m.name}")
            found = True
            
    if not found:
        print("⚠️ Không tìm thấy model nào. Key này có thể bị lỗi hoặc chưa kích hoạt.")

except Exception as e:
    print(f"\n❌ LỖI KẾT NỐI: {e}")
    print("👉 Kiểm tra lại xem bạn đã copy đúng API Key chưa nhé!")