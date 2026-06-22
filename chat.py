import ollama
from config import MODEL
from memory import trim_memory
from personalities import pick_personality, textPrompt
from database import save_session, pick_session
from cli import header, print_message, prompt_input, info

def run():
    
    persona = pick_personality()
    header(f"Now chatting with {persona['name']}")
    print("Type 'Exit' to quit.\n")

    system_message = {
        "role": "system",
        "content": persona["system"] + "\n\n" + textPrompt
    }

    # Try to resume an existing session
    existing_session = pick_session(persona["name"])

    if existing_session:
        # Restore messages but replace the system prompt with the current one
        messages = [system_message] + [
            msg for msg in existing_session["messages"]
            if msg["role"] != "system"
        ]
        print(f"Resuming session from {existing_session['created_at'].strftime('%Y-%m-%d %H:%M')}.\n")

        # Reprint the conversation history so the user has context
        for msg in messages:
            print_message(msg["role"], persona["name"], msg["content"])
        print()
    else:
        messages = [system_message]

        # Generate first message dynamically
        opening_prompt = persona.get("opening_prompt", "Introduce yourself and start the conversation.")
        first_msg_prompt = messages + [{"role": "user", "content": opening_prompt}]
        response = ollama.chat(model=MODEL, messages=first_msg_prompt)
        first_msg = response["message"]["content"]

        print_message("assistant", persona["name"], first_msg)
        messages.append({"role": "assistant", "content": first_msg})

    # Track whether user sent any messages during this run
    initial_user_count = sum(1 for m in messages if m.get("role") == "user")

    while True:
        user_input = prompt_input("You:")
        if user_input == 'Exit':
            # Determine if any new user messages were sent in this run
            current_user_count = sum(1 for m in messages if m.get("role") == "user")
            if current_user_count > initial_user_count:
                # If we resumed an existing session, update it instead of creating a new one
                if existing_session:
                    save_session(persona["name"], messages, existing_session.get("_id"))
                else:
                    save_session(persona["name"], messages)
            else:
                info("No new user messages — session not saved.")
            print("Exiting...")
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
        print_message("assistant", persona["name"], assistant_msg)

        messages.append({
            "role": "assistant",
            "content": assistant_msg
        })

        # memory limit
        trim_memory(messages, messages[0])