package com.sleep.sleep.shorts.service;

import com.sleep.sleep.member.dto.JoinDto;
import com.sleep.sleep.member.entity.Member;
import com.sleep.sleep.member.entity.MemberRole;
import com.sleep.sleep.member.repository.MemberRepository;
import com.sleep.sleep.shorts.dto.ShortsDto;
import com.sleep.sleep.shorts.dto.UploadShortsDto;
import com.sleep.sleep.shorts.entity.Shorts;
import com.sleep.sleep.shorts.entity.UploadShorts;
import com.sleep.sleep.shorts.repository.ShortsRepository;
import com.sleep.sleep.shorts.repository.UploadShortsRepository;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = false)
public class ShortsServiceImpl implements ShortsService{

    private final ShortsRepository shortsRepository;
    private final UploadShortsRepository uploadShortsRepository;
    private final MemberRepository memberRepository;

    //예측 리스트 조회
    public List<ShortsDto> getShortList() {
        List<Shorts> shorts = shortsRepository.findShortList();

        List<ShortsDto> shortsList = new ArrayList<>();

        for(Shorts value : shorts){
            ShortsDto shortsDto = new ShortsDto();

            shortsDto.setShortsNo(value.getShortsNo());
            shortsDto.setShortsUrl(value.getShortsUrl());
            shortsDto.setShortsTime(value.getShortsTime());
            shortsDto.setShortsTitle(value.getShortsTitle());
            shortsDto.setShortsDirector(value.getShortsDirector());
            shortsDto.setShortsChallengers(value.getShortsChallengers());
            shortsDto.setShortsLink(value.getShortsLink());
            shortsList.add(shortsDto);
        }
        return shortsList;
    }

    public List<UploadShortsDto> getUploadShortsList(String memberId){
        List<UploadShorts> shorts = uploadShortsRepository.findUploadShortList(memberId);

        List<UploadShortsDto> uploadShorts = new ArrayList<>();


        return uploadShorts;
    }

    public void upload(UploadShortsDto dto, String username) {
        Member member = memberRepository.findByMemberId(username)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));
        uploadShortsRepository.save(UploadShorts.builder()
                .memberIndex(member)
                .uploadUrl(dto.getUploadUrl())
                .uploadTitle(dto.getUploadTitle())
                .build());;
    }


}
