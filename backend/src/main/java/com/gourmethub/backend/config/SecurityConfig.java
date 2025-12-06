package com.gourmethub.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Use the lambda-style configuration to avoid deprecated chained calls
        http.cors(cors -> {});
        http.csrf(csrf -> csrf.disable());
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.authorizeHttpRequests(authorize -> authorize
            // Use AntPathRequestMatcher to avoid ambiguity when multiple servlets are registered (H2 console)
            .requestMatchers(
                new AntPathRequestMatcher("/api/auth/**"),
                new AntPathRequestMatcher("/v3/api-docs/**"),
                new AntPathRequestMatcher("/swagger-ui/**"),
                new AntPathRequestMatcher("/swagger-ui.html"),
                new AntPathRequestMatcher("/h2-console/**"),
                // allow root and index so the browser can open http://localhost:8080 without 403
                new AntPathRequestMatcher("/"),
                new AntPathRequestMatcher("/index.html"),
                // static assets
                new AntPathRequestMatcher("/**/*.js"),
                new AntPathRequestMatcher("/**/*.css"),
                new AntPathRequestMatcher("/**/*.png"),
                new AntPathRequestMatcher("/favicon.ico")
            ).permitAll()
            // Allow public GETs so frontend can consume Sprint-1 data without auth
            .requestMatchers(new AntPathRequestMatcher("/**", "GET")).permitAll()
            // For quick dev: allow anonymous POST to create menus so Admin UI can persist (remove/secure in Sprint-2)
            .requestMatchers(new AntPathRequestMatcher("/api/menus", "POST")).permitAll()
            // For quick dev: allow anonymous POST to create items so Admin UI can persist items
            .requestMatchers(new AntPathRequestMatcher("/api/items", "POST")).permitAll()
            // Also allow any method on items during development (workaround for DELETE being blocked)
            .requestMatchers(new AntPathRequestMatcher("/api/items/**")).permitAll()
            // Also allow anonymous PUT for menu edits during development so frontend can persist updates
            .requestMatchers(new AntPathRequestMatcher("/api/menus/**", "PUT")).permitAll()
            // Allow anonymous PUT for items during development
            .requestMatchers(new AntPathRequestMatcher("/api/items/**", "PUT")).permitAll()
            // Allow anonymous DELETE for items during development so admin can remove items from UI
            .requestMatchers(new AntPathRequestMatcher("/api/items/**", "DELETE")).permitAll()
            // Allow backfill helper endpoint in dev
            .requestMatchers(new AntPathRequestMatcher("/api/menus/backfill-closing", "POST")).permitAll()
                // permit debug delete helper
                .requestMatchers(new AntPathRequestMatcher("/api/debug/**", "POST")).permitAll()
            // allow debug endpoints for any method in dev
            .requestMatchers(new AntPathRequestMatcher("/api/debug/**")).permitAll()
            // Development convenience: permit all requests. Replace with proper auth in production.
            .anyRequest().permitAll()
        );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // allow frames for H2 console
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
