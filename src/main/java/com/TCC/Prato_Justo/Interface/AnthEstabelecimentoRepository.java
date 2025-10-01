package com.TCC.Prato_Justo.Interface;

import com.TCC.Prato_Justo.Model.Estabelecimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnthEstabelecimentoRepository extends JpaRepository<Estabelecimento, Long> {
    Optional<Estabelecimento> findBynomeEstabelecimentoAndSenhaEstabelecimentoAndEmail(String  nomeEstabelecimento, String senhaEstabelecimento, String email);
    Optional<Estabelecimento> findByEmail(String email);
}
