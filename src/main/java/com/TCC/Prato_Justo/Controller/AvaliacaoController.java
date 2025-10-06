package com.TCC.Prato_Justo.Controller;

import com.TCC.Prato_Justo.Model.Avaliacao;
import com.TCC.Prato_Justo.Model.Estabelecimento;
import com.TCC.Prato_Justo.Model.Usuario;
import com.TCC.Prato_Justo.Service.AvaliacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avaliacoes")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    public static class AvaliarRequest {
        public Long usuarioId;
        public Long estabelecimentoId;
        public Integer nota;
        public String comentario;
    }

    @PostMapping
    public ResponseEntity<Avaliacao> avaliar(@RequestBody AvaliarRequest req) {
        Usuario u = new Usuario(); u.setId(req.usuarioId);
        Estabelecimento e = new Estabelecimento(); e.setId(req.estabelecimentoId);
        return ResponseEntity.ok(avaliacaoService.avaliar(u, e, req.nota, req.comentario));
    }

    @GetMapping("/estabelecimento/{id}")
    public ResponseEntity<List<Avaliacao>> listar(@PathVariable Long id) {
        Estabelecimento e = new Estabelecimento(); e.setId(id);
        return ResponseEntity.ok(avaliacaoService.listarPorEstabelecimento(e));
    }

    @GetMapping("/estabelecimento/{id}/media")
    public ResponseEntity<Double> media(@PathVariable Long id) {
        return ResponseEntity.ok(avaliacaoService.media(id));
    }
}


