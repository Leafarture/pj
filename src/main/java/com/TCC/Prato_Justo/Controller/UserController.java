package com.TCC.Prato_Justo.Controller;

import com.TCC.Prato_Justo.Model.Usuario;
import com.TCC.Prato_Justo.Service.AuthService;
import com.TCC.Prato_Justo.Service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private FileUploadService fileUploadService;

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
            
            // Campos de endereço
            userData.put("rua", usuario.getRua());
            userData.put("numero", usuario.getNumero());
            userData.put("complemento", usuario.getComplemento());
            userData.put("cidade", usuario.getCidade());
            userData.put("estado", usuario.getEstado());
            userData.put("cep", usuario.getCep());
            
            // Campos adicionais
            userData.put("descricao", usuario.getDescricao());
            userData.put("avatarUrl", usuario.getAvatarUrl());

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
            System.out.println("=== DEBUG updateCurrentUser ===");
            System.out.println("Dados recebidos: " + updateData);
            
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

            System.out.println("Usuário encontrado: " + usuario.getId() + " - " + usuario.getNome());

            // Atualizar campos permitidos
            if (updateData.containsKey("nome") && updateData.get("nome") != null) {
                usuario.setNome((String) updateData.get("nome"));
            }
            if (updateData.containsKey("email") && updateData.get("email") != null) {
                usuario.setEmail((String) updateData.get("email"));
            }
            if (updateData.containsKey("telefone")) {
                usuario.setTelefone((String) updateData.get("telefone"));
            }
            
            // Atualizar campos de endereço
            if (updateData.containsKey("rua")) {
                usuario.setRua((String) updateData.get("rua"));
            }
            if (updateData.containsKey("numero")) {
                usuario.setNumero((String) updateData.get("numero"));
            }
            if (updateData.containsKey("complemento")) {
                usuario.setComplemento((String) updateData.get("complemento"));
            }
            if (updateData.containsKey("cidade")) {
                usuario.setCidade((String) updateData.get("cidade"));
            }
            if (updateData.containsKey("estado")) {
                usuario.setEstado((String) updateData.get("estado"));
            }
            if (updateData.containsKey("cep")) {
                usuario.setCep((String) updateData.get("cep"));
            }
            
            // Atualizar campos adicionais
            if (updateData.containsKey("descricao")) {
                usuario.setDescricao((String) updateData.get("descricao"));
            }
            if (updateData.containsKey("avatarUrl")) {
                usuario.setAvatarUrl((String) updateData.get("avatarUrl"));
            }

            System.out.println("Salvando usuário atualizado...");
            
            // Salvar no banco de dados usando método específico para atualização
            Usuario usuarioAtualizado = authService.updateUserProfile(usuario);
            
            System.out.println("Usuário salvo com sucesso!");
            
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
            
            // Campos de endereço
            userData.put("rua", usuarioAtualizado.getRua());
            userData.put("numero", usuarioAtualizado.getNumero());
            userData.put("complemento", usuarioAtualizado.getComplemento());
            userData.put("cidade", usuarioAtualizado.getCidade());
            userData.put("estado", usuarioAtualizado.getEstado());
            userData.put("cep", usuarioAtualizado.getCep());
            
            // Campos adicionais
            userData.put("descricao", usuarioAtualizado.getDescricao());
            userData.put("avatarUrl", usuarioAtualizado.getAvatarUrl());

            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Erro ao atualizar usuário: " + e.getMessage());
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

    @PostMapping("/me/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("avatar") MultipartFile file,
                                         @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            System.out.println("=== UPLOAD DE AVATAR ===");
            System.out.println("📸 Arquivo: " + file.getOriginalFilename());
            System.out.println("📦 Tamanho: " + file.getSize() + " bytes");
            System.out.println("🎨 Tipo: " + file.getContentType());
            
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

            // Deletar avatar antigo se existir
            if (usuario.getAvatarUrl() != null && !usuario.getAvatarUrl().isEmpty()) {
                fileUploadService.deleteAvatar(usuario.getAvatarUrl());
            }

            // Salvar novo avatar
            String avatarUrl = fileUploadService.saveAvatar(file, usuario.getId());
            
            // Atualizar usuário
            usuario.setAvatarUrl(avatarUrl);
            Usuario usuarioAtualizado = authService.updateUserProfile(usuario);

            Map<String, Object> response = new HashMap<>();
            response.put("avatarUrl", usuarioAtualizado.getAvatarUrl());
            response.put("message", "Avatar atualizado com sucesso");

            System.out.println("✅ Avatar salvo: " + avatarUrl);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("❌ Erro de IO: " + e.getMessage());
            return ResponseEntity.status(400).body("Erro ao fazer upload: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("❌ Erro interno: " + e.getMessage());
            return ResponseEntity.status(500).body("Erro interno: " + e.getMessage());
        }
    }
}
