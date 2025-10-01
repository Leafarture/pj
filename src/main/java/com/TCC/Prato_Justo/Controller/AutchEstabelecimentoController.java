package com.TCC.Prato_Justo.Controller;

import com.TCC.Prato_Justo.Model.Estabelecimento;
import com.TCC.Prato_Justo.Service.EstabelecimentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AutchEstabelecimentoController {


        private final EstabelecimentoService estabelecimentoService;

    public AutchEstabelecimentoController(EstabelecimentoService estabelecimentoService) {
        this.estabelecimentoService = estabelecimentoService;
    }


    // Criar novo estabelecimento
        @PostMapping
        public ResponseEntity<Estabelecimento> criar(@RequestBody Estabelecimento estabelecimento) {
            Estabelecimento novo = estabelecimentoService.salvar(estabelecimento);
            return ResponseEntity.ok(novo);
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

