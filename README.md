# SARP — Local AI Conversational App

A CLI and web application for immersive roleplay conversations with AI-powered characters. It supports multiple LLM providers (OpenAI, Anthropic Claude, Ollama, and DeepSeek), persistent sessions, and customizable personalities.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

### **Languages**
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![REACT](https://img.shields.io/badge/-ReactJs-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![JAVASCRIPT](https://shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=000)

### **Tools**
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
[![Ollama](https://img.shields.io/badge/Ollama-fff?style=for-the-badge&logo=ollama&logoColor=000)](#)
## Features

- **Multiple AI Providers**: Works with OpenAI, Anthropic Claude, Deepseek and local Ollama models
- **Persistent Sessions**: Conversations are saved locally and can be resumed later
- **Custom Personalities**: Create and select different character personas
- **Memory Management**: Automatic conversation trimming and summarization

## Requirements

- Python 3.11+ (tested on 3.13)
- Node.js 18+ and npm
- API key for your chosen provider (OpenAI, Anthropic, or an Ollama-compatible provider)

## Quick Start

### 1. Set up Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Linux/macOS:**
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```env
API_KEY=your_api_key_here
PROVIDER=openai
MODEL_NAME=gpt-4o-mini
```

**Provider Options:**
- `openai` - OpenAI GPT models
- `anthropic` - Anthropic Claude models
- `ollama` - Local Ollama models

### 3. Run the Application

From the project root, start both the backend and frontend with:

```powershell
npm run fboth
```

You can also run them separately:

```powershell
npm run backend
npm run frontend
```

## Usage

1. **Select or Create a Persona**: On startup, choose an existing personality or create a new one
2. **Start Chatting**: Type your message and press Enter
3. **Exit**: Type `Exit` to save your session and quit

## Project Structure

```text
Backend/
├── App/
│   ├── api/
│   │   ├── chat_router.py
│   │   ├── chronicle_router.py
│   │   └── documents_router.py
│   ├── models/
│   │   ├── dbbase.py
│   │   ├── models.py
│   │   └── rpg_sessions.py
│   ├── services/
│   │   ├── documents.py
│   │   ├── ingestion.py
│   │   └── vectorstore.py
│   ├── main.py
│   ├── chat.py
│   ├── cli.py
│   ├── config.py
│   ├── database.py
│   ├── memory.py
│   ├── personalities.py
│   └── response.py
├── tests/
│   ├── conftest.py
│   └── test_*.py

frontend/
├── src/
│   ├── components/
│   ├── api.js
│   ├── App.jsx
│   └── index.jsx
├── index.html
└── package.json
```

## Dependencies

- **aisuite** - Unified interface for multiple LLM providers
- **python-dotenv** - Environment variable management
- **pytest** - Testing framework

## Testing

Run the test suite:

```powershell
cd Backend
pytest
```

## Troubleshooting

### JSON Circular Reference Error
If you see a "Circular reference detected" error, ensure the `messages` list passed to `get_response()` is a flat list of message dictionaries with no nested objects.

### Session Growing Too Large
The app uses summarization and trimming to manage conversation history. If sessions grow unexpectedly large:
- Increase trimming frequency in `memory.py`
- Shorten saved history

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests locally
5. Open a pull request with a clear description

## License

See [license](license) file for details.
