package com.TCC.Prato_Justo.Controller;

import com.TCC.Prato_Justo.Model.Usuario;
import com.TCC.Prato_Justo.Service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class AutchUsuarioController {

   private final UsuarioService usuarioService;

    public AutchUsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody CadastroRequest request){
        try {
            Usuario usuario = usuarioService.cadastrarNovoUsuario(request);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar usuário: " + e.getMessage());
        }
    }

    @PostMapping("/cadastros")
    public String cadastros(@RequestBody Usuario cadastro){
        Usuario cad = usuarioService.fazerCadastro(cadastro.getNome(), cadastro.getEmail(), cadastro.getPassword());
        if(cad != null){
            return "Cadastro Realizado" + cad.getNome() + "!!!!!";

        }
        return "Usuario ou senha ou email errada !!!!";
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginRequest request) {
        boolean valido = usuarioService.validarLogin(request.getEmail(), request.getPassword());
        if (valido) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class CadastroRequest {
        private String username;
        private String email;
        private String password;
        private String perfil;
        private String telefone;
        private String enderecoCompleto;
        private Double latitude;
        private Double longitude;

        // Getters e Setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getPerfil() {
            return perfil;
        }

        public void setPerfil(String perfil) {
            this.perfil = perfil;
        }

        public String getTelefone() {
            return telefone;
        }

        public void setTelefone(String telefone) {
            this.telefone = telefone;
        }

        public String getEnderecoCompleto() {
            return enderecoCompleto;
        }

        public void setEnderecoCompleto(String enderecoCompleto) {
            this.enderecoCompleto = enderecoCompleto;
        }

        public Double getLatitude() {
            return latitude;
        }

        public void setLatitude(Double latitude) {
            this.latitude = latitude;
        }

        public Double getLongitude() {
            return longitude;
        }

        public void setLongitude(Double longitude) {
            this.longitude = longitude;
        }
    }
}
