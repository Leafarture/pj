// === JAVASCRIPT MELHORADO - MAIS INTERATIVO E PROFISSIONAL ===

// Esperar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Prato Justo - Inicializando versão melhorada...');
    
    // Aguardar o sistema de autenticação carregar
    setTimeout(() => {
        initializeAuthIntegration();
    }, 100);

    // ===== LOADING SCREEN MELHORADA =====
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        // Adicionar efeito de progresso
        const progressBar = document.createElement('div');
        progressBar.className = 'loading-progress';
        progressBar.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="loading-text">Carregando Prato Justo...</div>
        `;
        loadingScreen.appendChild(progressBar);

        // Simular progresso
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');
                        setTimeout(() => loadingScreen.remove(), 800);
                    }, 500);
                }, 500);
            }
            
            const progressFill = loadingScreen.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
        }, 200);
    }

    // ===== HEADER INTELIGENTE =====
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrolled = window.scrollY > 50;
        
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            // Scroll para baixo - esconder header
            header.classList.add('hidden');
        } else {
            // Scroll para cima - mostrar header
            header.classList.remove('hidden');
        }
        
        if (scrolled) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = window.scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // ===== SMOOTH SCROLLING AVANÇADO =====
    const navLinks = document.querySelectorAll('.nav-link, .footer-section a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;

                    // Adicionar efeito visual no link clicado
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 200);

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Fechar menu mobile se aberto
                    const mobileMenu = document.querySelector('.mobile-menu');
                    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                    }
                }
            }
        });
    });

    // ===== ANIMAÇÕES DE SCROLL OTIMIZADAS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animação em cascata para elementos filhos
                const children = entry.target.querySelectorAll('[data-animate-child]');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate');
                    }, index * 150);
                });
            }
        });
    }, observerOptions);

    // Observar todos os elementos com data-animate
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });

    // ===== CONTADOR ANIMADO MELHORADO =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    function animateNumbers() {
        if (counted) return;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const suffix = stat.getAttribute('data-suffix') || '';
            let current = 0;
            const duration = 2500;
            const startTime = performance.now();

            function updateNumber(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function para animação suave
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                current = Math.floor(target * easeOutQuart);
                
                stat.textContent = current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target + suffix;
                    // Efeito de comemoração
                    stat.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        stat.style.transform = 'scale(1)';
                    }, 300);
                }
            }

            requestAnimationFrame(updateNumber);
        });
        counted = true;
    }

    // Observar seção de estatísticas
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateNumbers, 500);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // ===== BOTÕES INTERATIVOS =====
    const donateButtons = document.querySelectorAll('.btn-primary, .donate-btn');
    donateButtons.forEach(button => {
        // Efeito de ripple
        button.addEventListener('click', function(e) {
            // Criar efeito ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            // Remover ripple após animação
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Redirecionar baseado na autenticação
            setTimeout(() => {
                if (window.authManager && window.authManager.isAuthenticated()) {
                    window.location.href = 'cadastro_alimento.html';
                } else {
                    window.location.href = 'login.html';
                }
            }, 300);
        });
    });

    // ===== MENU MOBILE AVANÇADO =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = mobileMenuBtn.classList.toggle('active');
            
            if (navMenu) {
                navMenu.classList.toggle('active');
            }
            
            if (mobileMenu) {
                mobileMenu.classList.toggle('active');
            }

            // Animação dos hamburguer lines
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (isActive) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }

            // Prevenir scroll do body quando menu aberto
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                if (mobileMenu) mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===== EFEITOS HOVER AVANÇADOS =====
    const interactiveElements = document.querySelectorAll('.card, .feature, .step, .impact-card, .btn, .nav-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        element.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // ===== SISTEMA DE NOTIFICAÇÕES MELHORADO =====
    function showNotification(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type]}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
            <div class="notification-progress"></div>
        `;

        document.body.appendChild(notification);

        // Animação de entrada
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Botão de fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            closeNotification(notification);
        });

        // Progress bar
        const progressBar = notification.querySelector('.notification-progress');
        progressBar.style.animation = `progress ${duration}ms linear`;

        // Auto-remover
        const timeout = setTimeout(() => {
            closeNotification(notification);
        }, duration);

        // Pausar progresso no hover
        notification.addEventListener('mouseenter', () => {
            progressBar.style.animationPlayState = 'paused';
        });

        notification.addEventListener('mouseleave', () => {
            progressBar.style.animationPlayState = 'running';
        });

        function closeNotification(notif) {
            notif.classList.remove('show');
            clearTimeout(timeout);
            setTimeout(() => {
                if (notif.parentNode) {
                    notif.parentNode.removeChild(notif);
                }
            }, 300);
        }
    }

    // ===== TABS DE BUSCA INTERATIVAS =====
    const searchTabs = document.querySelectorAll('.tab-btn');
    const searchContents = document.querySelectorAll('.tab-content');

    searchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Animação de transição
            searchContents.forEach(content => {
                if (content.classList.contains('active')) {
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(10px)';
                }
            });

            setTimeout(() => {
                // Remove active de todas
                searchTabs.forEach(t => t.classList.remove('active'));
                searchContents.forEach(c => c.classList.remove('active'));

                // Ativa a tab clicada
                tab.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                targetContent.classList.add('active');

                // Animação de entrada
                requestAnimationFrame(() => {
                    targetContent.style.opacity = '1';
                    targetContent.style.transform = 'translateY(0)';
                });
            }, 200);
        });
    });

    // ===== SISTEMA DE BUSCA AVANÇADO =====
    function initSearchSystem() {
        const homeBtnBuscar = document.getElementById('homeBtnBuscar');
        const homeBtnPerto = document.getElementById('homeBtnPerto');
        const homeBtnCep = document.getElementById('homeBtnCep');
        const homeResultados = document.getElementById('homeResultados');

        // Busca por filtros
        if (homeBtnBuscar) {
            homeBtnBuscar.addEventListener('click', async () => {
                const tipo = document.getElementById('homeSearchTipo').value;
                const cidade = document.getElementById('homeSearchCidade').value;
                
                if (!tipo && !cidade) {
                    showNotification('Por favor, preencha pelo menos um filtro', 'warning');
                    return;
                }

                showNotification('Buscando doações...', 'info');
                
                // Simulação de busca (substitua pela sua API)
                setTimeout(() => {
                    const mockResults = [
                        { titulo: 'Frutas Frescas', tipoAlimento: 'Frutas', cidade: 'São Paulo', distancia: '2km' },
                        { titulo: 'Verduras Orgânicas', tipoAlimento: 'Verduras', cidade: 'São Paulo', distancia: '3km' },
                        { titulo: 'Pães do Dia', tipoAlimento: 'Pães', cidade: 'São Paulo', distancia: '1km' }
                    ].filter(item => 
                        (!tipo || item.tipoAlimento.toLowerCase().includes(tipo.toLowerCase())) &&
                        (!cidade || item.cidade.toLowerCase().includes(cidade.toLowerCase()))
                    );

                    renderHomeResultados(mockResults);
                    showNotification(`Encontradas ${mockResults.length} doações`, 'success');
                }, 1500);
            });
        }

        // Busca por localização
        if (homeBtnPerto) {
            homeBtnPerto.addEventListener('click', () => {
                if (!navigator.geolocation) {
                    showNotification('Geolocalização não é suportada pelo seu navegador', 'error');
                    return;
                }

                showNotification('Obtendo sua localização...', 'info');

                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;
                        
                        showNotification('Buscando doações próximas...', 'info');
                        
                        // Simulação (substitua pela sua API)
                        setTimeout(() => {
                            const mockResults = [
                                { titulo: 'Restaurante do Zé', tipoAlimento: 'Variados', cidade: 'São Paulo', distancia: '0.5km' },
                                { titulo: 'Hortifruti Fresh', tipoAlimento: 'Frutas e Verduras', cidade: 'São Paulo', distancia: '1.2km' }
                            ];
                            
                            renderHomeResultados(mockResults);
                            showNotification(`Encontradas ${mockResults.length} doações próximas`, 'success');
                        }, 1000);
                    },
                    (error) => {
                        let message = 'Não foi possível obter sua localização';
                        if (error.code === error.PERMISSION_DENIED) {
                            message = 'Permissão de localização negada. Por favor, permita o acesso à localização.';
                        }
                        showNotification(message, 'error');
                    },
                    { timeout: 10000 }
                );
            });
        }

        // Busca por CEP
        if (homeBtnCep) {
            homeBtnCep.addEventListener('click', async () => {
                const cepInput = document.getElementById('homeSearchCep');
                const cep = cepInput.value.replace(/\D/g, '');
                
                if (cep.length !== 8) {
                    showNotification('CEP deve ter 8 dígitos', 'warning');
                    cepInput.focus();
                    return;
                }

                showNotification('Buscando endereço...', 'info');

                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();

                    if (data.erro) {
                        showNotification('CEP não encontrado', 'error');
                        return;
                    }

                    showNotification(`Buscando em ${data.localidade}...`, 'info');
                    
                    // Simulação (substitua pela sua API)
                    setTimeout(() => {
                        const mockResults = [
                            { titulo: 'Mercado Central', tipoAlimento: 'Variados', cidade: data.localidade, distancia: 'Centro' },
                            { titulo: 'Feira Livre', tipoAlimento: 'Hortifruti', cidade: data.localidade, distancia: '2km do centro' }
                        ];
                        
                        renderHomeResultados(mockResults);
                        showNotification(`Encontradas ${mockResults.length} doações em ${data.localidade}`, 'success');
                    }, 1000);

                } catch (error) {
                    showNotification('Erro ao buscar CEP. Tente novamente.', 'error');
                }
            });

            // Formatação automática do CEP
            cepInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 5) {
                    value = value.substring(0, 5) + '-' + value.substring(5, 8);
                }
                e.target.value = value;
            });
        }

        function renderHomeResultados(itens) {
            const container = document.getElementById('homeResultados');
            if (!container) return;

            if (!Array.isArray(itens) || itens.length === 0) {
                container.innerHTML = `
                    <div class="no-results">
                        <div class="no-results-icon">🔍</div>
                        <h4>Nenhuma doação encontrada</h4>
                        <p>Tente ajustar os filtros de busca</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = itens.map(item => `
                <div class="result-item" data-animate>
                    <div class="result-content">
                        <h4>${item.titulo}</h4>
                        <div class="result-details">
                            <span class="result-type">${item.tipoAlimento}</span>
                            <span class="result-location">📍 ${item.cidade} • ${item.distancia}</span>
                        </div>
                    </div>
                    <button class="result-action btn btn-primary">Ver Detalhes</button>
                </div>
            `).join('');

            // Animar resultados
            container.querySelectorAll('.result-item').forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 100);
            });
        }
    }

    initSearchSystem();

    // ===== EFEITO DE DIGITAÇÃO NO TÍTULO =====
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid #fff';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50 + Math.random() * 50);
            } else {
                heroTitle.style.borderRight = 'none';
                // Piscar cursor no final
                setTimeout(() => {
                    heroTitle.style.borderRight = '2px solid transparent';
                }, 500);
            }
        };
        
        // Iniciar após um delay
        setTimeout(typeWriter, 1000);
    }

    // ===== OTIMIZAÇÕES DE PERFORMANCE =====
    // Debounce para eventos de scroll
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Preload de imagens importantes
    function preloadImages() {
        const images = [
            './img/frutas.jpg',
            './img/doando.jpg',
            './img/familia%20feliz.jpg',
            './img/parceiros.jpg',
            './img/logistica.jpg',
            './img/impactoambiental.jpg'
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    preloadImages();

    // ===== INICIALIZAÇÃO FINAL =====
    console.log('✅ Prato Justo - Site totalmente carregado e otimizado!');
    
    // Mostrar notificação de boas-vindas
    setTimeout(() => {
        showNotification('Bem-vindo ao Prato Justo! 🍽️', 'success', 3000);
    }, 2000);
});

// ===== ESTILOS DINÂMICOS PARA AS NOVAS FUNCIONALIDADES =====
const dynamicStyles = `
    /* Loading screen melhorada */
    .loading-progress {
        text-align: center;
        color: white;
        margin-top: 2rem;
    }
    
    .progress-bar {
        width: 200px;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        margin: 1rem auto;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #fff, #f0f9ff);
        border-radius: 2px;
        transition: width 0.3s ease;
        width: 0%;
    }
    
    .loading-text {
        font-size: 0.9rem;
        opacity: 0.8;
        margin-top: 0.5rem;
    }
    
    /* Notificações melhoradas */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 0;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        transform: translateX(400px);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 10000;
        border-left: 4px solid #3B82F6;
        max-width: 400px;
        overflow: hidden;
    }
    
    .notification-success { border-left-color: #10B981; }
    .notification-error { border-left-color: #EF4444; }
    .notification-warning { border-left-color: #F59E0B; }
    .notification-info { border-left-color: #3B82F6; }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
    }
    
    .notification-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
    }
    
    .notification-message {
        flex: 1;
        font-weight: 500;
        color: #374151;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #9CA3AF;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    
    .notification-close:hover {
        background: #F3F4F6;
        color: #374151;
    }
    
    .notification-progress {
        height: 3px;
        background: linear-gradient(90deg, #3B82F6, #10B981);
        width: 100%;
        transform-origin: left;
        animation: progress linear;
    }
    
    @keyframes progress {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
    }
    
    /* Resultados de busca */
    .no-results {
        text-align: center;
        padding: 3rem 2rem;
        color: #6B7280;
    }
    
    .no-results-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    .result-item {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s ease;
        border: 1px solid #F3F4F6;
    }
    
    .result-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }
    
    .result-content h4 {
        margin: 0 0 0.5rem 0;
        color: #1F2937;
        font-weight: 600;
    }
    
    .result-details {
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    
    .result-type {
        background: #DBEAFE;
        color: #1E40AF;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .result-location {
        color: #6B7280;
        font-size: 0.875rem;
    }
    
    .result-action {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
    }
    
    /* Efeito Ripple */
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Animações em cascata */
    [data-animate-child] {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    [data-animate-child].animate {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// ===== INTEGRAÇÃO COM SISTEMA DE AUTENTICAÇÃO =====
function initializeAuthIntegration() {
    if (!window.authManager) {
        console.warn('AuthManager não encontrado, tentando novamente...');
        setTimeout(initializeAuthIntegration, 500);
        return;
    }

    console.log('🔐 Integrando sistema de autenticação...');
    
    // Atualizar header actions baseado no estado de autenticação
    updateHeaderActions();
    
    // Configurar botões que requerem autenticação
    setupAuthRequiredButtons();
    
    // Atualizar interface baseada no login
    updateInterfaceBasedOnAuth();
}

function updateHeaderActions() {
    const headerActions = document.getElementById('header-actions');
    if (!headerActions) return;
    
    if (window.authManager.isAuthenticated()) {
        const user = window.authManager.getCurrentUser();
        headerActions.innerHTML = `
            <div class="user-greeting">
                <span>Olá, ${user.nome}!</span>
            </div>
            <a href="minhas-doacoes.html" class="btn btn-outline">
                <i class="fas fa-heart"></i> Minhas Doações
            </a>
            <a href="cadastro_alimento.html" class="btn btn-primary">
                <i class="fas fa-plus"></i> Nova Doação
            </a>
            <button id="logout-btn" class="btn btn-logout">
                <i class="fas fa-sign-out-alt"></i> Sair
            </button>
        `;
        
        // Configurar evento de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.authManager.logout();
            });
        }
    } else {
        headerActions.innerHTML = `
            <a href="login.html" class="btn btn-login">Entrar</a>
            <a href="cadastro_perfil.html" class="donate-btn">
                <span class="btn-icon"><i class="fas fa-heart"></i></span>
                Doar Agora
            </a>
        `;
    }
}

function setupAuthRequiredButtons() {
    // Botões que requerem autenticação
    const authRequiredButtons = document.querySelectorAll('.require-auth');
    
    authRequiredButtons.forEach(btn => {
        if (!window.authManager.isAuthenticated()) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Você precisa estar logado para fazer uma doação.\n\nDeseja fazer login agora?')) {
                    window.location.href = 'login.html';
                }
            });
        }
    });
}

