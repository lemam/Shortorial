package com.sleep.sleep.shorts.dto;

import lombok.*;

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
}