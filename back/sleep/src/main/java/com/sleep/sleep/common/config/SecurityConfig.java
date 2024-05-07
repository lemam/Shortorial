package com.sleep.sleep.common.config;

import com.sleep.sleep.common.JWT.CustomUserDetailsService;
import com.sleep.sleep.common.JWT.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws  Exception{

        http
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/").hasRole("USER")
                        .anyRequest().permitAll())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .csrf().disable()
                .headers().frameOptions().disable()

                .and()
                .logout().disable()
                //jwt로 로그인 로그아웃 처리할 것이므로 disable
                .sessionManagement().sessionCreationPolicy(STATELESS)
                //기본적으로 session을 이용하게 되는데 redis를 이용할 것이니까 STATELESS

                .and()
                .cors()
                ;



        return http.build();

    }

}
