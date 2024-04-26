package com.sleep.sleep.mypage.service;

import com.sleep.sleep.mypage.dto.MyPageDto;

public interface MyPageService {
    //내 정보 조회
    MyPageDto getMyInfo(int memberIndex);
    //시도한 숏폼 카은트
    int tryShortsCount();
    //게시한 숏폼 카운트
    int uploadShortsCount();
}
