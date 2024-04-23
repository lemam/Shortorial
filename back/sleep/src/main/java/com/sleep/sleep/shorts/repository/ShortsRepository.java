package com.sleep.sleep.shorts.repository;

import com.sleep.sleep.shorts.entity.Shorts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShortsRepository extends JpaRepository<Shorts,Integer> {
}