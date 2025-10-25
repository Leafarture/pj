package com.TCC.Prato_Justo.Interface;

import com.TCC.Prato_Justo.Model.Doacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DoacaoRepository extends JpaRepository<Doacao, Long> {

    List<Doacao> findByAtivoTrue();

    List<Doacao> findByAtivoTrueAndTipoAlimentoContainingIgnoreCase(String tipoAlimento);

    @Query("SELECT d FROM Doacao d WHERE d.ativo = true AND (:cidade IS NULL OR LOWER(d.cidade) = LOWER(:cidade))")
    List<Doacao> searchByCidade(@Param("cidade") String cidade);

    @Query("SELECT d FROM Doacao d WHERE d.ativo = true AND d.latitude IS NOT NULL AND d.longitude IS NOT NULL")
    List<Doacao> findAllComCoordenadas();

    List<Doacao> findByDoadorId(Long doadorId);
    
    // Contar doações por usuário
    @Query("SELECT COUNT(d) FROM Doacao d WHERE d.doador.id = :usuarioId")
    int countByDoadorId(@Param("usuarioId") Long usuarioId);
    
    // Contar doações ativas por usuário
    @Query("SELECT COUNT(d) FROM Doacao d WHERE d.doador.id = :usuarioId AND d.ativo = true")
    int countActiveByDoadorId(@Param("usuarioId") Long usuarioId);
}


