const ano = document.getElementById('ano');
if (ano) ano.textContent = new Date().getFullYear();

function goTo(url) {
  window.location.href = url;
}

document.getElementById('opt-pessoa')?.addEventListener('click', () => {
  // Ajuste o destino conforme o fluxo do projeto
  goTo('./cadastro.html?p=pf');
});

document.getElementById('opt-org')?.addEventListener('click', () => {
  // Direciona para a página específica de cadastro de estabelecimento
  goTo('./cadastro_estabelecimento.html');
});

