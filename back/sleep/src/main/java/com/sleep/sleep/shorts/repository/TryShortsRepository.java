package com.sleep.sleep.shorts.repository;

import com.sleep.sleep.shorts.entity.TryShorts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TryShortsRepository extends JpaRepository<TryShorts,Integer> {
}
