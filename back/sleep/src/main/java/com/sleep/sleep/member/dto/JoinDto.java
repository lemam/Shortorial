package com.sleep.sleep.member.dto;

import com.sleep.sleep.member.entity.MemberRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JoinDto {
    String memberId;
    String memberPass;
    String memberNickname;
//    String memberProfile;
}
