package com.sleep.sleep.shorts.service;

import com.sleep.sleep.shorts.dto.ShortsDto;
import com.sleep.sleep.shorts.entity.Shorts;
import com.sleep.sleep.shorts.repository.ShortsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ShortsService {

    private final ShortsRepository shortsRepository;

    public ShortsService(ShortsRepository shortsRepository) {
        this.shortsRepository = shortsRepository;
    }

    //쇼츠 리스트 조회
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
            shortsDto.setShortDate(value.getShortDate());
            shortsList.add(shortsDto);
        }
        return shortsList;
     }

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

}
