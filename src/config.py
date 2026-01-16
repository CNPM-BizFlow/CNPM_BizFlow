from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # QUAN TRỌNG: Phải đổi tên biến thành GEMINI_API_KEY
    GEMINI_API_KEY: str

    # Các cấu hình khác
    EMBEDDING_MODEL: str = "models/text-embedding-004"
    LLM_MODEL: str = "gemini-1.5-flash"
    STT_PROVIDER: str = "whisper"
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8001
    LOG_LEVEL: str = "INFO"

    # Cho phép đọc file .env và bỏ qua biến thừa
    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

@lru_cache()
def get_settings():
    return Settings()