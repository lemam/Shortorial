from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from .db_config import Config

# 앱 초기화
def create_app():
    app = Flask(__name__)
    return app

def init_db():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db = SQLAlchemy()
    db.init_app(app)
    return app, db


