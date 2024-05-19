from .apis import *
from .preprocessing import *

def pre_train():

    # 사용자 데이터 가져오기
    user_info = get_user_info()
    # 음악 데이터 가져오기
    music_info = get_music_list()
    # 시도한 쇼츠 영상 정보 가져오기
    try_shorts = get_try_shorts()
    
    # # 행 : 사용자 / 열: 노래 ---> 시도한적 있으면 1, 없으면 0
    user_try_shorts = make_user_shorts(user_info, music_info, try_shorts)
    
    # # 행 : 노래 / 열 : 작곡가
    # music_director = make_music_dataset("music_director", music_info)
    
    # # 행 : 노래 / 열 : 장르
    # music_genre = make_music_dataset("music_genre", music_info)
    
    # # 행 : 노래 / 열 : 가수
    # music_singer = make_music_dataset("singer_no", music_info)
    
    predict_R = start_predict(user_try_shorts)
       
    return predict_R



# def get_recommend_music(userId):
    
#     # 사용자가 선호하는 음악 리스트 가져오기
#     music_no = get_recommend_music_list(userId)
    
#     # # 음악 리스트에 포함된 음악 정보 가져오기
#     music_info = get_music_info(music_no)
#     print(music_info)
#     return music_info