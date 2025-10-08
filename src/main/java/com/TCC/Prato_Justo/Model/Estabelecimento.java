package com.TCC.Prato_Justo.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "estabelecimento")
public class Estabelecimento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estabelecimento")
    private Long id;

    @Column(name = "nome_estabelecimento", length = 150, nullable = false)
    private String nomeEstabelecimento;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "senha_estabelecimento", length = 255, nullable = false)
    private String senhaEstabelecimento;

    @Column(name = "cnpj", length = 18, nullable = false, unique = true)
    private String cnpj;

    @Column(name = "telefone", length = 15, nullable = false)
    private String telefone;

    @Column(name = "endereco_completo", columnDefinition = "TEXT", nullable = false)
    private String enderecoCompleto;

//    @Column(name = "latitude", columnDefinition = "DECIMAL(10,8)")
//    private Double latitude;
//
//    @Column(name = "longitude", columnDefinition = "DECIMAL(11,8)")
//    private Double longitude;

    // Relacionamento: cada estabelecimento pertence a um usuário
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // Getters e setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeEstabelecimento() {
        return nomeEstabelecimento;
    }

    public void setNomeEstabelecimento(String nomeEstabelecimento) {
        this.nomeEstabelecimento = nomeEstabelecimento;
    }

    public String getEnderecoCompleto() {
        return enderecoCompleto;
    }

    public void setEnderecoCompleto(String enderecoCompleto) {
        this.enderecoCompleto = enderecoCompleto;
    }

//    public Double getLatitude() {
//        return latitude;
//    }
//
//    public void setLatitude(Double latitude) {
//        this.latitude = latitude;
//    }
//
//    public Double getLongitude() {
//        return longitude;
//    }
//
//    public void setLongitude(Double longitude) {
//        this.longitude = longitude;
//    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getSenhaEstabelecimento() {
        return senhaEstabelecimento;
    }

    public void setSenhaEstabelecimento(String senhaEstabelecimento) {
        this.senhaEstabelecimento = senhaEstabelecimento;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
