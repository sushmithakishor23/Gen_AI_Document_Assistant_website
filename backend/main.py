from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime
import os
import shutil

app = FastAPI(title="DocAssist AI Backend")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# In-memory storage (replace with database in production)
documents_db = {}
chat_history_db = []


# Pydantic models
class ChatRequest(BaseModel):
    message: str
    document_id: Optional[str] = None


class ChatResponse(BaseModel):
    message: str
    timestamp: str


class Document(BaseModel):
    id: str
    filename: str
    filepath: str
    uploaded_at: str
    size: int


# Routes
@app.get("/")
async def root():
    return {"message": "DocAssist AI Backend API"}


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload a document"""
    try:
        # Generate unique ID
        doc_id = str(uuid.uuid4())
        
        # Save file
        file_path = os.path.join(UPLOAD_DIR, f"{doc_id}_{file.filename}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        # Store document metadata
        document = {
            "id": doc_id,
            "filename": file.filename,
            "filepath": file_path,
            "uploaded_at": datetime.now().isoformat(),
            "size": file_size,
        }
        documents_db[doc_id] = document
        
        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.get("/documents")
async def get_documents():
    """Get list of all uploaded documents"""
    return list(documents_db.values())


@app.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document"""
    if document_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete file
    document = documents_db[document_id]
    if os.path.exists(document["filepath"]):
        os.remove(document["filepath"])
    
    # Remove from database
    del documents_db[document_id]
    
    return {"message": "Document deleted successfully"}


@app.post("/chat")
async def chat(request: ChatRequest):
    """Send a chat message and get AI response"""
    try:
        # Store user message
        user_message = {
            "id": str(uuid.uuid4()),
            "role": "user",
            "content": request.message,
            "timestamp": datetime.now().isoformat(),
            "document_id": request.document_id,
        }
        chat_history_db.append(user_message)
        
        # Generate AI response (placeholder - implement actual AI logic here)
        context = ""
        if request.document_id and request.document_id in documents_db:
            doc = documents_db[request.document_id]
            context = f" (based on document: {doc['filename']})"
        
        ai_response = f"I received your message: '{request.message}'{context}. This is a placeholder response. Implement your AI logic here using LangChain, OpenAI, or other LLM services."
        
        # Store AI message
        assistant_message = {
            "id": str(uuid.uuid4()),
            "role": "assistant",
            "content": ai_response,
            "timestamp": datetime.now().isoformat(),
            "document_id": request.document_id,
        }
        chat_history_db.append(assistant_message)
        
        return ChatResponse(
            message=ai_response,
            timestamp=assistant_message["timestamp"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


@app.get("/chat/history")
async def get_chat_history(document_id: Optional[str] = None):
    """Get chat history, optionally filtered by document"""
    if document_id:
        return [msg for msg in chat_history_db if msg.get("document_id") == document_id]
    return chat_history_db


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
