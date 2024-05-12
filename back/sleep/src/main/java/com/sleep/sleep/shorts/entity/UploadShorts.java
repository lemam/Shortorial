package com.sleep.sleep.shorts.entity;

import com.sleep.sleep.member.entity.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
    private Member memberIndex;
    private String uploadUrl;
    private String uploadTitle;
    private LocalDateTime uploadDate = LocalDateTime.now();


    @OneToOne
    @JoinColumn(name = "sns_no")
    private UploadSns snsNo;

    @Builder
    public UploadShorts(Member memberIndex, String uploadUrl, String uploadTitle) {
        if (memberIndex != null) {
            this.memberIndex = memberIndex;
        }
        this.uploadUrl = uploadUrl;
        this.uploadTitle = uploadTitle;
    }
}
