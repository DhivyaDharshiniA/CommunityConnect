
package com.example.springapp.config;

import com.example.springapp.security.JwtFilter;
import com.example.springapp.security.CustomUserDetailsService;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.*;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final CustomUserDetailsService userDetailsService;

    // ---------------- PASSWORD ENCODER ----------------
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ---------------- AUTHENTICATION MANAGER ----------------
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ---------------- CORS CONFIGURATION ----------------
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173"
        ));

        configuration.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    // ---------------- SECURITY FILTER CHAIN ----------------
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // AUTH APIs
                        .requestMatchers("/api/auth/**").permitAll()
//                        .requestMatchers("/api/**").permitAll()
                        .requestMatchers("/api/events/all", "/qrcodes/**").permitAll()

                        // Google login endpoint
                        .requestMatchers("/api/auth/google").permitAll()

                        // Public APIs
                        .requestMatchers("/api/events/all").permitAll()
                        .requestMatchers("/api/help/**").permitAll()
                        .requestMatchers("/api/donations/**").permitAll()

                        // QR + attendance
                        .requestMatchers("/qrcodes/**").permitAll()
                        .requestMatchers("/api/attendance/**").permitAll()

                        // Static files
                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/**/*.png", "/**/*.jpg", "/**/*.jpeg", "/**/*.gif").permitAll()
                        .requestMatchers("/**/*.css", "/**/*.js").permitAll()

                        // Public forms
                        .requestMatchers("/fill-form", "/fill-form/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/help/**").permitAll()
                        .requestMatchers("/api/donations/**").permitAll()
//                        .requestMatchers("/api/membership/**").permitAll()
                                .requestMatchers("/api/membership/request")
                                .hasRole("USER")

                                // NGO dashboard
                                .requestMatchers("/api/membership/my-requests")
                                .hasRole("NGO")

                                .requestMatchers("/api/membership/approve/**")
                                .hasRole("NGO")

                                .requestMatchers("/api/membership/reject/**")
                                .hasRole("NGO")

                                .requestMatchers("/api/membership/members")
                                .hasRole("NGO")
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/ngos/**").permitAll()

                        .requestMatchers("/api/events/create").hasAnyRole("NGO", "USER")

                        // Everything else requires login
                        .anyRequest().authenticated()
                )

                // JWT FILTER
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}