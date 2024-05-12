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

    //특정 쇼츠 조회
    public ShortsDto getShortsInfo(int shortsNo) {
        Shorts shorts = shortsRepository.findByShortsNo(shortsNo);

        ShortsDto shortsInfo = new ShortsDto();

        shortsInfo.setShortsNo(shorts.getShortsNo());
        shortsInfo.setShortsUrl(shorts.getShortsUrl());
        shortsInfo.setShortsTitle(shorts.getShortsTitle());
        shortsInfo.setShortsDirector(shorts.getShortsDirector());
        shortsInfo.setShortsChallengers(shorts.getShortsChallengers());
        shortsInfo.setShortsTime(shorts.getShortsTime());
        shortsInfo.setShortsLink(shorts.getShortsLink());
        shortsInfo.setShortDate(shorts.getShortDate());

        return shortsInfo;
    }


    //리스트 조회
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

    public List<UploadShortsDto> getUploadShortsList(String username){
        int memberNo = memberRepository.findByMemberId(username)
                .orElseThrow(() -> new IllegalArgumentException("Member not found")).getMemberIndex();

        List<UploadShorts> shorts = uploadShortsRepository.findUploadShortList(memberNo);

        List<UploadShortsDto> uploadShorts = new ArrayList<>();

        for(UploadShorts value : shorts){
            UploadShortsDto UploadShortsDto = new UploadShortsDto();
            UploadShortsDto.setUploadNo(value.getUploadNo());
            UploadShortsDto.setMemberNo(memberNo);
            UploadShortsDto.setUploadUrl(value.getUploadUrl());
            UploadShortsDto.setUploadTitle(value.getUploadTitle());
            UploadShortsDto.setUploadDate(value.getUploadDate().toString());

            uploadShorts.add(UploadShortsDto);
        }
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

    public void putTitle(int uploadNo, String oldTitle, String newTitle, String newURL){
        UploadShorts uploadShorts = uploadShortsRepository.findByUploadTitle(uploadNo, oldTitle);

        if (uploadShorts != null) {

            uploadShorts.update(newTitle, newURL);

            uploadShortsRepository.save(uploadShorts);
        }

    }

    public boolean isNameExists(String title){
        return uploadShortsRepository.existsByUploadTitle(title);
    }


}
