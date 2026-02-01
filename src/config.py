from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ===== GOOGLE GEMINI =====
    GEMINI_API_KEY: str

    # Model dùng cho LLM (parse intent, sinh JSON)
    LLM_MODEL: str = "models/gemini-1.5-flash"

    # Model dùng cho embedding (RAG)
    EMBEDDING_MODEL: str = "models/text-embedding-004"

    # ===== SPEECH TO TEXT =====
    # Gemini KHÔNG dùng cho STT → dùng Whisper
    STT_PROVIDER: str = "whisper"

    # ===== CHROMA =====
    CHROMA_PERSIST_DIR: str = "./chroma_db"

    # ===== API =====
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    # ===== LOG =====
    LOG_LEVEL: str = "INFO"

    # Đọc .env, bỏ qua biến dư
    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }


@lru_cache()
def get_settings():
    return Settings()