function updateInterfaceBasedOnAuth() {
    // Atualizar mensagens baseadas no estado de autenticação
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons && window.authManager.isAuthenticated()) {
        const user = window.authManager.getCurrentUser();
        const welcomeMsg = document.querySelector('.hero-description');
        if (welcomeMsg) {
            welcomeMsg.innerHTML = `
                Olá, <strong>${user.nome}</strong>! 👋<br>
                Conectamos doadores com comunidades carentes. Cada alimento doado
                é um passo contra a fome e desperdício.
            `;
        }
    }
    
    // Atualizar estatísticas se usuário logado
    if (window.authManager.isAuthenticated()) {
        updateUserStats();
    }
}

function updateUserStats() {
    // Buscar estatísticas do usuário logado
    const token = window.authManager.getToken();
    if (!token) return;
    
    fetch('/doacoes/minhas', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(donations => {
        if (Array.isArray(donations)) {
            const totalDonations = donations.length;
            const activeDonations = donations.filter(d => d.ativo).length;
            const totalQuantity = donations.reduce((sum, d) => sum + (d.quantidade || 0), 0);
            
            // Atualizar estatísticas na página se houver elementos específicos
            const userStatsContainer = document.querySelector('.user-stats');
            if (userStatsContainer) {
                userStatsContainer.innerHTML = `
                    <div class="user-stat">
                        <div class="stat-number">${totalDonations}</div>
                        <div class="stat-label">Suas Doações</div>
                    </div>
                    <div class="user-stat">
                        <div class="stat-number">${activeDonations}</div>
                        <div class="stat-label">Ativas</div>
                    </div>
                    <div class="user-stat">
                        <div class="stat-number">${totalQuantity.toFixed(1)}</div>
                        <div class="stat-label">Kg Doados</div>
                    </div>
                `;
            }
        }
    })
    .catch(error => {
        console.log('Erro ao carregar estatísticas do usuário:', error);
    });
}

// Adicionar atributos de animação para elementos específicos
document.querySelectorAll('.feature, .step, .impact-card').forEach((el, index) => {
    el.setAttribute('data-animate', 'true');
    el.setAttribute('data-animate-delay', index * 100);
    
    // Adicionar animação em cascata para elementos filhos
    const children = el.querySelectorAll('h3, h4, p, .feature-icon, .step-icon, .card-icon');
    children.forEach((child, childIndex) => {
        child.setAttribute('data-animate-child', 'true');
        child.style.transitionDelay = `${childIndex * 150 + 300}ms`;
    });
});