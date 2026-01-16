import logging
import chromadb
from chromadb.config import Settings as ChromaSettings
import google.generativeai as genai
from src.config import get_settings

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self.settings = get_settings()
        
        # Cấu hình Google Gemini
        genai.configure(api_key=self.settings.GEMINI_API_KEY)
        
        try:
            self.chroma_client = chromadb.PersistentClient(
                path=self.settings.CHROMA_PERSIST_DIR,
                settings=ChromaSettings(anonymized_telemetry=False)
            )
        except Exception as e:
            logger.error(f"ChromaDB Init Failed: {e}")
            raise e

    def _get_embedding(self, text: str):
        # Hàm tạo vector của Google
        # task_type="retrieval_document" dùng khi nạp dữ liệu vào kho
        result = genai.embed_content(
            model=self.settings.EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']

    async def index_products(self, business_id: str, products: list[dict]):
        collection = self.chroma_client.get_or_create_collection(name=f"biz_{business_id}")
        
        ids = []
        embeddings = []
        metadatas = []
        
        for p in products:
            search_text = f"{p['name']} {p.get('unit', '')}"
            ids.append(str(p['id']))
            embeddings.append(self._get_embedding(search_text))
            metadatas.append({
                "id": str(p['id']), 
                "name": p['name'], 
                "price": float(p['price']), 
                "unit": p['unit']
            })
            
        if ids:
            collection.add(ids=ids, embeddings=embeddings, metadatas=metadatas)
        return len(ids)

    async def search_products(self, business_id: str, query: str, top_k=1):
        try:
            collection = self.chroma_client.get_collection(name=f"biz_{business_id}")
        except:
            return [] 

        # Khi tìm kiếm thì dùng task_type="retrieval_query"
        query_vec = genai.embed_content(
            model=self.settings.EMBEDDING_MODEL,
            content=query,
            task_type="retrieval_query"
        )['embedding']
        
        results = collection.query(
            query_embeddings=[query_vec],
            n_results=top_k
        )
        
        matches = []
        if results['ids'] and results['ids'][0]:
            for i, _ in enumerate(results['ids'][0]):
                matches.append(results['metadatas'][0][i])
        return matches