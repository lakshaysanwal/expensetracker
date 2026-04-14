package com.expensetracker.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/auth/**")).permitAll()
                .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/")).permitAll()
                .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/index.html")).permitAll()
                .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/assets/**")).permitAll()
                .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/favicon.svg")).permitAll()
                .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/icons.svg")).permitAll()
                .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/login")).permitAll()
                .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/signup")).permitAll()
                .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/error")).permitAll()
                .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/h2-console/**")).permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
