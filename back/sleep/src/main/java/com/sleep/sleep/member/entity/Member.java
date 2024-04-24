package com.sleep.sleep.member.entity;

import com.sleep.sleep.shorts.entity.TryShorts;
import com.sleep.sleep.shorts.entity.UploadShorts;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

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
    @OneToMany(mappedBy="tryNo")
    private List<TryShorts> tryShorts;
    @OneToMany(mappedBy = "uploadNo")
    private List<UploadShorts> uploadShorts;
}
