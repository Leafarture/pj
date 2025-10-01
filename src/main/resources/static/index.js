/**
 * JavaScript para a página inicial do Prato Justo
 * Gerencia navegação, animações, scroll suave e interações do usuário
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {

    // ===== REFERÊNCIAS DOS ELEMENTOS =====
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // ===== MENU MOBILE =====

    /**
     * Alterna a visibilidade do menu mobile
     */
    function toggleMobileMenu() {
        navList.classList.toggle('active');

        // Anima o ícone do hambúrguer
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (navList.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    /**
     * Fecha o menu mobile quando um link é clicado
     */
    function closeMobileMenu() {
        navList.classList.remove('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }

    // Event listeners para o menu mobile
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Fecha o menu quando um link é clicado
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Fecha o menu quando clica fora dele
    document.addEventListener('click', function(e) {
        if (!header.contains(e.target) && navList.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ===== SCROLL SUAVE E NAVEGAÇÃO (CORRIGIDO) =====

    let scrollClickTimeout;

    /**
     * Gerencia o clique nos links de navegação para rolagem suave e atualização da classe 'active'.
     * @param {Event} e - O evento de clique.
     */
    function handleLinkClick(e) {
        const targetId = e.currentTarget.getAttribute('href');
        
        // Se não for um link interno (não começa com #), permite navegação normal
        if (!targetId || !targetId.startsWith('#')) {
            return;
        }

        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        // 1. Desativa o listener de scroll para evitar o conflito durante a rolagem suave.
        window.removeEventListener('scroll', throttledScrollHandler);

        // 2. Atualiza a classe 'active' imediatamente no clique para feedback instantâneo.
        navLinks.forEach(link => link.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // 3. Calcula a posição de destino e executa a rolagem suave.
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });

        // 4. Reativa o listener de scroll após a animação.
        clearTimeout(scrollClickTimeout);
        scrollClickTimeout = setTimeout(() => {
            // Garante que a navegação ativa esteja correta ao final da rolagem
            updateActiveNavigation();
            window.addEventListener('scroll', throttledScrollHandler);
        }, 1000); // Duração segura para a maioria das animações de 'smooth scroll'.
    }

    // Adiciona o listener de clique a todos os links de navegação.
    navLinks.forEach(link => {
        link.addEventListener('click', handleLinkClick);
    });

    // ===== HEADER SCROLL EFFECT =====

    /**
     * Adiciona efeito de transparência no header baseado no scroll
     */
    function handleHeaderScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }

    // Event listener para scroll
    window.addEventListener('scroll', handleHeaderScroll);

    // ===== ANIMAÇÕES DE SCROLL =====

    /**
     * Verifica se um elemento está visível na viewport
     * @param {HTMLElement} element - Elemento a ser verificado
     * @returns {boolean} - True se visível, false caso contrário
     */
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= windowHeight &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Adiciona animação de fade-in aos elementos quando entram na viewport
     */
    function handleScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');

        animatedElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('aos-animate')) {
                element.classList.add('aos-animate');

                // Adiciona delay baseado no atributo data-aos-delay
                const delay = element.getAttribute('data-aos-delay') || 0;

                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, parseInt(delay));
            }
        });
    }

    // Inicializa elementos com animação
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }

    // Inicializa animações e adiciona event listener
    initScrollAnimations();
    window.addEventListener('scroll', handleScrollAnimations);

    // Executa uma vez no carregamento para elementos já visíveis
    handleScrollAnimations();

    // ===== CONTADOR ANIMADO DAS ESTATÍSTICAS =====

    /**
     * Anima os números das estatísticas
     * @param {HTMLElement} element - Elemento que contém o número
     * @param {number} target - Valor final do contador
     * @param {number} duration - Duração da animação em ms
     */
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        updateCounter();
    }

    /**
     * Inicializa os contadores animados quando a seção sobre entra na viewport
     */
    function initCounters() {
        const statsSection = document.querySelector('.about');
        const statNumbers = document.querySelectorAll('.stat-number');

        if (isElementInViewport(statsSection)) {
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));

                if (number && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');

                    // Anima o número
                    if (text.includes('+')) {
                        animateCounter(stat, number, 2000);
                    } else if (text.includes('T')) {
                        animateCounter(stat, number * 10, 2000);
                        setTimeout(() => {
                            stat.textContent = text;
                        }, 2000);
                    } else {
                        animateCounter(stat, number, 2000);
                    }
                }
            });
        }
    }

    // Adiciona event listener para os contadores
    window.addEventListener('scroll', initCounters);

    // ===== EFEITOS DE HOVER NOS CARDS =====

    /**
     * Adiciona efeitos de hover aos cards da seção "Como Funciona"
     */
    function initCardHoverEffects() {
        const stepCards = document.querySelectorAll('.step-card');

        stepCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Inicializa efeitos de hover
    initCardHoverEffects();

    // ===== BOTÕES DE AÇÃO =====

    /**
     * Adiciona efeitos de loading aos botões principais
     */
    function initButtonEffects() {
        const primaryButtons = document.querySelectorAll('.btn-primary');

        primaryButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Cria efeito de ripple
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                this.appendChild(ripple);

                // Remove o ripple após a animação
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Inicializa efeitos dos botões
    initButtonEffects();

    // ===== NAVEGAÇÃO ATIVA =====

    /**
     * Atualiza o link ativo na navegação baseado na seção visível
     */
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Adiciona event listener para navegação ativa
    window.addEventListener('scroll', updateActiveNavigation);

    // ===== OTIMIZAÇÕES DE PERFORMANCE =====

    /**
     * Throttle function para otimizar eventos de scroll
     * @param {Function} func - Função a ser executada
     * @param {number} limit - Limite de tempo em ms
     * @returns {Function} - Função otimizada
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Aplica throttle aos event listeners de scroll
    const throttledScrollHandler = throttle(() => {
        handleHeaderScroll();
        handleScrollAnimations();
        updateActiveNavigation();
        initCounters();
    }, 16); // ~60fps

    window.addEventListener('scroll', throttledScrollHandler);

    // ===== GEOLOCALIZAÇÃO =====

    /**
     * Inicializa funcionalidades de geolocalização
     */
    function initGeolocation() {
        const getLocationBtn = document.getElementById('getLocationBtn');
        const locationStatus = document.getElementById('locationStatus');
        const addressInput = document.getElementById('address');
        const cityInput = document.getElementById('city');

        if (!getLocationBtn || !locationStatus) return;

        getLocationBtn.addEventListener('click', function() {
            if (!navigator.geolocation) {
                locationStatus.textContent = 'Geolocalização não suportada pelo navegador';
                locationStatus.style.color = '#e74c3c';
                return;
            }

            locationStatus.textContent = 'Obtendo localização...';
            locationStatus.style.color = '#f39c12';
            getLocationBtn.disabled = true;

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    // Simula busca de endereço (em produção, usar API de geocoding)
                    reverseGeocode(lat, lng, function(address) {
                        locationStatus.textContent = 'Localização obtida com sucesso!';
                        locationStatus.style.color = '#27ae60';

                        if (address) {
                            addressInput.value = address.street || '';
                            cityInput.value = address.city || 'São Paulo';
                        }

                        getLocationBtn.disabled = false;
                    });
                },
                function(error) {
                    let errorMessage = 'Erro ao obter localização: ';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += 'Permissão negada';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += 'Localização indisponível';
                            break;
                        case error.TIMEOUT:
                            errorMessage += 'Tempo limite excedido';
                            break;
                        default:
                            errorMessage += 'Erro desconhecido';
                    }

                    locationStatus.textContent = errorMessage;
                    locationStatus.style.color = '#e74c3c';
                    getLocationBtn.disabled = false;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    }

    /**
     * Simula geocodificação reversa (em produção, usar API real)
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @param {Function} callback - Callback com o endereço
     */
    function reverseGeocode(lat, lng, callback) {
        // Simula delay de API
        setTimeout(() => {
            // Dados simulados baseados na localização
            const address = {
                street: `Rua das Flores, ${Math.floor(Math.random() * 1000) + 1}`,
                city: 'São Paulo',
                state: 'SP'
            };
            callback(address);
        }, 1500);
    }

    // ===== FORMULÁRIO DE CADASTRO DE ALIMENTOS =====

    /**
     * Inicializa validação do formulário de cadastro de alimentos
     */
    function initFoodRegistrationForm() {
        const form = document.getElementById('foodRegistrationForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const foodData = {
                name: formData.get('foodName'),
                type: formData.get('foodType'),
                quantity: formData.get('quantity'),
                expiryDate: formData.get('expiryDate'),
                description: formData.get('description'),
                address: formData.get('address'),
                city: formData.get('city')
            };

            // Validação básica
            if (!validateFoodForm(foodData)) {
                return;
            }

            // Simula envio do formulário
            submitFoodRegistration(foodData);
        });
    }

    /**
     * Valida dados do formulário de alimentos
     * @param {Object} data - Dados do formulário
     * @returns {boolean} - True se válido
     */
    function validateFoodForm(data) {
        const errors = [];

        if (!data.name.trim()) {
            errors.push('Nome do alimento é obrigatório');
        }

        if (!data.type) {
            errors.push('Tipo do alimento é obrigatório');
        }

        if (!data.quantity.trim()) {
            errors.push('Quantidade é obrigatória');
        }

        if (!data.expiryDate) {
            errors.push('Data de validade é obrigatória');
        } else {
            const expiryDate = new Date(data.expiryDate);
            const today = new Date();
            if (expiryDate < today) {
                errors.push('Data de validade não pode ser no passado');
            }
        }

        if (!data.address.trim()) {
            errors.push('Endereço é obrigatório');
        }

        if (!data.city.trim()) {
            errors.push('Cidade é obrigatória');
        }

        if (errors.length > 0) {
            alert('Por favor, corrija os seguintes erros:\n' + errors.join('\n'));
            return false;
        }

        return true;
    }

    /**
     * Simula envio do formulário de cadastro de alimentos
     * @param {Object} data - Dados do formulário
     */
    function submitFoodRegistration(data) {
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';

        // Simula delay de processamento
        setTimeout(() => {
            console.log('Dados do alimento cadastrado:', data);

            // Simula sucesso
            alert('Alimento cadastrado com sucesso! Ele aparecerá para pessoas próximas à sua localização.');

            // Reset do formulário
            document.getElementById('foodRegistrationForm').reset();
            document.getElementById('locationStatus').textContent = 'Localização não detectada';
            document.getElementById('locationStatus').style.color = '#7f8c8d';

            // Reset do botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

        }, 2000);
    }

    // ===== INICIALIZAÇÃO FINAL =====

    /**
     * Executa todas as inicializações necessárias
     */
    function init() {
        // Adiciona classe de carregamento completo
        document.body.classList.add('loaded');

        // Executa animações iniciais
        handleScrollAnimations();
        initCounters();

        // Inicializa funcionalidades específicas
        initGeolocation();
        initFoodRegistrationForm();

        // Log de inicialização (para debug)
        console.log('Prato Justo - Página inicial carregada com sucesso!');
    }

    // Executa inicialização
    init();

    // ===== TRATAMENTO DE ERROS =====

    /**
     * Trata erros globais da aplicação
     * @param {Error} error - Erro capturado
     */
    window.addEventListener('error', function(error) {
        console.error('Erro na aplicação:', error);
        // Aqui você pode adicionar lógica para reportar erros
    });

    /**
     * Trata erros de promises não capturadas
     * @param {Event} event - Evento de erro
     */
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Promise rejeitada:', event.reason);
        // Aqui você pode adicionar lógica para reportar erros de promises
    });
});

// ===== ESTILOS CSS ADICIONAIS VIA JAVASCRIPT =====

// Adiciona estilos para o efeito ripple
const style = document.createElement('style');
style.textContent = `
    .btn-primary {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .aos-animate {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    .loaded {
        opacity: 1;
    }

    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);