package com.sleep.sleep.shorts.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@Table(name = "upload_sns")
@Entity
public class UploadSns {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int snsNo;

    private String youtubeUrl;
    private String ticktokUrl;
    private String instaUrl;

    @OneToOne
    @JoinColumn(name = "uploadNo")
    private UploadShorts uploadNo;
}
