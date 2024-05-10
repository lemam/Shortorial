package com.sleep.sleep.mypage.service;

import com.sleep.sleep.mypage.dto.MyPageDto;
import org.springframework.stereotype.Service;


public interface MyPageService {
    //내 정보 조회
    MyPageDto getMyInfo(int memberIndex);
    //내가 찍은 챌린지 원본 조회
    int tryShortsCount();
    //내가 저장한 영상
    int uploadShortsCount();
}
