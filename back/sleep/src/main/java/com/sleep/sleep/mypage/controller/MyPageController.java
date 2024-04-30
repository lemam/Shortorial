package com.sleep.sleep.mypage.controller;

import com.sleep.sleep.mypage.dto.MyPageDto;
import com.sleep.sleep.mypage.service.MyPageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/api/mypage")
@Controller
public class MyPageController {

    private MyPageService myPageService;

    @GetMapping("/info")
    public ResponseEntity<?> getMyInfo(HttpServletRequest request){
        try{
            //사용자 찾기
//            int accessMemberIndex = (int)request.getAttribute("accessMemberIndex");
//            int memberIndex = memberService.findVipsOfMmeber(accessMemberIndex);
            int memberIndex=1;
            MyPageDto myPageDto = new MyPageDto("ssafy",1,1,1);
            return new ResponseEntity<MyPageDto>(myPageDto, HttpStatus.OK);

        }catch (Exception e){
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
