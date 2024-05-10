package com.sleep.sleep.shorts.repository;

import com.sleep.sleep.shorts.entity.UploadShorts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UploadShortsRepository extends JpaRepository<UploadShorts,Integer> {
//    UploadShorts findByUploadNo(int uploadNo);

    @Query(nativeQuery = true, value = "select * from upload_shorts where member_no = :someValue")
    List<UploadShorts> findUploadShortList(@Param("someValue") int memberNo);


}
