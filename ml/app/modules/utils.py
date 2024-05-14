
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