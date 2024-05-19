package com.sleep.sleep.shorts.repository;

import com.sleep.sleep.shorts.entity.MusicSinger;
import com.sleep.sleep.shorts.entity.Shorts;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MusicSingerRepository extends JpaRepository<MusicSinger,Integer> {
    @Query(nativeQuery = true, value = "select * from music_singer where music_no =:musicNo")
    MusicSinger findByMusicNo(@Param("musicNo") int musicNo);
}
