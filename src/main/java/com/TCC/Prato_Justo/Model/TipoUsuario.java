package com.TCC.Prato_Justo.Model;

public enum TipoUsuario {
    INDIVIDUAL("individual"),
    ESTABELECIMENTO("estabelecimento"), 
    ONG("ong"),
    RECEPTOR("receptor");

    private final String valor;

    TipoUsuario(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    public static TipoUsuario fromString(String valor) {
        for (TipoUsuario tipo : TipoUsuario.values()) {
            if (tipo.valor.equalsIgnoreCase(valor)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de usuário inválido: " + valor);
    }
}
