package com.TCC.Prato_Justo.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doacao")
public class Doacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_doacao")
    private Long id;

    @ManyToOne(optional = true)
    @JoinColumn(name = "id_doador")
    private Usuario doador;

    @ManyToOne
    @JoinColumn(name = "id_estabelecimento")
    private Estabelecimento estabelecimentoDestino;

    @Column(name = "titulo", length = 150, nullable = false)
    private String titulo;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "tipo_alimento", length = 80)
    private String tipoAlimento;

    @Column(name = "quantidade")
    private Double quantidade;

    @Column(name = "cidade", length = 100)
    private String cidade;

    @Column(name = "endereco", length = 255)
    private String endereco;

    @Column(name = "latitude", columnDefinition = "DECIMAL(10,8)")
    private Double latitude;

    @Column(name = "longitude", columnDefinition = "DECIMAL(11,8)")
    private Double longitude;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getDoador() { return doador; }
    public void setDoador(Usuario doador) { this.doador = doador; }

    public Estabelecimento getEstabelecimentoDestino() { return estabelecimentoDestino; }
    public void setEstabelecimentoDestino(Estabelecimento estabelecimentoDestino) { this.estabelecimentoDestino = estabelecimentoDestino; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getTipoAlimento() { return tipoAlimento; }
    public void setTipoAlimento(String tipoAlimento) { this.tipoAlimento = tipoAlimento; }

    public Double getQuantidade() { return quantidade; }
    public void setQuantidade(Double quantidade) { this.quantidade = quantidade; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}


