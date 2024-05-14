import os
from dotenv import load_dotenv
from modules.app import create_app

if __name__ == "__main__":
    load_dotenv()
    app = create_app()
    app.run(host = os.getenv("SERVER_NAME"), port = os.getenv("SERVER_PORT"), debug = True)