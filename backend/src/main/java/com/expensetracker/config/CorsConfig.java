package com.expensetracker.config;

import org.springframework.context.annotation.Configuration;

// CORS is handled centrally in SecurityConfig.corsConfigurationSource()
// This file is intentionally left empty to avoid duplicate CORS bean conflicts.
@Configuration
public class CorsConfig {
    // No WebMvcConfigurer bean here - security filter chain handles CORS
}
