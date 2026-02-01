from flask import Blueprint, request, jsonify
import os
from src.ai_engine.stt_service import STTService
from src.ai_engine.llm_service import LLMService

# Khai báo Blueprint (Thay thế cho APIRouter của FastAPI)
voice_bp = Blueprint('voice', __name__)

stt_service = STTService()
llm_service = LLMService()

@voice_bp.route('/voice-order', methods=['POST'])
async def handle_voice_order():
    # Kiểm tra xem có file gửi lên không
    if 'file' not in request.files:
        return jsonify({"error": "Không tìm thấy file âm thanh"}), 400
    
    file = request.files['file']
    
    # Lưu file tạm thời để AI đọc
    temp_path = f"temp_{file.filename}"
    file.save(temp_path)

    try:
        # Bước 1: Chuyển giọng nói -> Chữ (Dùng file stt_service.py bạn đã gửi)
        text = await stt_service.transcribe(temp_path)
        
        # Bước 2: Dùng LLM để phân tích đơn hàng (Dùng file llm_service.py bạn đã gửi)
        # Tạm thời để business_id = 1
        order_json = await llm_service.parse_order_intent(text, business_id="1")
        
        # Xóa file tạm sau khi xong
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return jsonify({
            "status": "success",
            "transcription": text,
            "order_details": order_json
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500