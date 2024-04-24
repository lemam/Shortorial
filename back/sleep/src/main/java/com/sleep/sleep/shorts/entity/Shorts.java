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

    public String shorts_url;

    public double shorts_time;

    public String shorts_title;

    public String shorts_director;

    public int shorts_challengers;

    public int shorts_challengers_complete;
}