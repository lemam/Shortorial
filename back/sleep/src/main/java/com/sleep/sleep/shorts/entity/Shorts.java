package com.sleep.sleep.shorts.entity;

import jakarta.persistence.*;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Table(name = "shorts")
@Entity
public class Shorts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int shortsNo;
    @Column(nullable = false)
    public String shorts_url;
    @Column(nullable = false)
    public double shorts_time;
    @Column(nullable = false)
    public String shorts_title;
    @Column(nullable = false)
    public String shorts_director;
    @Column(nullable = false)
    public int shorts_challengers;
    @Column(nullable = false)
    public int shorts_challengers_complete;
}