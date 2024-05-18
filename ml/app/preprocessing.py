import pandas as pd
import numpy as np

from .apis import get_music_info, get_user_id
from .utils import matrix_factorization, predict

global predicted_R

def make_user_shorts(user_info, music_info, try_shorts):
    
    user_shorts = pd.DataFrame(0, index = [idx for idx in range(0, user_info.iloc[:,0].max())] , columns = [ col for col in range(0, int(music_info.iloc[:,0].max()))])
    for row in range(0, try_shorts.shape[0]):
        new_row = int(try_shorts.iloc[row,2]-1)
        new_col = int(try_shorts.iloc[row,3]-1) 
        user_shorts.iloc[new_row, new_col] += 1
    return user_shorts

def make_music_dataset(column_name, dataset):
    
    try:
        column_index = dataset.columns.get_loc(column_name)
    except KeyError:
        return -1
    
    df = pd.DataFrame(0, index = [idx for idx in range(0, dataset.iloc[:,0].max()+1)], columns = [ col for col in range(0, dataset.iloc[:,column_index].max()+1)])
    for row in dataset.iloc[:, 0]:
        new_row = int(row-1)
        new_col = int(df.iloc[row-1, column_index])
        df.iloc[new_row, new_col] += 1
        
    return df

def start_predict(dataset,  K=51 ,learning_rate = 0.01, steps = 500 ):
    dataset_np = dataset.to_numpy()
    P, Q = matrix_factorization(dataset_np, K=K ,learning_rate = learning_rate, steps = steps)
    global predicted_R
    predicted_R = predict(P,Q)
    return predicted_R

    
def get_recommend_music_list(user_Id):
    userId = get_user_id(user_Id)
    global predicted_R
    user_predict_R = predicted_R[userId].copy()
    music_idx = []
    for num in range(0, 3):
        max_idx = np.argmax(user_predict_R)  # 최대값의 인덱스를 찾습니다.
        if user_predict_R[max_idx] < 0 or user_predict_R[max_idx] == 0 : break
        user_predict_R[max_idx] = 0
        music_idx.append(max_idx+1)  # 리스트에 값을 추가할 때에는 append()를 사용합니다.
    return music_idx

    # global predicted_R
    # user_predict_R = predicted_R[userId].copy()  # 원본 데이터프레임의 깊은 복사본을 만듭니다.
    # music_idx = []
    # for num in range(0, 3):
    #     max_val = -1  # 최대값을 저장할 변수를 초기화합니다.
    #     max_idx = -1  # 최대값의 인덱스를 저장할 변수를 초기화합니다.
    #     for i in range(0, user_predict_R.shape[0]):  # 열의 개수가 아니라 행의 개수를 확인해야 합니다.
    #         if max_val < user_predict_R[i]:
    #             max_val = user_predict_R[i]
    #             max_idx = i
    #     user_predict_R[max_idx] = -1
    #     music_idx.append(max_idx)  # 리스트에 값을 추가할 때에는 append()를 사용합니다.
    # return music_idx



def get_recommend_music(userId):
    
    # 사용자가 선호하는 음악 리스트 가져오기
    music_no = get_recommend_music_list(userId)
    
    # # 음악 리스트에 포함된 음악 정보 가져오기
    music_info = get_music_info(music_no)
    
    return music_info