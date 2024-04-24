package com.sleep.sleep.shorts.entity;

import jakarta.persistence.*;

public class UploadSns {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int sns_no;
    public String sns_name;
}
