package com.TCC.Prato_Justo.Interface;

import com.TCC.Prato_Justo.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnthUsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByNomeAndSenhaUsuarioAndEmail(String nome, String senhaUsuario, String email);
    Optional<Usuario> findByEmail(String email);
}
