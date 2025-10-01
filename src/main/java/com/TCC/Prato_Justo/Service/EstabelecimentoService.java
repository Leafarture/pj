package com.TCC.Prato_Justo.Service;

import com.TCC.Prato_Justo.Interface.AnthEstabelecimentoRepository;
import com.TCC.Prato_Justo.Model.Estabelecimento;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class EstabelecimentoService {

        private final AnthEstabelecimentoRepository estabelecimentoRepository;

    public EstabelecimentoService(AnthEstabelecimentoRepository anthEstabelecimentoRepository) {
        this.estabelecimentoRepository = anthEstabelecimentoRepository;
    }


    // Criar ou atualizar
        public Estabelecimento salvar(Estabelecimento estabelecimento) {
            return estabelecimentoRepository.save(estabelecimento);
        }

        // Listar todos
        public List<Estabelecimento> listarTodos() {
            return estabelecimentoRepository.findAll();
        }

        // Buscar por ID
        public Optional<Estabelecimento> buscarPorId(Long id) {
            return estabelecimentoRepository.findById(id);
        }

        // Deletar
        public void deletar(Long id) {
            estabelecimentoRepository.deleteById(id);
        }
    }



