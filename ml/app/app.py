import os
from dotenv import load_dotenv
from flask import Flask


def create_app():
    app = Flask(__name__)    
    return app

if __name__ == "__main__":
    load_dotenv()
    app = create_app()
    app.run(os.getenv("SERVER_NAME"), port = os.getenv("SERVER_PORT"), debug = True)