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
@Table(name = "Music_info")
public class Music {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int musicNo;

    private String musicGenre;
    private String musicName;
    private String musicDirector;

}
