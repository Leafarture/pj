package com.TCC.Prato_Justo.Service;

import com.TCC.Prato_Justo.Model.Usuario;
import com.TCC.Prato_Justo.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioService usuarioService;

    public Map<String, Object> authenticate(String email, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );

            String jwt = jwtUtil.generateToken(authentication);
            Usuario usuario = usuarioService.findByEmail(email);

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("user", usuario);
            response.put("message", "Login realizado com sucesso");

            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Credenciais inválidas");
            response.put("message", e.getMessage());
            return response;
        }
    }

    public Usuario getCurrentUser(String token) {
        try {
            String email = jwtUtil.getUsernameFromToken(token);
            return usuarioService.findByEmail(email);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean isTokenValid(String token) {
        return jwtUtil.validateToken(token);
    }

    public Usuario updateUser(Usuario usuario) {
        return usuarioService.save(usuario);
    }

    public Map<String, Object> getUserStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Buscar estatísticas do usuário
        int totalDonations = usuarioService.getTotalDonations(userId);
        int familiesHelped = usuarioService.getFamiliesHelped(userId);
        double averageRating = usuarioService.getAverageRating(userId);
        
        stats.put("totalDonations", totalDonations);
        stats.put("familiesHelped", familiesHelped);
        stats.put("averageRating", averageRating);
        
        return stats;
    }
}
