package com.TCC.Prato_Justo.Controller;

import com.TCC.Prato_Justo.Model.Mensagem;
import com.TCC.Prato_Justo.Model.Usuario;
import com.TCC.Prato_Justo.Service.MensagemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class ChatController {

    private final MensagemService mensagemService;

    public ChatController(MensagemService mensagemService) {
        this.mensagemService = mensagemService;
    }

    public static class EnviarRequest {
        public Long remetenteId;
        public Long destinatarioId;
        public String conteudo;
    }

    @PostMapping("/enviar")
    public ResponseEntity<Mensagem> enviar(@RequestBody EnviarRequest req) {
        Usuario r = new Usuario(); r.setId(req.remetenteId);
        Usuario d = new Usuario(); d.setId(req.destinatarioId);
        return ResponseEntity.ok(mensagemService.enviar(r, d, req.conteudo));
    }

    @GetMapping("/conversa")
    public ResponseEntity<List<Mensagem>> conversa(@RequestParam Long aId, @RequestParam Long bId) {
        Usuario a = new Usuario(); a.setId(aId);
        Usuario b = new Usuario(); b.setId(bId);
        return ResponseEntity.ok(mensagemService.conversa(a, b));
    }
}


