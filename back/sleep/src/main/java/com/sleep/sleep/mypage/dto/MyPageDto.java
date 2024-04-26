package com.sleep.sleep.mypage.dto;

import lombok.*;

@ToString
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MyPageDto {
    private String memberNickname ;
    private String memberProfile;
    private int tryCount;
    private int completeCount;

    @Builder
    public MyPageDto(String memberNickname,String memberProfile,int tryCount, int completeCount){
        this.memberNickname=memberNickname;
        this.memberProfile=memberProfile;
        this.tryCount=tryCount;
        this.completeCount=completeCount;
    }

}
