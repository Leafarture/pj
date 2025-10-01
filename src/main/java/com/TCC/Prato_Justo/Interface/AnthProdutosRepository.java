package com.TCC.Prato_Justo.Interface;


import com.TCC.Prato_Justo.Model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AnthProdutosRepository extends JpaRepository<Produto, Long> {
     List<Produto> findByNameProdutoContainingIgnoreCase(String nameProduto);
}
