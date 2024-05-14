import os
from dotenv import load_dotenv
from flask import Flask
from ..models.recommend_music import get_recommend_music, train_model

def create_app():
    app = Flask(__name__)
    
    # 노래 추천 결과 받기
    @app.route("/pyapi/music/<int:userId>", method=["GET"])    
    def recommend_music(userId):
        music_list = get_recommend_music(userId)
        return music_list
    
    # 학습
    @app.route("pyapy/music/train/<int:musicId>", method=["POST"])
    def train(musicId, userId):
        train_model(userId)
        
    return app

if __name__ == "__main__":
    load_dotenv()
    app = create_app()
    app.run(os.getenv("SERVER_NAME"), port = os.getenv("SERVER_PORT"), debug = True)