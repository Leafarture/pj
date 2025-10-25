package com.TCC.Prato_Justo.Service;


import com.TCC.Prato_Justo.Controller.AuthUsuarioController.CadastroRequest;
import com.TCC.Prato_Justo.Interface.AnthUsuarioRepository;
import com.TCC.Prato_Justo.Interface.DoacaoRepository;
import com.TCC.Prato_Justo.Interface.AvaliacaoRepository;
import com.TCC.Prato_Justo.Model.Usuario;
import com.TCC.Prato_Justo.Model.TipoUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;


@Service
public class UsuarioService {

    private final AnthUsuarioRepository autchCadastroRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Autowired
    private DoacaoRepository doacaoRepository;
    
    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

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

    public Usuario cadastrarNovoUsuario(Usuario cadastro){
        return autchCadastroRepository.save(cadastro);
    }

    public Usuario cadastrarNovoUsuario(CadastroRequest request){
        // Verificar se já existe usuário com este email
        if (autchCadastroRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Já existe um usuário cadastrado com este e-mail");
        }
        
        Usuario cadastro = new Usuario();
        cadastro.setNome(request.getUsername());
        cadastro.setEmail(request.getEmail());
        cadastro.setPassword(request.getPassword());
        cadastro.setTelefone(request.getTelefone());

        // Salvar dados de endereço
        cadastro.setRua(request.getRua());
        cadastro.setNumero(request.getNumero());
        cadastro.setComplemento(request.getComplemento());
        cadastro.setCidade(request.getCidade());
        cadastro.setEstado(request.getEstado());
        cadastro.setCep(request.getCep());

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

    public Usuario findByEmail(String email) {
        return autchCadastroRepository.findByEmail(email).orElse(null);
    }

    public Usuario save(Usuario usuario) {
        return autchCadastroRepository.save(usuario);
    }

    public Usuario updateProfile(Usuario usuario) {
        // Método específico para atualizar perfil sem tocar na senha
        // A senha já está criptografada no banco, não deve ser alterada
        return autchCadastroRepository.save(usuario);
    }

    public int getTotalDonations(Long userId) {
        try {
            return doacaoRepository.countByDoadorId(userId);
        } catch (Exception e) {
            System.err.println("Erro ao contar doações: " + e.getMessage());
            return 0;
        }
    }

    public int getFamiliesHelped(Long userId) {
        // Podemos usar o número de doações ativas como proxy para famílias ajudadas
        // Ou implementar uma lógica mais complexa no futuro
        try {
            return doacaoRepository.countActiveByDoadorId(userId);
        } catch (Exception e) {
            System.err.println("Erro ao contar famílias ajudadas: " + e.getMessage());
            return 0;
        }
    }

    public double getAverageRating(Long userId) {
        try {
            Double average = avaliacaoRepository.getAverageRatingByUserId(userId);
            return average != null ? average : 0.0;
        } catch (Exception e) {
            System.err.println("Erro ao calcular média de avaliações: " + e.getMessage());
            return 0.0;
        }
    }
}
