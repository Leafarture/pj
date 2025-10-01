package com.TCC.Prato_Justo.Service;

import com.TCC.Prato_Justo.Interface.AnthProdutosRepository;
import com.TCC.Prato_Justo.Model.Produto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutosService  {

    private final AnthProdutosRepository anthProdutosRepository;

    public ProdutosService(AnthProdutosRepository anthProdutosRepository) {
        this.anthProdutosRepository = anthProdutosRepository;
    }


    public Produto salvarProdutos(Produto produto) {
        return anthProdutosRepository.save(produto);
    }

    public Produto atualizaProduto(Long id, Produto produtoAtualizado ){
        Optional<Produto>produtoOptional = anthProdutosRepository.findById(id);
        if(produtoOptional.isPresent()){
            Produto produto = produtoOptional.get();
            produto.setNameProduto(produtoAtualizado.getNameProduto());
            produto.setTipoAlimento(produtoAtualizado.getTipoAlimento());
            produto.setQuantidade(produtoAtualizado.getQuantidade());
            produto.setValidade(produtoAtualizado.getValidade());
            produto.setDescricao(produtoAtualizado.getDescricao());
            produto.setEndereco(produtoAtualizado.getEndereco());
            produto.setCidade(produtoAtualizado.getCidade());
            return anthProdutosRepository.save(produto);
        }else {
            throw new RuntimeException("Produto não encontrado com id: " + id);
        }
    }

    public List<Produto>listarProdutos(){
        return anthProdutosRepository.findAll();
    }

    public Produto buscarPorId(Long id){
        return anthProdutosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + id));
    }

    public void deletarProduto(Long id){
        if (anthProdutosRepository.existsById(id)){
            anthProdutosRepository.deleteById(id);
        }else {
            throw new RuntimeException("Produto não encontrado por id: " + id);
        }
    }

}
