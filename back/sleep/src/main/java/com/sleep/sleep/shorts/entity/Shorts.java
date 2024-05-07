package com.sleep.sleep.shorts.entity;

import jakarta.persistence.*;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "shorts")
public class Shorts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int shortsNo;

    private String shortsUrl;

    private double shortsTime;

    private String shortsTitle;

    private String shortsDirector;

    private int shortsChallengers;

    private String shortsLink;

}