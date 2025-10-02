package com.TCC.Prato_Justo.Service;


import com.TCC.Prato_Justo.Controller.AutchUsuarioController.CadastroRequest;
import com.TCC.Prato_Justo.Interface.AnthUsuarioRepository;
import com.TCC.Prato_Justo.Model.Usuario;
import com.TCC.Prato_Justo.Model.TipoUsuario;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;


@Service
public class UsuarioService {

    private final AnthUsuarioRepository autchCadastroRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(AnthUsuarioRepository autchCadastroRepository) {
        this.autchCadastroRepository = autchCadastroRepository;
    }


    public Usuario fazerCadastro(String username, String password, String email){
       Usuario cadastro = new Usuario();
       cadastro.setNome(username);
       cadastro.setEmail(email);
       cadastro.setPassword(password);
       cadastro.setTipoUsuario(TipoUsuario.INDIVIDUAL);
       return autchCadastroRepository.save(cadastro);
    }

    public Usuario cadastrarNovoUsusario(Usuario cadastro){
        return autchCadastroRepository.save(cadastro);
    }

    public Usuario cadastrarNovoUsuario(CadastroRequest request){
        Usuario cadastro = new Usuario();
        cadastro.setNome(request.getUsername());
        cadastro.setEmail(request.getEmail());
        cadastro.setPassword(request.getPassword());
        cadastro.setTelefone(request.getTelefone());

        // Mapear perfil do frontend para enum
        if (request.getPerfil() != null) {
            switch (request.getPerfil().toUpperCase()) {
                case "PESSOA_FISICA":
                    cadastro.setTipoUsuario(TipoUsuario.INDIVIDUAL);
                    break;
                case "ESTABELECIMENTO_ONG":
                    // Por padrão, vamos usar ESTABELECIMENTO, mas pode ser ajustado
                    cadastro.setTipoUsuario(TipoUsuario.ESTABELECIMENTO);
                    break;
                default:
                    cadastro.setTipoUsuario(TipoUsuario.INDIVIDUAL);
            }
        } else {
            cadastro.setTipoUsuario(TipoUsuario.INDIVIDUAL);
        }
        
        return autchCadastroRepository.save(cadastro);
    }

    public boolean validarLogin(String email, String rawPassword){
        return autchCadastroRepository.findByEmail(email)
                .map(cad -> passwordEncoder.matches(rawPassword, cad.getSenhaUsuario()))
                .orElse(false);
    }

    // Métodos adicionais para gerenciar usuários
    public Usuario salvar(Usuario usuario) {
        // Criptografar senha antes de salvar
        if (usuario.getSenhaUsuario() != null && !usuario.getSenhaUsuario().startsWith("$2a$")) {
            usuario.setSenhaUsuario(passwordEncoder.encode(usuario.getSenhaUsuario()));
        }
        return autchCadastroRepository.save(usuario);
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return autchCadastroRepository.findById(id);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return autchCadastroRepository.findByEmail(email);
    }

    public List<Usuario> listarTodos() {
        return autchCadastroRepository.findAll();
    }

    public void deletar(Long id) {
        autchCadastroRepository.deleteById(id);
    }
}
