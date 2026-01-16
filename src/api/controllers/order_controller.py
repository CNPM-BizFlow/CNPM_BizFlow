import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from src.ai_engine.stt_service import STTService
from src.ai_engine.llm_service import LLMService

router = APIRouter()

stt_service = STTService()
llm_service = LLMService()

@router.post("/voice-order")
async def create_draft_order(
    business_id: str = Form(...),
    audio: UploadFile = File(...)
):
    # 1. Tạo tên file tạm (Lưu ngay tại thư mục hiện tại để tránh lỗi đường dẫn)
    # Lấy đuôi file gốc (ví dụ .mp3, .wav)
    file_extension = audio.filename.split(".")[-1] if "." in audio.filename else "wav"
    temp_filename = f"temp_{uuid.uuid4()}.{file_extension}"

    try:
        # 2. Lưu file xuống ổ cứng
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)

        # 3. Xử lý STT (Voice -> Text)
        text = await stt_service.transcribe(temp_filename)
        
        if not text:
            # Trả về kết quả rỗng nhưng thành công để Frontend dễ xử lý
            return {
                "success": False, 
                "message": "Không nghe rõ giọng nói, vui lòng thử lại."
            }

        # 4. Xử lý LLM (Text -> Order JSON)
        draft_order = await llm_service.parse_order_intent(
            text=text,
            business_id=business_id
        )

        return {
            "success": True,
            "voice_text": text,
            "draft_order": draft_order
        }

    except Exception as e:
        # Bắt lỗi hệ thống (ví dụ lỗi API Key, lỗi mạng)
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý: {str(e)}")

    finally:
        # 5. QUAN TRỌNG: Dọn dẹp file tạm dù chạy thành công hay thất bại
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
            print(f"Deleted temp file: {temp_filename}")