package com.TCC.Prato_Justo.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensagem")
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensagem")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_remetente")
    private Usuario remetente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_destinatario")
    private Usuario destinatario;

    @Column(name = "conteudo", columnDefinition = "TEXT", nullable = false)
    private String conteudo;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @Column(name = "lido", nullable = false)
    private Boolean lido = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getRemetente() { return remetente; }
    public void setRemetente(Usuario remetente) { this.remetente = remetente; }

    public Usuario getDestinatario() { return destinatario; }
    public void setDestinatario(Usuario destinatario) { this.destinatario = destinatario; }

    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }

    public Boolean getLido() { return lido; }
    public void setLido(Boolean lido) { this.lido = lido; }
}


