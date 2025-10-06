package com.TCC.Prato_Justo.Service;

import com.TCC.Prato_Justo.Interface.AvaliacaoRepository;
import com.TCC.Prato_Justo.Model.Avaliacao;
import com.TCC.Prato_Justo.Model.Estabelecimento;
import com.TCC.Prato_Justo.Model.Usuario;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;

    public AvaliacaoService(AvaliacaoRepository avaliacaoRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
    }

    public Avaliacao avaliar(Usuario usuario, Estabelecimento estabelecimento, Integer nota, String comentario) {
        if (nota == null || nota < 1 || nota > 5) throw new IllegalArgumentException("Nota deve ser entre 1 e 5");
        Avaliacao a = new Avaliacao();
        a.setUsuario(usuario);
        a.setEstabelecimento(estabelecimento);
        a.setNota(nota);
        a.setComentario(comentario);
        return avaliacaoRepository.save(a);
    }

    public List<Avaliacao> listarPorEstabelecimento(Estabelecimento e) {
        return avaliacaoRepository.findByEstabelecimento(e);
    }

    public Double media(Long estabelecimentoId) {
        return avaliacaoRepository.mediaPorEstabelecimento(estabelecimentoId);
    }
}


