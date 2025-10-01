package com.TCC.Prato_Justo.Controller;


import com.TCC.Prato_Justo.Model.Produto;
import com.TCC.Prato_Justo.Service.ProdutosService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(originPatterns = "*")

public class AuthProdutoController {
    private final ProdutosService produtoService;

    public AuthProdutoController(ProdutosService produtoService) {
        this.produtoService = produtoService;
    }


    @PostMapping("/register")
    public Produto register(@RequestBody Produto produto) {
        return produtoService.salvarProdutos(produto);
    }
    // Cadastrar um novo produto
    @PostMapping("/cadastrar")
    public ResponseEntity<Produto> cadastrarProduto(@RequestBody Produto produto) {
        Produto novoProduto = produtoService.salvarProdutos(produto);
        return ResponseEntity.ok(novoProduto);
    }

    // Listar todos os produtos
    @GetMapping("/listar")
    public ResponseEntity<List<Produto>> listarProdutos() {
        List<Produto> produtos = produtoService.listarProdutos();
        return ResponseEntity.ok(produtos);
    }

    // Buscar produto por ID
    @GetMapping("/produto/{id}")
    public ResponseEntity<Produto> buscarProdutoPorId(@PathVariable Long id) {
        Produto produto = produtoService.buscarPorId(id);
        return ResponseEntity.ok(produto);
    }

    // Atualizar produto
    @PutMapping("/atualizar/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestBody Produto produtoAtualizado) {
        Produto produto = produtoService.atualizaProduto(id, produtoAtualizado);
        return ResponseEntity.ok(produto);
    }

    // Deletar produto
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<String> deletarProduto(@PathVariable Long id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.ok("Produto deletado com sucesso!");
    }

}
