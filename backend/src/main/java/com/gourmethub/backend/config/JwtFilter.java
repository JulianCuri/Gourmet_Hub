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
        System.out.println("JwtFilter: incoming Authorization header='" + header + "' for request " + request.getMethod() + " " + request.getRequestURI());
        if (header == null || !header.startsWith("Bearer ")) {
            // no Authorization header or not Bearer
            System.out.println("JwtFilter: no Bearer header present for request " + request.getMethod() + " " + request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }
        final String token = header.substring(7);
        try {
            Claims claims = jwtUtil.validateToken(token);
            String email = claims.getSubject();
            Object rolesObj = claims.get("roles");
            System.out.println("JwtFilter: validated token for " + email + ", raw roles=" + rolesObj);
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
            System.err.println("JwtFilter: Exception validating token: " + ex.getClass().getSimpleName() + " - " + ex.getMessage());
            ex.printStackTrace();
        }
        filterChain.doFilter(request, response);
    }
}