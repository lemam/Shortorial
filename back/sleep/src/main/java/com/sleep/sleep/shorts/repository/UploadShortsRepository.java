package com.sleep.sleep.shorts.repository;

import com.sleep.sleep.shorts.entity.UploadShorts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UploadShortsRepository extends JpaRepository<UploadShorts,Integer> {
}
