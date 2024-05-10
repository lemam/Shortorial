package com.sleep.sleep.shorts.service;

import com.sleep.sleep.shorts.dto.ShortsDto;
import com.sleep.sleep.shorts.dto.UploadShortsDto;
import java.util.List;
public interface ShortsService {

    //특정 쇼츠 조회
    public ShortsDto getShortsInfo(int shortsNo);
    //리스트 조회
     public List<ShortsDto> getShortList();

     //사용자의 업로드한 쇼츠 리스트
     public List<UploadShortsDto> getUploadShortsList(String memberId);

     //사용자가 업로드한 영상 DB에 넣기
    public void upload(UploadShortsDto dto,String username);
}
