// API Base URL
const API_BASE_URL = 'http://localhost:8080';

// Elementos da página
const doacoesContainer = document.getElementById('doacoes-container');
const loadingElement = document.getElementById('loading');
const noDonationsElement = document.getElementById('no-donations');
const filterCityInput = document.getElementById('filter-city');
const filterTypeInput = document.getElementById('filter-type');
const filterBtn = document.getElementById('filter-btn');
const clearFiltersBtn = document.getElementById('clear-filters');

// Estado das doações
let allDoacoes = [];
let filteredDoacoes = [];

// Carregar doações ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    loadDoacoes();
    
    // Event listeners para filtros
    if (filterBtn) {
        filterBtn.addEventListener('click', applyFilters);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    
    // Permitir filtrar ao pressionar Enter
    if (filterCityInput) {
        filterCityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') applyFilters();
        });
    }
    
    if (filterTypeInput) {
        filterTypeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') applyFilters();
        });
    }
    
    // Escutar evento de nova doação criada
    window.addEventListener('newDonationCreated', function(event) {
        handleNewDonation(event.detail);
    });
    
    // Registrar listener no sistema de tempo real
    if (typeof realtimeManager !== 'undefined') {
        realtimeManager.on('newDonation', handleNewDonation);
    }
});

// Função para lidar com nova doação criada
function handleNewDonation(donationData) {
    const { doacao, timestamp } = donationData;
    
    // Adicionar nova doação ao início da lista (mais recente primeiro)
    allDoacoes.unshift(doacao);
    filteredDoacoes.unshift(doacao);
    
    // Mostrar notificação de atualização
    showRealtimeNotification('Nova doação disponível!', doacao);
    
    // Atualizar a interface com destaque para o novo card
    displayDoacoesWithHighlight(filteredDoacoes, doacao);
    
    // Scroll suave para o topo para mostrar o novo card
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Função para mostrar notificação de atualização em tempo real
function showRealtimeNotification(message, doacao) {
    // Criar notificação personalizada para atualização em tempo real
    const notification = document.createElement('div');
    notification.className = 'realtime-notification';
    notification.innerHTML = `
        <div class="realtime-notification-content">
            <div class="realtime-notification-icon">
                <i class="fas fa-bell"></i>
            </div>
            <div class="realtime-notification-text">
                <div class="realtime-notification-title">Feed Atualizado!</div>
                <div class="realtime-notification-message">${message}</div>
                <div class="realtime-notification-item">${doacao.titulo || doacao.nome}</div>
            </div>
            <button class="realtime-notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Adicionar ao container de notificações
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('hide');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }
    }, 5000);
}

// Função para carregar todas as doações
async function loadDoacoes() {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/doacoes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar doações');
        }
        
        const data = await response.json();
        allDoacoes = data;
        filteredDoacoes = data;
        
        displayDoacoes(filteredDoacoes);
        
    } catch (error) {
        console.error('Erro ao carregar doações:', error);
        showError('Erro ao carregar doações. Por favor, tente novamente.');
    } finally {
        hideLoading();
    }
}

// Função para exibir doações
function displayDoacoes(doacoes) {
    doacoesContainer.innerHTML = '';
    
    if (doacoes.length === 0) {
        showNoDonations();
        return;
    }
    
    hideNoDonations();
    
    doacoes.forEach(doacao => {
        const doacaoCard = createDoacaoCard(doacao);
        doacoesContainer.appendChild(doacaoCard);
    });
}

// Função para exibir doações com destaque para nova doação
function displayDoacoesWithHighlight(doacoes, newDoacao) {
    doacoesContainer.innerHTML = '';
    
    if (doacoes.length === 0) {
        showNoDonations();
        return;
    }
    
    hideNoDonations();
    
    doacoes.forEach((doacao, index) => {
        const isNew = doacao.id === newDoacao.id;
        const doacaoCard = createDoacaoCard(doacao, isNew);
        doacoesContainer.appendChild(doacaoCard);
        
        // Adicionar efeito de destaque para o novo card
        if (isNew) {
            setTimeout(() => {
                doacaoCard.classList.add('highlight-new');
                setTimeout(() => {
                    doacaoCard.classList.remove('highlight-new');
                }, 3000);
            }, 100);
        }
    });
}

// Função para criar card de doação
function createDoacaoCard(doacao, isNew = false) {
    const card = document.createElement('div');
    card.className = isNew ? 'doacao-card new-donation' : 'doacao-card';
    
    // Formatar data
    const dataValidade = new Date(doacao.dataValidade);
    const dataFormatada = dataValidade.toLocaleDateString('pt-BR');
    
    // Determinar status
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataVal = new Date(doacao.dataValidade);
    dataVal.setHours(0, 0, 0, 0);
    
    const diasRestantes = Math.ceil((dataVal - hoje) / (1000 * 60 * 60 * 24));
    let statusClass = 'status-available';
    let statusText = 'Disponível';
    
    if (diasRestantes < 0) {
        statusClass = 'status-expired';
        statusText = 'Vencido';
    } else if (diasRestantes <= 3) {
        statusClass = 'status-urgent';
        statusText = 'Urgente';
    }
    
    // Tipo de alimento
    const tipoLabels = {
        'PERECIVEL': 'Perecível',
        'NAO_PERECIVEL': 'Não Perecível',
        'PREPARADO': 'Preparado',
        'BEBIDAS': 'Bebidas'
    };
    
    const tipoLabel = tipoLabels[doacao.tipo] || doacao.tipo;
    
    card.innerHTML = `
        <div class="doacao-header">
            <div class="doacao-type">
                <i class="fas fa-tag"></i>
                <span>${tipoLabel}</span>
            </div>
            <div class="${statusClass}">${statusText}</div>
        </div>
        
        <div class="doacao-body">
            <h3 class="doacao-title">${doacao.nome}</h3>
            <p class="doacao-description">${doacao.descricao || 'Sem descrição'}</p>
            
            <div class="doacao-details">
                <div class="detail-item">
                    <i class="fas fa-balance-scale"></i>
                    <span><strong>Quantidade:</strong> ${doacao.quantidade}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span><strong>Validade:</strong> ${dataFormatada}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span><strong>Restam:</strong> ${diasRestantes >= 0 ? diasRestantes + ' dias' : 'Vencido'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span><strong>Local:</strong> ${doacao.cidade || 'Não informado'}</span>
                </div>
            </div>
        </div>
        
        <div class="doacao-footer">
            <div class="doacao-owner">
                <i class="fas fa-user"></i>
                <span>${doacao.estabelecimento?.nome || 'Doador'}</span>
            </div>
            <button class="btn-request" onclick="solicitarDoacao(${doacao.id})">
                <i class="fas fa-hand-holding-heart"></i>
                Solicitar
            </button>
        </div>
    `;
    
    return card;
}

// Função para solicitar doação
async function solicitarDoacao(doacaoId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Você precisa fazer login para solicitar uma doação.');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/doacoes/${doacaoId}/solicitar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao solicitar doação');
        }
        
        alert('Solicitação de doação enviada com sucesso!');
        
    } catch (error) {
        console.error('Erro ao solicitar doação:', error);
        alert('Erro ao solicitar doação: ' + error.message);
    }
}

// Função para aplicar filtros
function applyFilters() {
    const cityFilter = filterCityInput.value.toLowerCase().trim();
    const typeFilter = filterTypeInput.value.toLowerCase().trim();
    
    filteredDoacoes = allDoacoes.filter(doacao => {
        const cityMatch = !cityFilter || 
            (doacao.cidade && doacao.cidade.toLowerCase().includes(cityFilter));
        
        const typeMatch = !typeFilter || 
            doacao.nome.toLowerCase().includes(typeFilter) ||
            (doacao.descricao && doacao.descricao.toLowerCase().includes(typeFilter));
        
        return cityMatch && typeMatch;
    });
    
    displayDoacoes(filteredDoacoes);
}

// Função para limpar filtros
function clearFilters() {
    filterCityInput.value = '';
    filterTypeInput.value = '';
    filteredDoacoes = allDoacoes;
    displayDoacoes(filteredDoacoes);
}

// Funções auxiliares de UI
function showLoading() {
    loadingElement.style.display = 'flex';
    doacoesContainer.style.display = 'none';
    noDonationsElement.style.display = 'none';
}

function hideLoading() {
    loadingElement.style.display = 'none';
    doacoesContainer.style.display = 'grid';
}

function showNoDonations() {
    noDonationsElement.style.display = 'flex';
    doacoesContainer.style.display = 'none';
}

function hideNoDonations() {
    noDonationsElement.style.display = 'none';
    doacoesContainer.style.display = 'grid';
}

function showError(message) {
    doacoesContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}

// Adicionar estilos para mensagem de erro
const style = document.createElement('style');
style.textContent = `
    .error-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: #e74c3c;
    }
    
    .error-message i {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .error-message p {
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);

