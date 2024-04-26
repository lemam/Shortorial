package com.sleep.sleep.mypage.service;

import com.sleep.sleep.mypage.dto.MyPageDto;

public class MyPageServiceImpl implements MyPageService{
    //내 정보 조회
    @Override
    public MyPageDto getMyInfo(int memberIndex) {
        return null;
    }

    //시도한 숏폼 카은트
    @Override
    public int tryShortsCount() {
        return 0;
    }

    //게시한 숏폼 카운트
    @Override
    public int uploadShortsCount() {
        return 0;
    }
}
