package com.sleep.sleep.mypage.controller;

import com.sleep.sleep.common.JWT.JwtTokenUtil;
import com.sleep.sleep.mypage.dto.MyPageDto;
import com.sleep.sleep.mypage.service.MyPageService;
import com.sleep.sleep.shorts.dto.ShortsDto;
import com.sleep.sleep.shorts.dto.TryShortsDto;
import com.sleep.sleep.shorts.dto.UploadShortsDto;
import com.sleep.sleep.shorts.service.ShortsService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api/mypage")
@RestController
@RequiredArgsConstructor
@Slf4j
public class MyPageController {

    private final MyPageService myPageService;
    private final ShortsService shortsService;
    private final JwtTokenUtil jwtTokenUtil;

    @GetMapping("/info")
    public ResponseEntity<?> getMyInfo(@RequestHeader("Authorization") String accessToken){
        try{
            //사용자 찾기
            System.out.println(accessToken.toString());
            String username = jwtTokenUtil.getUsername(resolveToken(accessToken));
            System.out.println("username : "+ username);
            MyPageDto myPageDto = new MyPageDto("ssafy",1,1);
            return new ResponseEntity<MyPageDto>(myPageDto, HttpStatus.OK);

        }catch (Exception e){
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "사용자의 업로드한 영상 리스트", description ="사용자의 엑세스 토큰 필요함")
    @GetMapping("/upload-shorts")
    public ResponseEntity<List<UploadShortsDto>> selectUploadShortList(@RequestHeader("Authorization") String accessToken) {
        //사용자 찾기
        String username = jwtTokenUtil.getUsername(resolveToken(accessToken));
        System.out.println("username : "+ username);

        List<UploadShortsDto> shortsList = shortsService.getUploadShortsList(username);

        return ResponseEntity.ok(shortsList);
    }

    @Operation(summary = "사용자가 시도한 영상 리스트", description ="사용자의 엑세스 토큰 필요함")
    @GetMapping("/try-shorts")
    public ResponseEntity<List<TryShortsDto>> selectTryShortList(@RequestHeader("Authorization") String accessToken) {
        //사용자 찾기
        String username = jwtTokenUtil.getUsername(resolveToken(accessToken));
        System.out.println("username : "+ username);

        List<TryShortsDto> shortsList = shortsService.getTryShortsList(username);

        return ResponseEntity.ok(shortsList);
    }


    private String resolveToken(String accessToken) {
        log.info("resolveToken, AccessToken: "+ accessToken.toString());
        return accessToken.substring(7);
    }

}
