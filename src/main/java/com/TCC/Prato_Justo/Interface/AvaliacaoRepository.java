package com.TCC.Prato_Justo.Interface;

import com.TCC.Prato_Justo.Model.Avaliacao;
import com.TCC.Prato_Justo.Model.Estabelecimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    List<Avaliacao> findByEstabelecimento(Estabelecimento estabelecimento);

    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.estabelecimento.id = :id")
    Double mediaPorEstabelecimento(@Param("id") Long estabelecimentoId);
}


