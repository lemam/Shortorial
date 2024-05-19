package com.sleep.sleep.shorts.entity;

import jakarta.persistence.*;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "shorts")
public class Shorts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int shortsNo;

    private String shortsUrl;
    private int musicNo;
    private double shortsTime;

    private String shortsTitle;

    private String shortsDirector;

    @Column(name = "shorts_challengers", nullable = false, columnDefinition = "INT DEFAULT 0")
    private int shortsChallengers;

    private String shortsLink;

    private LocalDate shortsDate;


    @OneToMany(mappedBy = "shortsNo", cascade = CascadeType.ALL)
    private List<TryShorts> tryShortsList;


    public void addShortsChallengers(int valueToAdd) {
        this.shortsChallengers += valueToAdd;
    }

}