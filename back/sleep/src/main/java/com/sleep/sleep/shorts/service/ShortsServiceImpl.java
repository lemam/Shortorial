package com.sleep.sleep.shorts.service;

import com.sleep.sleep.member.entity.Member;
import com.sleep.sleep.member.repository.MemberRepository;
import com.sleep.sleep.shorts.dto.PaginationShortsDto;
import com.sleep.sleep.shorts.dto.ShortsDto;
import com.sleep.sleep.shorts.dto.UploadShortsDto;
import com.sleep.sleep.shorts.entity.*;
import com.sleep.sleep.shorts.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = false)
@Slf4j
public class ShortsServiceImpl implements ShortsService{

    private final ShortsRepository shortsRepository;
    private final UploadShortsRepository uploadShortsRepository;
    private final MemberRepository memberRepository;
    private final TryShortsRepository tryShortsRepository;
    private final MusicSingerRepository musicSingerRepository;
    private final MusicRepository musicRepository;
    private final SingerRepository singerRepository;

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
        shortsInfo.setShortDate(shorts.getShortsDate());

        int musicNo = shorts.getMusicNo();
        Music music = musicRepository.findByMusicNo(musicNo);

        MusicSinger musicSinger= musicSingerRepository.findByMusicNo(musicNo);

        Singer singer = singerRepository.findBySingerNo(musicSinger.getSingerNo());

        shortsInfo.setMusicName(music.getMusicName());
        shortsInfo.setSingerName(singer.getSingerName());

