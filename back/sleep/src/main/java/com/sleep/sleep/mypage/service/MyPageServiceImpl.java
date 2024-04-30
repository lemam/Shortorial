package com.sleep.sleep.mypage.service;

import com.sleep.sleep.member.repository.MemberRepository;
import com.sleep.sleep.mypage.dto.MyPageDto;
import com.sleep.sleep.shorts.repository.TryShortsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@RequiredArgsConstructor
@Service
public class MyPageServiceImpl implements MyPageService{
    private final MemberRepository memberRepository;
    private final TryShortsRepository tryShortsRepository;
    //내 정보 조회
    @Override
    public MyPageDto getMyInfo(int memberIndex) {
        //memberNickname : string,
        //memberProfile : string,
        //tryMusic : int,
        //completeMusic : int
//        memberRepository.getMemberNickname

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
