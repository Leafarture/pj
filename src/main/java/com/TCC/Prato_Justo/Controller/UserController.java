package com.TCC.Prato_Justo.Controller;

import com.TCC.Prato_Justo.Model.Usuario;
import com.TCC.Prato_Justo.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class UserController {

    @Autowired
    private AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Token não fornecido");
            }

            String token = authHeader.substring(7);
            
            if (!authService.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Token inválido");
            }

            Usuario usuario = authService.getCurrentUser(token);
            if (usuario == null) {
                return ResponseEntity.status(404).body("Usuário não encontrado");
            }

            // Retornar dados do usuário sem a senha
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", usuario.getId());
            userData.put("nome", usuario.getNome());
            userData.put("email", usuario.getEmail());
            userData.put("telefone", usuario.getTelefone());
            userData.put("tipoUsuario", usuario.getTipoUsuario());
            userData.put("statusAtivo", usuario.getStatusAtivo());
            userData.put("verificado", usuario.getVerificado());
            userData.put("dataCadastro", usuario.getDataCadastro());

            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno: " + e.getMessage());
        }
    }

    @GetMapping("/me/simple")
    public ResponseEntity<?> getCurrentUserSimple() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Usuário não autenticado");
            }

            Usuario usuario = authService.getCurrentUser(null); // Será obtido do contexto de segurança

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", usuario.getId());
            userData.put("nome", usuario.getNome());
            userData.put("email", usuario.getEmail());
            userData.put("tipoUsuario", usuario.getTipoUsuario());

            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno: " + e.getMessage());
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody Map<String, Object> updateData,
                                               @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Token não fornecido");
            }

            String token = authHeader.substring(7);
            
            if (!authService.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Token inválido");
            }

            Usuario usuario = authService.getCurrentUser(token);
            if (usuario == null) {
                return ResponseEntity.status(404).body("Usuário não encontrado");
            }

            // Atualizar campos permitidos
            if (updateData.containsKey("nome")) {
                usuario.setNome((String) updateData.get("nome"));
            }
            if (updateData.containsKey("email")) {
                usuario.setEmail((String) updateData.get("email"));
            }
            if (updateData.containsKey("telefone")) {
                usuario.setTelefone((String) updateData.get("telefone"));
            }

            // Salvar no banco de dados
            Usuario usuarioAtualizado = authService.updateUser(usuario);
            
            // Retornar dados atualizados
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", usuarioAtualizado.getId());
            userData.put("nome", usuarioAtualizado.getNome());
            userData.put("email", usuarioAtualizado.getEmail());
            userData.put("telefone", usuarioAtualizado.getTelefone());
            userData.put("tipoUsuario", usuarioAtualizado.getTipoUsuario());
            userData.put("statusAtivo", usuarioAtualizado.getStatusAtivo());
            userData.put("verificado", usuarioAtualizado.getVerificado());
            userData.put("dataCadastro", usuarioAtualizado.getDataCadastro());

            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno: " + e.getMessage());
        }
    }

    @GetMapping("/me/stats")
    public ResponseEntity<?> getUserStats(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Token não fornecido");
            }

            String token = authHeader.substring(7);
            
            if (!authService.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Token inválido");
            }

            Usuario usuario = authService.getCurrentUser(token);
            if (usuario == null) {
                return ResponseEntity.status(404).body("Usuário não encontrado");
            }

            // Buscar estatísticas do usuário
            Map<String, Object> stats = authService.getUserStats(usuario.getId());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno: " + e.getMessage());
        }
    }
}
