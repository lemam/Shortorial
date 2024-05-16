import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    JSON_AS_ASCII = False

    db_config = {
        'host': os.getenv("DB_SERVER_NAME"),  
        'port': os.getenv("DB_SERVER_PORT"),        
        'user': os.getenv("DB_USER_NAME"),  
        'password': os.getenv("DB_PASSWORD"),
        'database': os.getenv("DB_DATABASE"),
    }

    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}"
    SQLALCHEMY_TRACK_MODIFICATIONS = True