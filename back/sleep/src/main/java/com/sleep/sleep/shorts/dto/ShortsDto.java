package com.sleep.sleep.shorts.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShortsDto {
    private int shortsNo;

    private String shortsUrl;

    private double shortsTime;

    private String shortsTitle;

    private String shortsDirector;

    private int shortsChallengers;

    private String shortsLink;

    private LocalDate shortDate;

    private String musicName;

    private String SingerName;
}