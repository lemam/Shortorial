package com.sleep.sleep.shorts.dto;

import lombok.*;

@ToString
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)

public class ShortsDto {
    public String member_id;
    public String  member_password;
    public String  member_nickname;
    public String  refresh_token;
    public String member_profile;
    public String  member_tiktok_link;
}