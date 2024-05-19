import os
from dotenv import load_dotenv
from flask import jsonify, request
from flask_cors import CORS

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
        music_list_dict = music_list.to_dict(orient="records")
        
        for music_dict in music_list_dict:
            music_dict["musicNo"] = music_dict.pop("music_no")
            music_dict["shortsChallengers"] = music_dict.pop("shorts_challengers")
            music_dict["shortsDate"] = music_dict.pop("shorts_date")
            music_dict["shortsDirector"] = music_dict.pop("shorts_director")
            music_dict["shortsLink"] = music_dict.pop("shorts_link")
            music_dict["shortsNo"] = music_dict.pop("shorts_no")
            music_dict["shortsTime"] = music_dict.pop("shorts_time")
            music_dict["shortsTitle"] = music_dict.pop("shorts_title")
            music_dict["shortsUrl"] = music_dict.pop("shorts_url")        
                       
        return jsonify(music_list_dict)

if __name__ == "__main__":
    load_dotenv()
    app = create_app()
    CORS(app)
    setting_app(app)
    pre_train()
    app.run(host = os.getenv("SERVER_NAME"), port = os.getenv("SERVER_PORT"), debug = True)