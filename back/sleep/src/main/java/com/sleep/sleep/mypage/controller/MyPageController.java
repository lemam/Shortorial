package com.sleep.sleep.mypage.controller;

import com.sleep.sleep.common.JWT.JwtTokenUtil;
import com.sleep.sleep.mypage.dto.MyPageDto;
import com.sleep.sleep.mypage.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/mypage")
@RestController
@RequiredArgsConstructor
@Slf4j
public class MyPageController {

    private final MyPageService myPageService;
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


    private String resolveToken(String accessToken) {
        log.info("resolveToken, AccessToken: "+ accessToken.toString());
        return accessToken.substring(7);
    }

}
