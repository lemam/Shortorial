from ml.app.modules.apis import get_recommend_music_list, get_music_info

def train_model(userId):
    # spring에서 노래를 등록했으면
    # 그 DB 가져와서 행렬 만들기
    # 좋아하는 확률 구하기
    return



def get_recommend_music(userId):
    
    # 사용자가 선호하는 음악 리스트 가져오기
    music_no = get_recommend_music_list(userId)
    
    # 음악 리스트에 포함된 음악 정보 가져오기
    music_info = get_music_info(music_no)
    
    
    return True