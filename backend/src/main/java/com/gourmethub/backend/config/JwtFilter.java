package com.gourmethub.backend.config;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        final String token = header.substring(7);
        try {
            Claims claims = jwtUtil.validateToken(token);
            String email = claims.getSubject();
            Object rolesObj = claims.get("roles");
            List<SimpleGrantedAuthority> authorities = List.of();
            if (rolesObj instanceof List<?>) {
                List<?> raw = (List<?>) rolesObj;
                authorities = raw.stream()
                        .filter(elt -> elt != null)
                        .map(elt -> new SimpleGrantedAuthority(elt.toString()))
                        .collect(Collectors.toList());
            }
            var auth = new UsernamePasswordAuthenticationToken(email, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (Exception ex) {
            // token invalid or roles malformed -> ignore and proceed as anonymous
        }
        filterChain.doFilter(request, response);
    }
}