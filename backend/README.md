# DocAssist AI Backend

FastAPI backend for the DocAssist AI document assistant application.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000

API documentation (Swagger UI): http://localhost:8000/docs

## API Endpoints

- `GET /` - Root endpoint
- `POST /upload` - Upload a document
- `GET /documents` - Get all uploaded documents
- `DELETE /documents/{document_id}` - Delete a document
- `POST /chat` - Send a chat message
- `GET /chat/history` - Get chat history

## CORS Configuration

CORS is enabled for the following origins:
- http://localhost:5173 (Vite default)
- http://localhost:3000 (Create React App default)

To add more origins, edit the `allow_origins` list in `main.py`.

## Notes

- File uploads are stored in the `uploads/` directory
- The current implementation uses in-memory storage for documents and chat history
- For production, replace with a proper database (PostgreSQL, MongoDB, etc.)
- The AI response is currently a placeholder - integrate with your preferred LLM service (OpenAI, LangChain, etc.)
