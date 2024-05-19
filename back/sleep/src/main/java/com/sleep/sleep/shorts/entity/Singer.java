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
@Table(name = "Singer_info")
public class Singer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int singerNo;
    private String singerName;
    private int singerGender;
    private int singerGroup;
    private String singerCompany;

}
