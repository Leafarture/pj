// Função para navegação
function goTo(url) {
    window.location.href = url;
}

// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {

    // Define perfil a partir da URL (?p=pf|org) e ajusta UI
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    console.log('Parâmetro recebido:', p);
    console.log('URL atual:', window.location.href);
    
    const perfilInput = document.getElementById("perfil");
    const subtitle = document.getElementById("cadastro-subtitle");
    
    if (p === "pf") {
        console.log('Configurando perfil para Pessoa Física');
        perfilInput && (perfilInput.value = "PESSOA_FISICA");
        if (subtitle) subtitle.textContent = "Perfil selecionado: Pessoa Física";
    } else if (p === "org") {
        console.log('Configurando perfil para Estabelecimento/ONG');
        perfilInput && (perfilInput.value = "ESTABELECIMENTO_ONG");
        if (subtitle) subtitle.textContent = "Perfil selecionado: Estabelecimento / ONG";
    } else {
        console.log('Nenhum perfil específico selecionado');
        if (subtitle) subtitle.innerHTML = 'Selecione um perfil em <a class="link" href="./cadastro_perfil.html">Escolher perfil</a>.';
    }

    // Seleciona o formulário de cadastro
    const form = document.getElementById("form-cadastro");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o envio padrão do formulário

        // --------------------------
        // Campos do formulário
        // --------------------------
        const nome = document.getElementById("nome");
        const email = document.getElementById("email");
        const telefone = document.getElementById("telefone");
        const rua = document.getElementById("rua");
        const numero = document.getElementById("numero");
        const complemento = document.getElementById("complemento");
        const cidade = document.getElementById("cidade");
        const estado = document.getElementById("estado");
        const cep = document.getElementById("cep");
        const senha = document.getElementById("senha");
        const confirmar = document.getElementById("confirmar");
        const termos = document.getElementById("termos");
        const perfil = document.getElementById("perfil");

        // --------------------------
        // Elementos para mostrar erros
        // --------------------------
        const erroNome = document.getElementById("erro-nome");
        const erroEmail = document.getElementById("erro-email");
        const erroTelefone = document.getElementById("erro-telefone");
        const erroRua = document.getElementById("erro-rua");
        const erroNumero = document.getElementById("erro-numero");
        const erroComplemento = document.getElementById("erro-complemento");
        const erroCidade = document.getElementById("erro-cidade");
        const erroEstado = document.getElementById("erro-estado");
        const erroCep = document.getElementById("erro-cep");
        const erroSenha = document.getElementById("erro-senha");
        const erroConfirmar = document.getElementById("erro-confirmar");
        const erroTermos = document.getElementById("erro-termos");

        // --------------------------
        // Resetando mensagens de erro
        // --------------------------
        erroNome.textContent = "";
        erroEmail.textContent = "";
        erroTelefone.textContent = "";
        erroRua.textContent = "";
        erroNumero.textContent = "";
        erroComplemento.textContent = "";
        erroCidade.textContent = "";
        erroEstado.textContent = "";
        erroCep.textContent = "";
        erroSenha.textContent = "";
        erroConfirmar.textContent = "";
        erroTermos.textContent = "";

        let temErro = false;

        // --------------------------
        // Validações dos campos
        // --------------------------
        if (!nome.value.trim()) {
            erroNome.textContent = "Digite seu nome.";
            temErro = true;
        }

        if (!email.value.trim() || !email.value.includes("@")) {
            erroEmail.textContent = "Digite um e-mail válido.";
            temErro = true;
        }

        if (!rua.value.trim()) {
            erroRua.textContent = "Digite o nome da rua.";
            temErro = true;
        }

        if (!numero.value.trim()) {
            erroNumero.textContent = "Digite o número.";
            temErro = true;
        } else if (!/^\d+/.test(numero.value.trim())) {
            erroNumero.textContent = "Número deve conter apenas dígitos.";
            temErro = true;
        }

        if (!cidade.value.trim()) {
            erroCidade.textContent = "Digite a cidade.";
            temErro = true;
        }

        if (!estado.value) {
            erroEstado.textContent = "Selecione o estado.";
            temErro = true;
        }

        if (!cep.value.trim()) {
            erroCep.textContent = "Digite o CEP.";
            temErro = true;
        } else {
            const cepLimpo = cep.value.replace(/\D/g, '');
            if (cepLimpo.length !== 8) {
                erroCep.textContent = "CEP deve ter 8 dígitos.";
                temErro = true;
            }
        }

        if (!senha.value || senha.value.length < 8) {
            erroSenha.textContent = "A senha deve ter pelo menos 8 caracteres.";
            temErro = true;
        }

        if (confirmar.value !== senha.value) {
            erroConfirmar.textContent = "As senhas não coincidem.";
            temErro = true;
        }

        if (!termos.checked) {
            erroTermos.textContent = "Você deve aceitar os termos.";
            temErro = true;
        }

        // Se houver erro, interrompe o envio
        if (temErro) return;

        // --------------------------
        // Prepara os dados para enviar
        // --------------------------
        // Monta o endereço completo
        const enderecoCompleto = [
            rua.value.trim(),
            numero.value.trim(),
            complemento.value.trim(),
            cidade.value.trim(),
            estado.value,
            cep.value.trim()
        ].filter(Boolean).join(', ');

        const cadastroData = {
            username: nome.value.trim(),
            email: email.value.trim(),
            password: senha.value,
            perfil: perfil?.value || null,
            telefone: telefone.value.trim() || null,
            enderecoCompleto: enderecoCompleto,
            rua: rua.value.trim(),
            numero: numero.value.trim(),
            complemento: complemento.value.trim() || null,
            cidade: cidade.value.trim(),
            estado: estado.value,
            cep: cep.value.trim(),
            latitude: null, // Pode ser implementado com geolocalização
            longitude: null // Pode ser implementado com geolocalização
        };

        // --------------------------
        // Envia os dados para o backend
        // --------------------------
        try {
            console.log("Enviando dados:", cadastroData);
            
            const response = await fetch("/auth/registro", { // Rota do seu controller
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cadastroData)
            });

            console.log("Resposta do servidor:", response.status, response.statusText);

            // --------------------------
            // Verifica se o cadastro deu certo
            // --------------------------
            if (response.ok) {
                const user = await response.json(); // Recebe os dados do usuário criado
                console.log("Usuário criado:", user);
                alert("Cadastro realizado com sucesso para " + user.nome + "!");
                window.location.href = "./index.html"; // Redireciona para a página Home
            } else {
                const msg = await response.text();
                console.error("Erro do servidor:", msg);
                alert("Erro ao cadastrar: " + msg);
            }

        } catch (error) {
            console.error("Erro ao enviar cadastro:", error);
            alert("Erro ao conectar com o servidor: " + error.message);
        }
    });

    // Atualiza o ano no rodapé automaticamente
    document.getElementById("ano").textContent = new Date().getFullYear();

    // --------------------------
    // Funcionalidades adicionais
    // --------------------------
    
    // Formatação de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 8) {
                value = value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
                e.target.value = value;
            }
        });

        // Busca CEP automaticamente
        cepInput.addEventListener('blur', async function(e) {
            const cepValue = e.target.value.replace(/\D/g, '');
            if (cepValue.length === 8) {
                try {
                    console.log('Buscando CEP:', cepValue);
                    const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
                    const data = await response.json();
                    
                    if (!data.erro) {
                        console.log('CEP encontrado:', data);
                        const ruaInput = document.getElementById('rua');
                        const cidadeInput = document.getElementById('cidade');
                        const estadoInput = document.getElementById('estado');
                        
                        if (ruaInput && data.logradouro) {
                            ruaInput.value = data.logradouro;
                        }
                        if (cidadeInput && data.localidade) {
                            cidadeInput.value = data.localidade;
                        }
                        if (estadoInput && data.uf) {
                            estadoInput.value = data.uf;
                        }
                    } else {
                        console.log('CEP não encontrado');
                    }
                } catch (error) {
                    console.log('Erro ao buscar CEP:', error);
                }
            }
        });
    }

    // Formatação de telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
                } else {
                    value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
                }
                e.target.value = value;
            }
        });
    }

    // Validação do número (apenas dígitos)
    const numeroInput = document.getElementById('numero');
    if (numeroInput) {
        numeroInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
});
