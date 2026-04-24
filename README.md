# DocAssist AI - Full Stack Document Assistant

A full-stack AI-powered document assistant built with React (Vite) frontend and FastAPI backend.

## Features

- 📤 **Upload Documents**: Drag-and-drop interface for uploading PDF, DOC, DOCX, and TXT files
- 💬 **AI Chat**: Interactive chat interface to ask questions about your documents
- 📊 **Progress Tracking**: Real-time upload progress indicators
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🔄 **CORS Enabled**: Full integration between frontend and backend

## Project Structure

```
Gen_AI_Document_Assistant_website/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable components (Layout, Navbar)
│   │   ├── pages/        # Page components (Home, Upload, Chat)
│   │   └── services/     # API service layer
│   └── package.json
└── backend/           # FastAPI backend
    ├── main.py        # Main FastAPI application
    ├── requirements.txt
    └── uploads/       # Uploaded files directory
```

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python main.py
```

The backend will be available at: http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at: http://localhost:5173

## Usage

1. **Start both servers** (backend on port 8000, frontend on port 5173)
2. **Upload documents**: Navigate to the Upload page and drag-and-drop your files
3. **Chat with AI**: Go to the Chat page and start asking questions about your documents

## API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation (Swagger UI).

## Technologies Used

### Frontend
- React 19
- Vite
- React Router
- Axios
- React Dropzone
- Tailwind CSS
- Lucide React (icons)

### Backend
- FastAPI
- Uvicorn
- Pydantic
- Python Multipart

## Next Steps

The current implementation includes:
- ✅ File upload with drag-and-drop
- ✅ Upload progress tracking
- ✅ Chat interface
- ✅ CORS configuration
- ✅ Basic API endpoints

To enhance the application:
- [ ] Integrate with an LLM service (OpenAI, Anthropic, etc.)
- [ ] Add document processing (PDF parsing, text extraction)
- [ ] Implement vector database for semantic search
- [ ] Add user authentication
- [ ] Add persistent database (PostgreSQL/MongoDB)
- [ ] Deploy to production

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## License

MIT
