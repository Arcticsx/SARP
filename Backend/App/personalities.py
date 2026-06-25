# Manages persona selection and creation
from database import cursor, conn
from cli import header, prompt_input, info
from config import textPrompt

cursor.execute("""
CREATE TABLE IF NOT EXISTS personalities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    system TEXT,
    scenario TEXT,
    opening_prompt TEXT
)
""")

conn.commit()



def get_personalities():
    
    cursor.execute("""
        SELECT key, name, system, scenario, opening_prompt
        FROM personalities
    """)
    results = cursor.fetchall()

    return {
        row["key"]: {
            "key": row["key"],
            "name": row["name"],
            "system": row["system"],
            "Scenario": row["scenario"],
            "opening_prompt": row["opening_prompt"]
        }
        for row in results
    }


def create_personality():
    # Prompt the user to fill in a new persona and persist it to the DB
    header("Create a new persona")
    name = prompt_input("Name:").strip()
    system = prompt_input("System prompt (describe the personality):").strip()
    scenario = prompt_input("Scenario (describe the situation):").strip()
    firstMessage = prompt_input("First Message: ").strip()

    personalities = get_personalities()
    keys = [int(p["key"]) for p in personalities.values()]
    next_key = str(max(keys) + 1) if keys else "1"  # auto-increment key

    new_persona = {
        "key": next_key,
        "name": name,
        "system": system,
        "Scenario": scenario,
        "opening_prompt": firstMessage
    }

    cursor.execute("""
        INSERT INTO personalities
        (key, name, system, scenario, opening_prompt)
        VALUES (?, ?, ?, ?, ?)
    """, (
        new_persona["key"],
        new_persona["name"],
        new_persona["system"],
        new_persona["Scenario"],
        new_persona["opening_prompt"]
    ))
    conn.commit()
    info(f"Persona '{name}' created!")
    return new_persona


def pick_personality():
    # List available personas and let the user choose or create a new one
    personalities = get_personalities()
    
    if not personalities:
        info("No personas found. Let's create one.")
        return create_personality()

    header("Pick a personality")
    for key, val in personalities.items():
        print(f"  {key}. {val['name']}")
    print("  N. Create new persona")
    
    choice = prompt_input("Enter number or N:").strip().lower()

    if choice == "n":
        return create_personality()

    if choice not in personalities:
        info("Invalid choice, defaulting to first persona.")

    return personalities.get(choice, list(personalities.values())[0])
