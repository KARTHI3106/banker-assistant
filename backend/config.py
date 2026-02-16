"""
Configuration Module
====================
Loads environment variables from .env file.
"""

import os
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:manaadithya%40123@localhost:3306/banker_verification",
)

JWT_SECRET = os.getenv("JWT_SECRET", "banker_face_verify_super_secret_key_2024")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRY_HOURS = int(os.getenv("JWT_EXPIRY_HOURS", "24"))
BCRYPT_ROUNDS = int(os.getenv("BCRYPT_ROUNDS", "12"))
