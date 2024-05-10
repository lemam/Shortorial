package com.sleep.sleep.mypage.dto;

import lombok.*;

@ToString
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MyPageDto {
    private String memberNickname ;
    private int memberProfile;
    private int tryCount;

    @Builder
    public MyPageDto(String memberNickname,int memberProfile,int tryCount){
        this.memberNickname=memberNickname;
        this.memberProfile=memberProfile;
        this.tryCount=tryCount;
    }

}
