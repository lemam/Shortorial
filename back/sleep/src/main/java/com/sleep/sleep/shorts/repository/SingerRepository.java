package com.sleep.sleep.shorts.repository;


import com.sleep.sleep.shorts.entity.Singer;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SingerRepository extends JpaRepository<Singer, Integer> {
    @Query(nativeQuery = true, value = "select * from singer_info where singer_no =:singerNo")
    Singer findBySingerNo(@Param("singerNo") int singerNo);
}
