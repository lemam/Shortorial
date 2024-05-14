import os
from dotenv import load_dotenv
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy

from modules.db_config import Config
from modules.utils import parse_jwt
from ml.app.modules.models import get_recommend_music

# 앱 초기화
def create_app():
    app = Flask(__name__)
    db = SQLAlchemy()
    
    app.config.from_object(Config)
    db.init_app(app)

    # 노래 추천 결과 받기
    @app.route("/pyapi/music", methods=["GET"])    
    def recommend_music():
        access_token = request.headers.get("Authorization")
        userId = parse_jwt(access_token)
        music_list = recommend_music(userId)
        return music_list
    
    return app
