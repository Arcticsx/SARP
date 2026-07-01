import uvicorn
import sys

if __name__ == '__main__':
    uvicorn.run("api.chat_router:app", host="0.0.0.0", port=8000, reload=True)
    