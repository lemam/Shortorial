package com.sleep.sleep.member.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OriginLoginRequestDto {
    String memberId;
    String memberPass;
}
