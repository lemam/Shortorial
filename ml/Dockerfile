# 기본 Python 이미지 사용
FROM python:3.11

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 Python 라이브러리 설치
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 앱 코드 복사
COPY . .

# Flask 앱 실행
CMD ["python", "run.py"]
