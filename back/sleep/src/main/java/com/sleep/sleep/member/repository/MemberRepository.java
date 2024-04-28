package com.sleep.sleep.member.repository;

import com.sleep.sleep.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    Optional<Member> findByUsernameWithAuthority(String username);
}
