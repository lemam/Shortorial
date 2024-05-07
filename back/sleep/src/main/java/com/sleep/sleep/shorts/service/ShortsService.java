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
}
