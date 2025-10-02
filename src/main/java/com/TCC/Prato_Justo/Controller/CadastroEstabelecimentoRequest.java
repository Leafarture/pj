package com.TCC.Prato_Justo.Controller;

import jakarta.validation.constraints.*;

public class CadastroEstabelecimentoRequest {
    
    @NotBlank(message = "Nome da empresa é obrigatório")
    @Size(min = 2, max = 150, message = "Nome da empresa deve ter entre 2 e 150 caracteres")
    private String nomeEmpresa;
    
    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail deve ter formato válido")
    @Size(max = 150, message = "E-mail deve ter no máximo 150 caracteres")
    private String email;
    
    @NotBlank(message = "CNPJ é obrigatório")
    @Pattern(regexp = "\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}", message = "CNPJ deve ter formato válido (XX.XXX.XXX/XXXX-XX)")
    private String cnpj;
    
    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}", message = "Telefone deve ter formato válido ((XX) XXXXX-XXXX)")
    private String telefone;
    
    @NotBlank(message = "Rua é obrigatória")
    @Size(min = 2, max = 200, message = "Rua deve ter entre 2 e 200 caracteres")
    private String rua;
    
    @NotBlank(message = "Número é obrigatório")
    @Pattern(regexp = "\\d+", message = "Número deve conter apenas dígitos")
    private String numero;
    
    @Size(max = 100, message = "Complemento deve ter no máximo 100 caracteres")
    private String complemento;
    
    @NotBlank(message = "Cidade é obrigatória")
    @Size(min = 2, max = 100, message = "Cidade deve ter entre 2 e 100 caracteres")
    private String cidade;
    
    @NotBlank(message = "Estado é obrigatório")
    @Size(min = 2, max = 2, message = "Estado deve ter exatamente 2 caracteres")
    private String estado;
    
    @NotBlank(message = "CEP é obrigatório")
    @Pattern(regexp = "\\d{5}-\\d{3}", message = "CEP deve ter formato válido (XXXXX-XXX)")
    private String cep;
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, max = 255, message = "Senha deve ter pelo menos 8 caracteres")
    private String senha;
    
    @NotBlank(message = "Confirmação de senha é obrigatória")
    private String confirmarSenha;
    
    @AssertTrue(message = "Você deve concordar com os termos de uso")
    private Boolean termos;
    
    // Construtores
    public CadastroEstabelecimentoRequest() {}
    
    public CadastroEstabelecimentoRequest(String nomeEmpresa, String email, String cnpj, String telefone,
                                        String rua, String numero, String complemento, String cidade,
                                        String estado, String cep, String senha, String confirmarSenha, Boolean termos) {
        this.nomeEmpresa = nomeEmpresa;
        this.email = email;
        this.cnpj = cnpj;
        this.telefone = telefone;
        this.rua = rua;
        this.numero = numero;
        this.complemento = complemento;
        this.cidade = cidade;
        this.estado = estado;
        this.cep = cep;
        this.senha = senha;
        this.confirmarSenha = confirmarSenha;
        this.termos = termos;
    }
    
    // Getters e Setters
    public String getNomeEmpresa() {
        return nomeEmpresa;
    }
    
    public void setNomeEmpresa(String nomeEmpresa) {
        this.nomeEmpresa = nomeEmpresa;
    }
    
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
    
    public String getRua() {
        return rua;
    }
    
    public void setRua(String rua) {
        this.rua = rua;
    }
    
    public String getNumero() {
        return numero;
    }
    
    public void setNumero(String numero) {
        this.numero = numero;
    }
    
    public String getComplemento() {
        return complemento;
    }
    
    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }
    
    public String getCidade() {
        return cidade;
    }
    
    public void setCidade(String cidade) {
        this.cidade = cidade;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
    public String getCep() {
        return cep;
    }
    
    public void setCep(String cep) {
        this.cep = cep;
    }
    
    public String getSenha() {
        return senha;
    }
    
    public void setSenha(String senha) {
        this.senha = senha;
    }
    
    public String getConfirmarSenha() {
        return confirmarSenha;
    }
    
    public void setConfirmarSenha(String confirmarSenha) {
        this.confirmarSenha = confirmarSenha;
    }
    
    public Boolean getTermos() {
        return termos;
    }
    
    public void setTermos(Boolean termos) {
        this.termos = termos;
    }
    
    // Método para construir endereço completo
    public String getEnderecoCompleto() {
        StringBuilder endereco = new StringBuilder();
        endereco.append(rua);
        if (numero != null && !numero.trim().isEmpty()) {
            endereco.append(", ").append(numero);
        }
        if (complemento != null && !complemento.trim().isEmpty()) {
            endereco.append(", ").append(complemento);
        }
        endereco.append(", ").append(cidade);
        endereco.append(", ").append(estado);
        endereco.append(", ").append(cep);
        return endereco.toString();
    }
}
