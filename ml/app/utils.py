from sklearn.metrics import mean_squared_error
import pandas as pd
import numpy as np
import base64
import json

# access-token으로 사용자 정보 받아오기
def parse_jwt(token):
    # JWT 토큰은 세 개의 점을 기준으로 인코딩된 헤더, 페이로드, 서명으로 나누어져 있습니다.
    # 디코딩을 위해 페이로드 부분을 추출합니다.
    token_parts = token.split('.')
    if len(token_parts) != 3:
        return {'error': 'Invalid token format'}
    
    # 페이로드 부분을 base64 디코딩합니다.
    try:
        payload_base64 = token_parts[1]
        payload_bytes = base64.b64decode(payload_base64 + '==')
        payload = json.loads(payload_bytes)
        return payload["username"]
    except (IndexError, TypeError, json.JSONDecodeError):
        return {'error': 'Failed to parse token'}
    

def calculate_rmse(R, P, Q, non_zeros):
    error = 0

    full_pred_matrix = np.dot(P, Q.T)

    # 여기서 non_zeros는 아래 함수에서 확인할 수 있다.
    x_non_zero_ind = [non_zeros[0] for non_zeros in non_zeros]
    y_non_zero_ind = [non_zeros[1] for non_zeros in non_zeros]

    # 원 행렬 R에서 0이 아닌 값들만 추출한다.
    R_non_zeros = R[x_non_zero_ind, y_non_zero_ind]

    # 예측 행렬에서 원 행렬 R에서 0이 아닌 위치의 값들만 추출하여 저장한다.
    full_pred_matrix_non_zeros = full_pred_matrix[x_non_zero_ind, y_non_zero_ind]

    mse = mean_squared_error(R_non_zeros, full_pred_matrix_non_zeros)
    rmse = np.sqrt(mse)

    return rmse

def matrix_factorization(R, K, steps=200, learning_rate=0.01, r_lambda=0.01):
    num_users, num_items = R.shape

    np.random.seed(1)
    P = np.random.normal(scale=1.0/K, size=(num_users, K))
    Q = np.random.normal(scale=1.0/K, size=(num_items, K))
    
    # R>0인 행 위치, 열 위치, 값을 non_zeros 리스트에 저장한다.
    non_zeros = [ (i, j, R[i, j]) for i in range(num_users)
                  for j in range(num_items) if R[i, j] > 0 ]

    # SGD 기법으로 P, Q 매트릭스를 업데이트 함
    for step in range(steps):
        for i, j, r in non_zeros:
            # 잔차 구함
            eij = r - np.dot(P[i, :], Q[j, :].T)

            # Regulation을 반영한 SGD 업데이터 적용
            P[i, :] = P[i, :] + learning_rate*(eij * Q[j, :] - r_lambda*P[i, :])
            Q[j, :] = Q[j, :] + learning_rate*(eij * P[i, :] - r_lambda*Q[j, :])

        rmse = calculate_rmse(R, P, Q, non_zeros)
        # if step % 10 == 0:
        #     print("iter step: {0}, rmse: {1:4f}".format(step, rmse))

    return P, Q

# 예측 확률 구하기
# P, Q => matric_fac... 의 결과로 얻은 두개의 행렬
def predict(P, Q):
    return np.dot(P, Q.T)