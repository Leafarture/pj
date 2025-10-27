package com.TCC.Prato_Justo.Controller;

import com.TCC.Prato_Justo.Model.Doacao;
import com.TCC.Prato_Justo.Model.Usuario;
import com.TCC.Prato_Justo.Service.AuthService;
import com.TCC.Prato_Justo.Service.DoacaoService;
import com.TCC.Prato_Justo.Service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/doacoes")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class DoacaoController {

    private final DoacaoService doacaoService;
    
    @Autowired
    private AuthService authService;

    @Autowired
    private FileUploadService fileUploadService;

    public DoacaoController(DoacaoService doacaoService) {
        this.doacaoService = doacaoService;
    }

    public static class CriarDoacaoRequest {
        public Long doadorId; // opcional
        public Long estabelecimentoDestinoId; // opcional
        public String titulo;
        public String descricao;
        public String tipoAlimento;
        public Double quantidade;
        public String cidade;
        public String endereco;
        public Double latitude;
        public Double longitude;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Doacao dto, 
                                   @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            System.out.println("=== RECEBENDO DOAÇÃO ===");
            System.out.println("Título: " + dto.getTitulo());
            System.out.println("Tipo: " + dto.getTipoAlimento());
            System.out.println("Cidade: " + dto.getCidade());
            System.out.println("Endereço: " + dto.getEndereco());
            System.out.println("Data Validade: " + dto.getDataValidade());
            System.out.println("Data Coleta: " + dto.getDataColeta());
            System.out.println("Imagem: " + dto.getImagem());
            System.out.println("Lat: " + dto.getLatitude());
            System.out.println("Lng: " + dto.getLongitude());
            
            // Validar campos obrigatórios
            if (dto.getTitulo() == null || dto.getTitulo().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Título é obrigatório");
            }
            if (dto.getCidade() == null || dto.getCidade().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Cidade é obrigatória");
            }
            if (dto.getEndereco() == null || dto.getEndereco().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Endereço é obrigatório");
            }
            
            // Validar datas
            LocalDate hoje = LocalDate.now();
            
            if (dto.getDataValidade() != null) {
                // Data de validade deve ser posterior a hoje
                if (!dto.getDataValidade().isAfter(hoje)) {
                    return ResponseEntity.badRequest().body("A data de validade deve ser posterior a hoje");
                }
            }
            
            if (dto.getDataColeta() != null) {
                // Data de coleta deve ser hoje ou posterior
                if (dto.getDataColeta().isBefore(hoje)) {
                    return ResponseEntity.badRequest().body("A data de coleta não pode ser anterior a hoje");
                }
            }
            
            // Validar que data de validade é posterior à data de coleta
            if (dto.getDataValidade() != null && dto.getDataColeta() != null) {
                if (!dto.getDataValidade().isAfter(dto.getDataColeta())) {
                    return ResponseEntity.badRequest().body("A data de validade deve ser posterior à data de coleta");
                }
            }
            
            // Obter usuário logado se token fornecido
            Usuario doador = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (authService.isTokenValid(token)) {
                    doador = authService.getCurrentUser(token);
                }
            }
            
            Doacao criada = doacaoService.criar(dto, doador);
            System.out.println("Doação criada com ID: " + criada.getId());
            return ResponseEntity.ok(criada);
        } catch (Exception ex) {
            System.err.println("ERRO DETALHADO:");
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Erro interno: " + ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Doacao>> listar(@RequestParam(required = false) String tipo,
                                               @RequestParam(required = false) String cidade) {
        return ResponseEntity.ok(doacaoService.listarAtivas(tipo, cidade));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doacao> obter(@PathVariable Long id) {
        Optional<Doacao> d = doacaoService.obter(id);
        return d.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doacao> atualizar(@PathVariable Long id, @RequestBody Doacao dto) {
        return ResponseEntity.ok(doacaoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        doacaoService.remover(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/proximas")
    public ResponseEntity<List<Doacao>> proximas(@RequestParam(required = false) Double lat,
                                                 @RequestParam(required = false) Double lng,
                                                 @RequestParam(required = false, name = "raio_km") Double raioKm) {
        return ResponseEntity.ok(doacaoService.proximas(lat, lng, raioKm));
    }

    @GetMapping("/minhas")
    public ResponseEntity<?> minhasDoacoes(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Token não fornecido");
            }

            String token = authHeader.substring(7);
            if (!authService.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Token inválido");
            }

            Usuario usuario = authService.getCurrentUser(token);
            if (usuario == null) {
                return ResponseEntity.status(404).body("Usuário não encontrado");
            }

            List<Doacao> doacoes = doacaoService.listarPorDoador(usuario.getId());
            return ResponseEntity.ok(doacoes);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno: " + e.getMessage());
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadFoodImage(
            @RequestParam("image") MultipartFile file,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            System.out.println("=== RECEBENDO UPLOAD DE IMAGEM DE ALIMENTO ===");
            System.out.println("Nome do arquivo: " + file.getOriginalFilename());
            System.out.println("Tamanho: " + file.getSize() + " bytes");
            System.out.println("Tipo: " + file.getContentType());

            // Validar token (opcional, mas recomendado)
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (!authService.isTokenValid(token)) {
                    return ResponseEntity.status(401).body("Token inválido");
                }
            }

            // Salvar a imagem
            String imageUrl = fileUploadService.saveFoodImage(file, null);
            
            System.out.println("✅ Imagem salva em: " + imageUrl);

            // Retornar a URL da imagem
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            response.put("message", "Imagem enviada com sucesso");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Erro ao fazer upload da imagem: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}


