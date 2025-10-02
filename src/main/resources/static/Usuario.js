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
        const endereco = document.getElementById("endereco");
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
        const erroEndereco = document.getElementById("erro-endereco");
        const erroSenha = document.getElementById("erro-senha");
        const erroConfirmar = document.getElementById("erro-confirmar");
        const erroTermos = document.getElementById("erro-termos");

        // --------------------------
        // Resetando mensagens de erro
        // --------------------------
        erroNome.textContent = "";
        erroEmail.textContent = "";
        erroTelefone.textContent = "";
        erroEndereco.textContent = "";
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

        if (!endereco.value.trim()) {
            erroEndereco.textContent = "Digite seu endereço completo.";
            temErro = true;
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
        const cadastroData = {
            username: nome.value.trim(),
            email: email.value.trim(),
            password: senha.value,
            perfil: perfil?.value || null,
            telefone: telefone.value.trim() || null,
            enderecoCompleto: endereco.value.trim(),
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
});
