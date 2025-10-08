package com.TCC.Prato_Justo.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
@Configuration
public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                    .csrf(csrf -> csrf.disable()) // desabilita CSRF para testes
                    .authorizeHttpRequests(requests -> requests
                            .requestMatchers("/auth/**").permitAll() // Permite acesso aos endpoints de autenticação
                            .requestMatchers("/**").permitAll() // Permite acesso a todas as URLs
                            .anyRequest().authenticated()
                    )
                    .formLogin(form -> form
                            .loginPage("/login.html") // Aponta para a página de login estática
                            .defaultSuccessUrl("/index.html", true)
                            .permitAll()
                    )
                    .logout(logout -> logout
                        .logoutSuccessUrl("/login.html")
                        .permitAll());

            return http.build();
        }
    }


