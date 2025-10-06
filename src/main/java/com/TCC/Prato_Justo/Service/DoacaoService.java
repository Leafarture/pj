package com.TCC.Prato_Justo.Service;

import com.TCC.Prato_Justo.Interface.DoacaoRepository;
import com.TCC.Prato_Justo.Model.Doacao;
import com.TCC.Prato_Justo.Model.Usuario;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoacaoService {

    private final DoacaoRepository doacaoRepository;

    public DoacaoService(DoacaoRepository doacaoRepository) {
        this.doacaoRepository = doacaoRepository;
    }

    public Doacao criar(Doacao nova, Usuario doador) {
        if (doador != null) {
            nova.setDoador(doador);
        }
        return doacaoRepository.save(nova);
    }

    public List<Doacao> listarAtivas(String tipoAlimento, String cidade) {
        List<Doacao> base = doacaoRepository.findByAtivoTrue();
        return base.stream()
                .filter(d -> tipoAlimento == null || (d.getTipoAlimento() != null && d.getTipoAlimento().toLowerCase().contains(tipoAlimento.toLowerCase())))
                .filter(d -> cidade == null || (d.getCidade() != null && d.getCidade().equalsIgnoreCase(cidade)))
                .sorted(Comparator.comparing(Doacao::getCriadoEm).reversed())
                .collect(Collectors.toList());
    }

    public Optional<Doacao> obter(Long id) {
        return doacaoRepository.findById(id);
    }

    public Doacao atualizar(Long id, Doacao atualizada) {
        return doacaoRepository.findById(id).map(d -> {
            d.setTitulo(atualizada.getTitulo());
            d.setDescricao(atualizada.getDescricao());
            d.setTipoAlimento(atualizada.getTipoAlimento());
            d.setQuantidade(atualizada.getQuantidade());
            d.setCidade(atualizada.getCidade());
            d.setEndereco(atualizada.getEndereco());
            d.setLatitude(atualizada.getLatitude());
            d.setLongitude(atualizada.getLongitude());
            d.setAtivo(atualizada.getAtivo());
            return doacaoRepository.save(d);
        }).orElseThrow(() -> new IllegalArgumentException("Doação não encontrada"));
    }

    public void remover(Long id) {
        doacaoRepository.deleteById(id);
    }

    public List<Doacao> proximas(Double latitude, Double longitude, Double raioKm) {
        if (latitude == null || longitude == null || raioKm == null) return doacaoRepository.findAllComCoordenadas();

        double raioKmLocal = Math.max(raioKm, 0);
        return doacaoRepository.findAllComCoordenadas().stream()
                .filter(d -> {
                    if (d.getLatitude() == null || d.getLongitude() == null) return false;
                    double distancia = distanciaKm(latitude, longitude, d.getLatitude(), d.getLongitude());
                    return distancia <= raioKmLocal;
                })
                .sorted((a, b) -> {
                    double da = distanciaKm(latitude, longitude, a.getLatitude(), a.getLongitude());
                    double db = distanciaKm(latitude, longitude, b.getLatitude(), b.getLongitude());
                    return Double.compare(da, db);
                })
                .collect(Collectors.toList());
    }

    private double distanciaKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371.0; // raio da Terra em km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}


