// === JAVASCRIPT PARA PRATO JUSTO ===

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Prato Justo - Inicializando...');

    // ===== LOADING SCREEN =====
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => loadingScreen.remove(), 800);
            }, 500);
        }, 1500);
    }

    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    function updateHeader() {
        const scrolled = window.scrollY > 50;

        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }

        if (scrolled) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = window.scrollY;
    }

    window.addEventListener('scroll', updateHeader);

    // ===== SMOOTH SCROLLING =====
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

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Fechar menu mobile se aberto
                    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                    if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
                        mobileMenuBtn.classList.remove('active');
                        document.querySelector('.nav-menu').classList.remove('active');
                    }
                }
            }
        });
    });

    // ===== ANIMAÇÕES DE SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });

    // ===== CONTADOR ANIMADO =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    function animateNumbers() {
        if (counted) return;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            let current = 0;
            const duration = 2000;
            const increment = target / (duration / 16);

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
        counted = true;
    }

    // Observar seção de estatísticas
    const statsSection = document.querySelector('.hero');
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
        button.addEventListener('click', function(e) {
            // Efeito de ripple
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

            setTimeout(() => {
                ripple.remove();
            }, 600);

            // Redirecionar para cadastro
            setTimeout(() => {
                window.location.href = 'cadastro_perfil.html';
            }, 300);
        });
    });

    // ===== MENU MOBILE =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');

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

            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===== EFEITOS HOVER =====
    const interactiveElements = document.querySelectorAll('.card, .pillar-card, .step, .impact-card, .btn, .nav-link');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        element.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // ===== SISTEMA DE NOTIFICAÇÕES =====
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

        // Auto-remover
        const timeout = setTimeout(() => {
            closeNotification(notification);
        }, duration);

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

    // ===== ELEMENTOS FLUTUANTES INTERATIVOS =====
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach(element => {
        element.addEventListener('click', function() {
            this.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    });

    // ===== INICIALIZAÇÃO FINAL =====
    console.log('✅ Prato Justo - Site totalmente carregado!');

    // Mostrar notificação de boas-vindas
    setTimeout(() => {
        showNotification('Bem-vindo ao Prato Justo! 🍽️', 'success', 3000);
    }, 2000);
});

// ===== ESTILOS DINÂMICOS =====
const dynamicStyles = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

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

    /* Responsividade para mobile */
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .nav-menu.active {
            display: flex;
        }

        .mobile-menu-btn {
            display: flex;
        }

        .header-actions {
            display: none;
        }

        .nav-login {
            display: list-item;
        }

        .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .hero-title {
            font-size: 2.5rem;
        }

        .about-grid {
            grid-template-columns: 1fr;
        }

        .pillars-grid {
            grid-template-columns: 1fr;
        }

        .journey-stats {
            grid-template-columns: 1fr;
        }

        .process-steps {
            grid-template-columns: 1fr;
        }

        .impact-grid {
            grid-template-columns: 1fr;
        }

        .footer-content {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 480px) {
        .hero-title {
            font-size: 2rem;
        }

        .section-title {
            font-size: 2rem;
        }

        .floating-cards {
            height: 300px;
        }

        .card {
            padding: 0.5rem;
        }

        .card-1, .card-2, .card-3 {
            width: 180px;
        }
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);