package com.sleep.sleep.shorts.entity;

import jakarta.persistence.*;

public class TryShorts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int try_no;
    @ManyToOne
    public int shorts_no;
    @ManyToMany
    public int member_no;
    public int try_count;
    public int try_complete;
    public int try_max_time;
    public int try_current_time;

}
