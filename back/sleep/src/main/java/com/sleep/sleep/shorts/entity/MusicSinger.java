package com.sleep.sleep.shorts.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "music_singer",
        uniqueConstraints = @UniqueConstraint(name = "UniqueMusicSinger", columnNames = { "musicNo",
                "singerNo" }))
public class MusicSinger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int musicSingerNo;

    private int musicNo;
    private int singerNo;
}
