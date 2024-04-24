package com.sleep.sleep.shorts.entity;

import com.sleep.sleep.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Table(name = "upload_shorts")
@Entity
public class UploadShorts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  int uploadNo;
    @ManyToMany
    private Member memberNo;
    @ManyToMany
    private UploadSns snsNo;
    private String uploadUrl;
}
