package com.sleep.sleep.common.redis.repository;

import com.sleep.sleep.common.redis.entity.LogoutAccessToken;
import org.springframework.data.repository.CrudRepository;

public interface LogoutAccessTokenRedisRepository extends CrudRepository<LogoutAccessToken, String> {
}
