package com.sleep.sleep.shorts.entity;

import jakarta.persistence.*;

public class UploadShorts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int upload_no;
    @ManyToMany
    public int member_no;
    @ManyToMany
    public int sns_no;
    public String upload_url;
}
