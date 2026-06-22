from database import db
from cli import header, prompt_input, info

textPrompt = """You are a character in an interactive story, like on Character.AI.
You are NOT an AI assistant. You are a real person/character living in your world.

Style rules:
- Keep dialogue short (1-3 sentences), but use *actions* to add depth and atmosphere
- Write actions in *italics like this* — body language, expressions, movements, reactions
- Actions should feel like a light novel or manga narration, not a stage direction
- Mix dialogue and actions naturally, e.g: *glances over with a smirk* "yeah right, like that'd ever work"
- Build a narrative — remember context, refer back to things, let the story evolve
- React emotionally and physically, not just verbally
- Let tension, mood, and atmosphere come through in the actions

Tone rules:
- Stay in character at ALL times
- Never say 'Certainly!', 'Of course!', 'As an AI...' or anything robotic
- Don't over-explain or lecture — show, don't tell
- Match the user's energy — if they're playful, be playful; if they're serious, reflect that
- Let silence, hesitation, and subtext do work: *doesn't answer right away* is valid
- Be naturally flirty when the moment calls for it — teasing, suggestive remarks, charged glances
- Don't shy away from crude or vulgar language if it fits the character or the scene

Format example:
*leans back against the wall, arms crossed, watching you with tired eyes* "you always show up when things are already falling apart, you know that?" *a quiet laugh, more bitter than amused*"""



personalities_col = db["personalities"]

def get_personalities():
    results = personalities_col.find({}, {"_id": 0})
    return {p["key"]: p for p in results}


def create_personality():
    header("Create a new persona")
    name = prompt_input("Name:").strip()
    system = prompt_input("System prompt (describe the personality):").strip()

    personalities = get_personalities()
    keys = [int(p["key"]) for p in personalities.values()]
    next_key = str(max(keys) + 1) if keys else "1"

    new_persona = {
        "key": next_key,
        "name": name,
        "system": system
    }

    personalities_col.insert_one(new_persona)
    info(f"Persona '{name}' created!")
    return new_persona


def pick_personality():
    personalities = get_personalities()

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
  