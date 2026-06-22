from dotenv import load_dotenv
import os

load_dotenv()

MODEL = os.getenv("MODEL_NAME")
MONGO_URI = os.getenv("MONGO_URI")