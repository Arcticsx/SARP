import aisuite as ai
import time
from config import AISUITE_MODEL, PROVIDER, API_KEY

# aisuite reads provider API keys from environment variables automatically,
# but we pass explicit config for providers that need it (e.g. ollama base_url)
def get_client():
    provider_configs = {}
    if PROVIDER == "ollama":
        provider_configs["ollama"] = {"base_url": "http://localhost:11434/api"}
    return ai.Client(provider_configs=provider_configs if provider_configs else None)

def get_response(messages, retries=3, backoff=2):
    client = get_client()
    last_error = None

    for attempt in range(1, retries + 1):
        try:
            response = client.chat.completions.create(model=AISUITE_MODEL, messages=messages)
            choices = response.choices
            if not choices or choices[0].message.content is None:
                raise ValueError("Empty or malformed response from API")
            return choices[0].message.content

        except ValueError:
            raise

        except Exception as e:
            last_error = e
            err_str = str(e).lower()
            # Detect rate limit or server errors for retry; bail on auth/bad request
            if any(k in err_str for k in ("rate limit", "429", "500", "502", "503", "connection")):
                wait = backoff * attempt
                print(f"[API error] Retrying in {wait}s... (attempt {attempt}/{retries}): {e}")
                time.sleep(wait)
            else:
                raise

    raise RuntimeError(f"API call failed after {retries} attempts: {last_error}")
