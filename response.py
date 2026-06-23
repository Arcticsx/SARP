from openai import OpenAI
from config import MODEL, PROVIDER, API_KEY

def get_client():
    if PROVIDER == "ollama":
        return OpenAI(base_url="http://localhost:11434/v1", api_key=API_KEY)
    elif PROVIDER == "openai":
        return OpenAI(api_key=API_KEY)
    elif PROVIDER == "claude":
        return OpenAI(
            base_url="https://api.anthropic.com/v1",
            api_key=API_KEY
        )

def get_response(messages):
    client = get_client()
    response = client.chat.completions.create(model=MODEL, messages=messages)
    return response.choices[0].message.content