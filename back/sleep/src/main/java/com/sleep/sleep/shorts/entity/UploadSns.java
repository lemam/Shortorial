package com.sleep.sleep.shorts.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Table(name = "upload_sns")
@Entity
public class UploadSns {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int snsNo;
    private String snsName;
}
