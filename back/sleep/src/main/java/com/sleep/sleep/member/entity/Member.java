package com.sleep.sleep.member.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Table(name = "member")
@Entity
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int memberNo;
    private String memberId;
    private String  memberPassword;
    private String  memberNickname;
    private String  refreshToken;
    private String memberProfile;
    private String  memberTiktokLink;
}
