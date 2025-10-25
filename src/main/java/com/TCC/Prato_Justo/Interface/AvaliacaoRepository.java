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
    
    // Buscar avaliações de doações de um usuário específico
    @Query("SELECT AVG(a.nota) FROM Avaliacao a JOIN a.estabelecimento e JOIN e.usuario u WHERE u.id = :usuarioId")
    Double getAverageRatingByUserId(@Param("usuarioId") Long usuarioId);
    
    // Contar avaliações recebidas por um usuário
    @Query("SELECT COUNT(a) FROM Avaliacao a JOIN a.estabelecimento e JOIN e.usuario u WHERE u.id = :usuarioId")
    int countByUserId(@Param("usuarioId") Long usuarioId);
}


