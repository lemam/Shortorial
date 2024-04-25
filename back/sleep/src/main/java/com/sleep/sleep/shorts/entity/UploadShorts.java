package com.sleep.sleep.shorts.entity;

import com.sleep.sleep.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@Table(name = "upload_shorts")
@Entity
public class UploadShorts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int uploadNo;
    @ManyToOne
    @JoinColumn(name = "member_no")
    private Member memberNo;
    @ManyToOne
    @JoinColumn(name = "sns_no")
    private UploadSns snsNo;
    private String uploadUrl;
}
