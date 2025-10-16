// Aguardar o sistema de autenticação carregar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação antes de permitir cadastro
    setTimeout(() => {
        checkAuthentication();
    }, 100);
});

function checkAuthentication() {
    if (!window.authManager || !window.authManager.isAuthenticated()) {
        // Usuário não logado - redirecionar para login
        if (confirm('Você precisa estar logado para fazer uma doação.\n\nDeseja fazer login agora?')) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'index.html';
        }
        return;
    }
    
    // Usuário logado - inicializar formulário
    initializeForm();
}

function initializeForm() {
    // Seleciona o formulário
    const foodForm = document.getElementById('foodRegistrationForm');

    // Evento de envio do formulário
    foodForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita o reload da página

    const foodData = {
        titulo: document.getElementById('foodName').value,
        tipoAlimento: document.getElementById('foodType').value,
        quantidade: parseFloat(document.getElementById('quantity').value) || null,
        validade: document.getElementById('expiryDate').value,
        descricao: document.getElementById('description').value,
        endereco: document.getElementById('address').value,
        cidade: document.getElementById('city').value,
        latitude: document.getElementById('lat').value ? parseFloat(document.getElementById('lat').value) : null,
        longitude: document.getElementById('lng').value ? parseFloat(document.getElementById('lng').value) : null
    };

    console.log('Alimento cadastrado:', foodData);

    // Enviar para o backend (doações)
    const apiBase = window.location.origin;
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
    };
    
    // Adicionar token de autenticação se disponível
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    fetch(apiBase + '/doacoes', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(foodData),
    })
    .then(async (response) => {
        const text = await response.text();
        if (!response.ok) {
            throw new Error(text || 'Erro ao cadastrar doação');
        }
        try { return JSON.parse(text); } catch(_) { return text; }
    })
    .then(data => {
        console.log('Sucesso:', data);
        alert('Doação cadastrada com sucesso!');
        foodForm.reset();
        
        // Redirecionar para a página de doações após cadastro
        setTimeout(() => {
            window.location.href = 'minhas-doacoes.html';
        }, 1500);
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert('Falha ao cadastrar doação: ' + error.message);
    });
});

// Tabs de localização
const locationTabs = document.querySelectorAll('.location-tab');
const locationContents = document.querySelectorAll('.location-tab-content');

locationTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Remove active de todas as tabs
        locationTabs.forEach(t => t.classList.remove('active'));
        locationContents.forEach(c => c.classList.remove('active'));
        
        // Ativa a tab clicada
        tab.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Botão de geolocalização
const getLocationBtn = document.getElementById('getLocationBtn');
const locationStatus = document.getElementById('locationStatus');
let map, userMarker;
initMap();

getLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        locationStatus.textContent = 'Localizando...';
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            locationStatus.textContent = `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;
            document.getElementById('lat').value = lat;
            document.getElementById('lng').value = lon;
            setUserLocationOnMap(lat, lon);
            loadNearbyDonations(lat, lon);
        }, (err) => {
            locationStatus.textContent = 'Não foi possível obter localização';
        });
    } else {
        locationStatus.textContent = 'Geolocalização não suportada';
    }
});

// Busca por CEP
const cepInput = document.getElementById('cep');
const addressCepInput = document.getElementById('addressCep');
const cityCepInput = document.getElementById('cityCep');

cepInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    e.target.value = value;
});

cepInput.addEventListener('blur', async () => {
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length === 8) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            
            if (!data.erro) {
                addressCepInput.value = `${data.logradouro}, ${data.bairro}`;
                cityCepInput.value = data.localidade;
                
                // Preenche os campos principais
                document.getElementById('address').value = addressCepInput.value;
                document.getElementById('city').value = cityCepInput.value;
            } else {
                alert('CEP não encontrado');
            }
        } catch (error) {
            alert('Erro ao buscar CEP');
        }
    }
});

// Busca com filtros
const btnBuscar = document.getElementById('btnBuscar');
if (btnBuscar) btnBuscar.addEventListener('click', async () => {
    const tipo = document.getElementById('searchTipo').value;
    const cidade = document.getElementById('searchCidade').value;
    const params = new URLSearchParams({ tipo, cidade });
    const res = await fetch(window.location.origin + '/doacoes?' + params.toString());
    const itens = await res.json();
    renderResultados(itens);
});

// Próximas por geolocalização
const btnPerto = document.getElementById('btnPerto');
if (btnPerto) btnPerto.addEventListener('click', async () => {
    if (!navigator.geolocation) return alert('Geolocalização não suportada');
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const res = await fetch(`${window.location.origin}/doacoes/proximas?lat=${lat}&lng=${lng}&raio_km=10`);
        const itens = await res.json();
        renderResultados(itens);
        setUserLocationOnMap(lat, lng);
        renderMarkers(itens);
    }, () => alert('Não foi possível obter localização'));
});

function renderResultados(itens) {
    const ul = document.getElementById('listaResultados');
    ul.innerHTML = '';
    itens.forEach(i => {
        const li = document.createElement('li');
        li.textContent = `${i.titulo} - ${i.tipoAlimento || ''} - ${i.cidade || ''}`;
        ul.appendChild(li);
    });
}

function initMap() {
    const el = document.getElementById('map');
    if (!el || typeof L === 'undefined') return;
    map = L.map('map').setView([-23.55, -46.63], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
}

function setUserLocationOnMap(lat, lng) {
    if (!map) return;
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.marker([lat, lng]).addTo(map).bindPopup('Você está aqui');
    map.setView([lat, lng], 14);
}

function renderMarkers(items) {
    if (!map) return;
    items.filter(i => i.latitude && i.longitude).forEach(i => {
        L.marker([i.latitude, i.longitude]).addTo(map).bindPopup(`<b>${i.titulo || 'Doação'}</b><br/>${i.tipoAlimento || ''} - ${i.cidade || ''}`);
    });
}

async function loadNearbyDonations(lat, lng) {
    try {
        const res = await fetch(`${window.location.origin}/doacoes/proximas?lat=${lat}&lng=${lng}&raio_km=10`);
        const itens = await res.json();
        renderResultados(itens);
        renderMarkers(itens);
    } catch (e) {
        console.error(e);
    }
}

// Chat de ajuda (contato)
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
document.getElementById('helpFechar').addEventListener('click', () => helpModal.style.display = 'none');
helpBtn.addEventListener('click', () => helpModal.style.display = 'flex');
document.getElementById('helpEnviar').addEventListener('click', async () => {
    const remetente = document.getElementById('helpRemetente').value || '0';
    const conteudo = document.getElementById('helpMensagem').value;
    if (!conteudo) return alert('Digite sua mensagem');
    const payload = { remetenteId: parseInt(remetente, 10), destinatarioId: 1, conteudo };
    await fetch('/chat/enviar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    alert('Mensagem enviada! Nossa equipe responderá em breve.');
    helpModal.style.display = 'none';
    document.getElementById('helpMensagem').value = '';
});

// Chat-bot simples: sugestões automáticas
const helpMensagem = document.getElementById('helpMensagem');
if (helpMensagem) {
    helpMensagem.addEventListener('input', () => {
        const txt = helpMensagem.value.toLowerCase();
        const sugestoes = [];
        if (txt.includes('localiza') || txt.includes('gps')) sugestoes.push('Dica: clique em "Usar Minha Localização" e autorize o navegador.');
        if (txt.includes('erro') || txt.includes('cadast')) sugestoes.push('Verifique os campos obrigatórios e tente novamente.');
        if (txt.includes('mapa')) sugestoes.push('O mapa usa OpenStreetMap. Necessita internet ativa.');
        if (sugestoes.length) {
            // Exibir como placeholder de resposta do bot
            helpMensagem.setAttribute('placeholder', 'Sugestão: ' + sugestoes[0]);
        }
    });
}

// Fechar a função initializeForm
}