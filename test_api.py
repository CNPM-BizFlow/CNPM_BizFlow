import requests

# Địa chỉ server (đang chạy bên kia)
url = "http://127.0.0.1:8001/api/v1/voice-order"

# File ghi âm (Bạn PHẢI copy 1 file mp3 vào thư mục dự án và đổi tên thành test.mp3)
file_path = "test.mp3" 

try:
    with open(file_path, "rb") as f:
        print(f"🚀 Đang gửi '{file_path}' lên server...")
        response = requests.post(url, files={"file": f})
        print("\n✅ KẾT QUẢ AI TRẢ VỀ:")
        print(response.json())
except FileNotFoundError:
    print("❌ Lỗi: Bạn chưa có file 'test.mp3' trong thư mục này!")
except Exception as e:
    print(f"❌ Lỗi: {e}")