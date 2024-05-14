package com.sleep.sleep.mypage.service;

import java.util.Map;

public interface MyPageService {
    //사용자 카운트
    public Map<String,Integer> getCount(String username);
}
