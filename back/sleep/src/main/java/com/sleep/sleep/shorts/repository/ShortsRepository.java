package com.sleep.sleep.shorts.repository;

import com.sleep.sleep.shorts.entity.Shorts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShortsRepository extends JpaRepository<Shorts,Integer> {

    Shorts findByShortsNo(int shortNo);

    @Query(nativeQuery = true, value = "select * from shorts")
    List<Shorts> findShortList();

    @Query(nativeQuery = true, value = "select * from shorts order by shortsChallengers DESC limit 3")
    List<Shorts> findShortTopRanking();
}