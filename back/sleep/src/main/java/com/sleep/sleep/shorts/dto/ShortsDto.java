package com.sleep.sleep.shorts.dto;

import lombok.*;

@ToString
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)

public class ShortsDto {
    private int shortsNo;

    private String shortsUrl;

    private double shortsTime;

    private String shortsTitle;

    private String shortsDirector;

    private int shortsChallengers;

    private int shortsChallengersComplete;
}