        return shortsInfo;
    }

    /**
     * 페이지별 쇼츠 리스트 조회
     * @param page 조회하고 싶은 페이지 번호
     * @param size 한 페이지 안의 콘텐츠 크기
     * @return 한 페이지 범위의 Shorts 리스트를 담은 PagenationShortsDto
     */
    public PaginationShortsDto getShortList(int page, int size) {
        List<Shorts> shorts = shortsRepository.findShortList();

        PaginationShortsDto result = new PaginationShortsDto();
        List<ShortsDto> shortsList = new ArrayList<>();

        int start = page * size;            // 조회 시작 범위
        int end = (page + 1) * size - 1;    // 조회 끝 범위
        boolean isLastPage = false;

        // 끝 범위가 리스트 범위를 벗어나면 끝 범위를 마지막 인덱스로 설정한다.
        if (end >= shorts.size()) {
            end = shorts.size() - 1;
            isLastPage = true;
        }

        // 범위에 있는 Shorts 정보들을 shortsList에 저장한다.
        for(int i = start; i <= end; i++){
            Shorts value = shorts.get(i);
            ShortsDto shortsDto = new ShortsDto();

            shortsDto.setShortsNo(value.getShortsNo());
            shortsDto.setShortsUrl(value.getShortsUrl());
            shortsDto.setShortsTime(value.getShortsTime());
            shortsDto.setShortsTitle(value.getShortsTitle());
            shortsDto.setShortsDirector(value.getShortsDirector());
            shortsDto.setShortsChallengers(value.getShortsChallengers());
            shortsDto.setShortsLink(value.getShortsLink());
            shortsDto.setShortDate(value.getShortsDate());

            int musicNo = value.getMusicNo();
            Music music = musicRepository.findByMusicNo(musicNo);
            MusicSinger musicSinger= musicSingerRepository.findByMusicNo(musicNo);
            Singer singer = singerRepository.findBySingerNo(musicSinger.getSingerNo());
            shortsDto.setMusicName(music.getMusicName());
            shortsDto.setSingerName(singer.getSingerName());

            shortsList.add(shortsDto);
        }

        result.setContents(shortsList);
        result.setLastPage(isLastPage);

        return result;
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
            shortsDto.setShortDate(value.getShortsDate());

            int musicNo = value.getMusicNo();
            Music music = musicRepository.findByMusicNo(musicNo);
            MusicSinger musicSinger= musicSingerRepository.findByMusicNo(musicNo);
            Singer singer = singerRepository.findBySingerNo(musicSinger.getSingerNo());
            shortsDto.setMusicName(music.getMusicName());
            shortsDto.setSingerName(singer.getSingerName());

            shortsList.add(shortsDto);
        }
        return shortsList;
    }

    @Override
    public List<ShortsDto> getShortRankingList() {
        List<Shorts> shorts = shortsRepository.findShortTopRanking();

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
            shortsDto.setShortDate(value.getShortsDate());

            int musicNo = value.getMusicNo();
            Music music = musicRepository.findByMusicNo(musicNo);
            MusicSinger musicSinger= musicSingerRepository.findByMusicNo(musicNo);
            Singer singer = singerRepository.findBySingerNo(musicSinger.getSingerNo());
            shortsDto.setMusicName(music.getMusicName());
            shortsDto.setSingerName(singer.getSingerName());

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
            UploadShortsDto.setYoutubeUrl(value.getYoutubeUrl());

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

    public void deleteUploadShorts(int uploadNo, String fileName){
        UploadShorts uploadShorts = uploadShortsRepository.findByUploadTitle(uploadNo, fileName);
        if (uploadShorts != null) {
            uploadShortsRepository.delete(uploadShorts);
        }
    }

    @Transactional
    public void addTryCount(String username, int shortsNo) {
        // 멤버 찾기
        Member member = memberRepository.findByMemberId(username)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));
        log.info("member " + member.getMemberIndex());

        // 쇼츠 찾기
        Shorts shorts = shortsRepository.findById(shortsNo)
                .orElseThrow(() -> new IllegalArgumentException("Shorts not found"));
        log.info("shorts " + shorts.getShortsNo());

        // 해당 멤버와 쇼츠에 대한 시도 찾기
        Optional<TryShorts> tryShortsOpt = tryShortsRepository.findByMemberIndexAndShortsNo(member.getMemberIndex(), shorts.getShortsNo());

        if (!tryShortsOpt.isPresent()) {
            // 시도가 없으면 새로 생성
            shorts.addShortsChallengers(1);

            // TryShorts 엔티티 생성 및 저장
            TryShorts tryShorts = TryShorts.builder()
                    .memberIndex(member)
                    .shortsNo(shorts)
                    .build();
            tryShortsRepository.save(tryShorts);
            log.info("New tryShorts created for shortsNo: " + tryShorts.getShortsNo());
        } else {
            TryShorts tryShorts = tryShortsOpt.get();
            // 시도가 이미 있으면 uploadDate를 현재 시간으로 수정
            tryShorts.setUploadDate(LocalDateTime.now());
            tryShortsRepository.save(tryShorts);
            log.info("UploadDate updated for tryShorts with shortsNo: " + tryShorts.getShortsNo());
        }
    }

    public List<ShortsDto> getTryShortsList(String username){
        // 시도한 영상 리스트 가져오기

        // 회원 번호 조회
        int memberNo = memberRepository.findByMemberId(username)
                .orElseThrow(() -> new IllegalArgumentException("Member not found")).getMemberIndex();

        // 시도한 영상 리스트 조회
        List<TryShorts> tryShortsList = tryShortsRepository.findTryShortList(memberNo);

        // 시도한 영상 리스트를 담을 DTO 리스트
        List<ShortsDto> shortsDtoList = new ArrayList<>();

        // 시도한 영상 리스트를 순회하면서 DTO에 데이터 추가
        for(TryShorts tryShorts : tryShortsList){
            ShortsDto shortsDto = new ShortsDto();

            // 시도한 영상의 ShortsNo를 사용하여 Shorts 엔티티 조회
            Shorts shorts = tryShorts.getShortsNo();

            // Shorts 엔티티의 데이터를 DTO에 추가
            shortsDto.setShortsNo(shorts.getShortsNo());
            shortsDto.setShortsUrl(shorts.getShortsUrl());
            shortsDto.setShortsTime(shorts.getShortsTime());
            shortsDto.setShortsTitle(shorts.getShortsTitle());
            shortsDto.setShortsDirector(shorts.getShortsDirector());
            shortsDto.setShortsChallengers(shorts.getShortsChallengers());
            shortsDto.setShortsLink(shorts.getShortsLink());
            shortsDto.setShortDate(shorts.getShortsDate());

            int musicNo = shorts.getMusicNo();
            Music music = musicRepository.findByMusicNo(musicNo);
            MusicSinger musicSinger= musicSingerRepository.findByMusicNo(musicNo);
            Singer singer = singerRepository.findBySingerNo(musicSinger.getSingerNo());
            shortsDto.setMusicName(music.getMusicName());
            shortsDto.setSingerName(singer.getSingerName());

            // DTO 리스트에 DTO 추가
            shortsDtoList.add(shortsDto);
        }

        return shortsDtoList;
    }

    public void putYoutubeUrl(int uploadNo,String url){
        UploadShorts uploadShorts = uploadShortsRepository.findByUploadNo(uploadNo);

        if (uploadShorts != null) {

            uploadShorts.putYoutubeUrl(url);

            uploadShortsRepository.save(uploadShorts);
        }
    }

}
