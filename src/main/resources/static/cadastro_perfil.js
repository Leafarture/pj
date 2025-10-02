// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    const ano = document.getElementById('ano');
    if (ano) ano.textContent = new Date().getFullYear();

    function goTo(url) {
        console.log('Navegando para:', url);
        console.log('URL atual:', window.location.href);
        window.location.href = url;
    }

    const optPessoa = document.getElementById('opt-pessoa');
    const optOrg = document.getElementById('opt-org');

    console.log('Elementos encontrados:', {
        optPessoa: !!optPessoa,
        optOrg: !!optOrg
    });

    if (optPessoa) {
        optPessoa.addEventListener('click', () => {
            // Direciona para a página de cadastro de pessoa física
            console.log('Clicou em Pessoa Física - Navegando para cadastro de pessoa física');
            goTo('./Usuario.html?p=pf');
        });
    } else {
        console.error('Elemento opt-pessoa não encontrado!');
    }

    if (optOrg) {
        optOrg.addEventListener('click', () => {
            // Direciona para a página específica de cadastro de estabelecimento
            console.log('Clicou em Estabelecimento/ONG - Navegando para cadastro de estabelecimento');
            goTo('./Estabelecimento.html');
        });
    } else {
        console.error('Elemento opt-org não encontrado!');
    }
});

