package com.sleep.sleep.mypage.service;

import com.sleep.sleep.member.entity.Member;
import com.sleep.sleep.member.repository.MemberRepository;
import com.sleep.sleep.shorts.repository.TryShortsRepository;
import com.sleep.sleep.shorts.repository.UploadShortsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class MyPageServiceImpl implements MyPageService{
    private final MemberRepository memberRepository;
    private final TryShortsRepository tryShortsRepository;
    private final UploadShortsRepository uploadShortsRepository;

    public Map<String,Integer> getCount(String username) {
        Member member = memberRepository.findByMemberId(username)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));
        int memberIndex = member.getMemberIndex();

        Map<String, Integer> counts = new HashMap<>();

        counts.put("tryShortsCount", tryShortsRepository.countTryNoByMemberNo(memberIndex));
        counts.put("youtubeUrlCount", uploadShortsRepository.countYoutubeUrlByMemberIndex(memberIndex));
        counts.put("uploadShortsCount", uploadShortsRepository.countUploadShortsByMemberIndex(memberIndex));

        return counts;
    }

}
