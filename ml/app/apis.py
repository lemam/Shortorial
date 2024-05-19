from . import db_app, db
import pandas as pd

def get_user_id(userId):
    with db_app.app_context():
        sql_query = "SELECT member_no FROM member where member_id = '{}'".format(userId)
        rslt = pd.read_sql(sql_query, con=db.engine)
        return rslt.iloc[0,0]
    
def get_user_info():
    with db_app.app_context():
        sql_query = "SELECT * FROM member"
        return pd.read_sql(sql_query, con=db.engine)

def get_music_list():
    with db_app.app_context():
        sql_query = "SELECT * FROM music_info"
        return pd.read_sql(sql_query, con=db.engine)

def get_try_shorts():
    with db_app.app_context():
        sql_query = "SELECT * FROM try_shorts"
        return pd.read_sql(sql_query, con=db.engine)

def get_music_info(music_list):
    with db_app.app_context():
        # music_list에 있는 음악 번호를 콤마로 구분하여 플레이스홀더에 넣습니다.
        placeholders = ','.join(map(str, music_list))
        # SQL 쿼리에서 IN 연산자와 함께 플레이스홀더를 사용합니다.
        sql_query = f"select music_data.*, music_info.music_name from (select music_singer.*, singer_info.singer_name from (select short.*, music_singer.singer_no from (select * from shorts where shorts_no IN ({placeholders})) short, music_singer where short.music_no = music_singer.music_no) music_singer, singer_info where music_singer.singer_no = singer_info.singer_no) music_data, music_info where music_data.music_no = music_info.music_no;"
        return pd.read_sql(sql_query, con=db.engine)