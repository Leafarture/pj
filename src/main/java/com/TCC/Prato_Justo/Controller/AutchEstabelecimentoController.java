package com.TCC.Prato_Justo.Controller;

import com.TCC.Prato_Justo.Model.Estabelecimento;
import com.TCC.Prato_Justo.Model.Usuario;
import com.TCC.Prato_Justo.Service.EstabelecimentoService;
import com.TCC.Prato_Justo.Service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AutchEstabelecimentoController {


    private final EstabelecimentoService estabelecimentoService;
    private final UsuarioService usuarioService;

    public AutchEstabelecimentoController(EstabelecimentoService estabelecimentoService, UsuarioService usuarioService) {
        this.estabelecimentoService = estabelecimentoService;
        this.usuarioService = usuarioService;
    }


    // Criar novo estabelecimento
    @PostMapping("/estabelecimento")
    public ResponseEntity<?> criarEstabelecimento(@Valid @RequestBody CadastroEstabelecimentoRequest request) {
        try {
            // Validar se as senhas coincidem
            if (!request.getSenha().equals(request.getConfirmarSenha())) {
                return ResponseEntity.badRequest()
                    .body("As senhas não coincidem");
            }
            
            // Verificar se já existe usuário com este email
            if (usuarioService.buscarPorEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest()
                    .body("Já existe um usuário cadastrado com este e-mail");
            }
            
            // Criar usuário primeiro
            Usuario usuario = new Usuario();
            usuario.setEmail(request.getEmail());
            usuario.setSenhaUsuario(request.getSenha()); // Em produção, criptografar a senha
            usuario.setTipoUsuario(com.TCC.Prato_Justo.Model.TipoUsuario.ESTABELECIMENTO);
            
            Usuario usuarioSalvo = usuarioService.salvar(usuario);
            
            // Criar estabelecimento
            Estabelecimento estabelecimento = new Estabelecimento();
            estabelecimento.setNomeEstabelecimento(request.getNomeEmpresa());
            estabelecimento.setEmail(request.getEmail());
            estabelecimento.setCnpj(request.getCnpj());
            estabelecimento.setTelefone(request.getTelefone());
            estabelecimento.setEnderecoCompleto(request.getEnderecoCompleto());
            estabelecimento.setSenhaEstabelecimento(request.getSenha()); // Em produção, criptografar
            estabelecimento.setUsuario(usuarioSalvo);
            
            Estabelecimento estabelecimentoSalvo = estabelecimentoService.salvar(estabelecimento);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(estabelecimentoSalvo);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao criar estabelecimento: " + e.getMessage());
        }
    }

        // Listar todos
        @GetMapping
        public ResponseEntity<List<Estabelecimento>> listar() {
            return ResponseEntity.ok(estabelecimentoService.listarTodos());
        }

        // Buscar por ID
        @GetMapping("/{id}")
        public ResponseEntity<Estabelecimento> buscar(@PathVariable Long id) {
            return estabelecimentoService.buscarPorId(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }

        // Atualizar
        @PutMapping("/estabelecimento/{id}")
        public ResponseEntity<Estabelecimento> atualizar(@PathVariable Long id,
                                                         @RequestBody Estabelecimento estabelecimento) {
            return estabelecimentoService.buscarPorId(id)
                    .map(existente -> {
                        estabelecimento.setId(id);
                        return ResponseEntity.ok(estabelecimentoService.salvar(estabelecimento));
                    })
                    .orElse(ResponseEntity.notFound().build());
        }

        // Deletar
        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deletar(@PathVariable Long id) {
            if (estabelecimentoService.buscarPorId(id).isPresent()) {
                estabelecimentoService.deletar(id);
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        }
    }

