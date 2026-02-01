import sys
import os

# --- THÊM ĐOẠN NÀY ĐỂ FIX LỖI "NO MODULE NAMED SRC" ---
# Lấy đường dẫn thư mục gốc dự án và thêm vào hệ thống
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# ------------------------------------------------------

from flask import Flask, jsonify
# Lưu ý: Import đúng tên file 'voice_router' và biến 'voice_bp'
from src.api.voice_router import voice_bp 

app = Flask(__name__)

# Đăng ký nhóm chức năng Voice
app.register_blueprint(voice_bp, url_prefix='/api/v1')

@app.route('/')
def home():
    return jsonify({"status": "BizFlow Flask is Online"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=True)