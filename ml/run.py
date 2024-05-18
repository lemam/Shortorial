import os
from dotenv import load_dotenv
from flask import jsonify, request

from app.app import create_app
from app.models import pre_train
from app.preprocessing import get_recommend_music
from app.utils import parse_jwt

def setting_app(app):
    # 노래 추천 결과 받기
    @app.route("/pyapi/music", methods=["GET"])    
    def recommend_music():
        access_token = request.headers.get("Authorization")
        userId = parse_jwt(access_token)
        music_list = get_recommend_music(userId)
        return jsonify(music_list.to_dict(orient="records"))

if __name__ == "__main__":
    load_dotenv()
    app = create_app()
    setting_app(app)
    pre_train()
    app.run(host = os.getenv("SERVER_NAME"), port = os.getenv("SERVER_PORT"), debug = True)