import ollama
from config import MODEL
from memory import trim_memory
from personalities import pick_personality, textPrompt

def run():
    persona = pick_personality()
    messages = [
        {
            "role": "system",
            "content": persona["system"] + textPrompt
        }
    ]
    

    while True:
        user_input = input("You: ")
        if user_input == 'Exit':
          print("Exitting...")
          return

        messages.append({
            "role": "user",
            "content": user_input
        })

        response = ollama.chat(
            model=MODEL,
            messages=messages,
            
        )

        assistant_msg = response["message"]["content"]
        print("AI:", assistant_msg)

        messages.append({
            "role": "assistant",
            "content": assistant_msg
        })

        # memory limit
        trim_memory(messages, messages[0])