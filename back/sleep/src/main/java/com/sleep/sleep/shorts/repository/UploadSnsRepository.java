package com.sleep.sleep.shorts.repository;

import com.sleep.sleep.shorts.entity.UploadSns;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UploadSnsRepository extends JpaRepository<UploadSns,Integer> {
}
