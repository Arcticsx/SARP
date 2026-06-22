import ollama
from config import MODEL


def summarize(messages):
  summary_prompt = [
      {
          "role": "system",
          "content": "You are a summarization assistant. Summarize the conversation clearly and in detail."
      },
      {
          "role": "user",
          "content": f"Summarize this chat:\n\n{messages}"
      }
  ]
  response = ollama.chat(
        model=MODEL,
        messages=summary_prompt,
    )

  return response["message"]["content"]

def trim_memory(messages, system_message):
    old = messages[1:-10]
    new = messages[-10:]
    summary = summarize(old)
    return [
        system_message,
        {"role": "system", "content": f"Conversation summary: {summary}"}
    ] + new
    