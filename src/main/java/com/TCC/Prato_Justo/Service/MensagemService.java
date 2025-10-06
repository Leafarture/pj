package com.TCC.Prato_Justo.Service;

import com.TCC.Prato_Justo.Interface.MensagemRepository;
import com.TCC.Prato_Justo.Model.Mensagem;
import com.TCC.Prato_Justo.Model.Usuario;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensagemService {

    private final MensagemRepository mensagemRepository;

    public MensagemService(MensagemRepository mensagemRepository) {
        this.mensagemRepository = mensagemRepository;
    }

    public Mensagem enviar(Usuario remetente, Usuario destinatario, String conteudo) {
        Mensagem m = new Mensagem();
        m.setRemetente(remetente);
        m.setDestinatario(destinatario);
        m.setConteudo(conteudo);
        return mensagemRepository.save(m);
    }

    public List<Mensagem> conversa(Usuario a, Usuario b) {
        return mensagemRepository.conversaEntre(a, b);
    }
}


