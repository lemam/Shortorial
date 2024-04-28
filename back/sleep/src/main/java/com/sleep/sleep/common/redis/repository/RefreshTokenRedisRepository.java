package com.sleep.sleep.common.redis.repository;

import com.sleep.sleep.common.redis.entity.RefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRedisRepository extends CrudRepository<RefreshToken, String> {
}
