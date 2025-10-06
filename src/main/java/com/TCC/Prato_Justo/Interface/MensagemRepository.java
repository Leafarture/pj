package com.TCC.Prato_Justo.Interface;

import com.TCC.Prato_Justo.Model.Mensagem;
import com.TCC.Prato_Justo.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    @Query("SELECT m FROM Mensagem m WHERE (m.remetente = :a AND m.destinatario = :b) OR (m.remetente = :b AND m.destinatario = :a) ORDER BY m.criadoEm ASC")
    List<Mensagem> conversaEntre(@Param("a") Usuario a, @Param("b") Usuario b);
}


