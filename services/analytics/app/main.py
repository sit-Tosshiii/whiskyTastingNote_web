from typing import List

from fastapi import Depends, FastAPI
from pydantic import BaseModel

app = FastAPI(title="Whisky Analytics API", version="0.1.0")


class NoteEmbeddingRequest(BaseModel):
    tokens: List[str]


class NoteEmbeddingResponse(BaseModel):
    embedding: List[float]


async def get_stub_embedding(request: NoteEmbeddingRequest) -> List[float]:
    # Placeholder for future Word2Vec + PCA pipeline
    _ = request
    return [0.0, 0.0]


@app.get("/health", tags=["system"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/embeddings", response_model=NoteEmbeddingResponse, tags=["analysis"])
async def generate_embedding(payload: NoteEmbeddingRequest) -> NoteEmbeddingResponse:
    embedding = await get_stub_embedding(payload)
    return NoteEmbeddingResponse(embedding=embedding)
