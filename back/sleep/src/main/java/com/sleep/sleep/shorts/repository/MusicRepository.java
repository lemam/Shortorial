package com.sleep.sleep.shorts.repository;

import com.sleep.sleep.shorts.entity.Music;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MusicRepository extends JpaRepository<Music, Integer> {

    @Query(nativeQuery = true, value = "select * from music_info where music_no =:musicNo")
    Music findByMusicNo(@Param("musicNo") int musicNo);
}
