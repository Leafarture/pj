/**
 * Sistema Global de Autenticação - Prato Justo
 * Gerencia o estado de autenticação em todas as páginas
 */
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.init();
    }

    async init() {
        await this.loadStoredAuth();
        this.setupGlobalElements();
        this.updateUI();
    }

    async loadStoredAuth() {
        this.token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (this.token && userData) {
            try {
                this.currentUser = JSON.parse(userData);
                // Verificar se o token ainda é válido
                const isValid = await this.validateToken();
                if (!isValid) {
                    this.logout();
                }
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
                this.logout();
            }
        }
    }

    async validateToken() {
        if (!this.token) return false;
        
        try {
            const response = await fetch('/api/user/me', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    setupGlobalElements() {
        // Criar elementos de autenticação se não existirem
        this.createAuthElements();
    }

    createAuthElements() {
        // Não criar elementos duplicados - o headerUser.js já cuida disso
        // Apenas configurar eventos se necessário
        this.setupEvents();
    }

    setupEvents() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    updateUI() {
        // Notificar o HeaderUserManager sobre mudanças no estado de autenticação
        if (window.HeaderUserManager) {
            // Disparar evento customizado para notificar mudanças
            const event = new CustomEvent('authStateChanged', {
                detail: {
                    isAuthenticated: this.isAuthenticated(),
                    user: this.currentUser
                }
            });
            document.dispatchEvent(event);
        }

        // Atualizar links e botões baseados no estado de autenticação
        this.updateNavigationLinks();
    }

    updateNavigationLinks() {
        // Atualizar botões de "Fazer Doação"
        const donateButtons = document.querySelectorAll('.btn-add-donation, .btn-donate, [href*="cadastro_alimento"]');
        donateButtons.forEach(btn => {
            if (this.isAuthenticated()) {
                btn.style.display = 'flex';
                btn.style.pointerEvents = 'auto';
            } else {
                if (btn.classList.contains('require-auth')) {
                    btn.style.display = 'none';
                } else {
                    btn.style.opacity = '0.7';
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showAuthRequired('Você precisa estar logado para fazer uma doação.');
                    });
                }
            }
        });

        // Atualizar links para "Minhas Doações"
        const myDonationsLinks = document.querySelectorAll('[href*="minhas-doacoes"]');
        myDonationsLinks.forEach(link => {
            if (!this.isAuthenticated()) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAuthRequired('Você precisa estar logado para ver suas doações.');
                });
            }
        });
    }

    showAuthRequired(message) {
        if (confirm(message + '\n\nDeseja fazer login agora?')) {
            window.location.href = 'login.html';
        }
    }

    isAuthenticated() {
        return this.currentUser !== null && this.token !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getToken() {
        return this.token;
    }

    async login(token, user) {
        this.token = token;
        this.currentUser = user;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        this.updateUI();
        
        // Mostrar mensagem de sucesso
        this.showNotification('Login realizado com sucesso!', 'success');
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        this.updateUI();
        
        // Mostrar mensagem
        this.showNotification('Logout realizado com sucesso!', 'info');
        
        // Redirecionar para home se estiver em página protegida
        if (this.isProtectedPage()) {
            window.location.href = 'index.html';
        }
    }

    isProtectedPage() {
        const protectedPages = ['minhas-doacoes.html', 'cadastro_alimento.html'];
        const currentPage = window.location.pathname.split('/').pop();
        return protectedPages.includes(currentPage);
    }

    showNotification(message, type = 'info') {
        // Criar notificação temporária
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Adicionar estilos da notificação
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    animation: slideIn 0.3s ease;
                }

                .notification-success {
                    background: #27ae60;
                }

                .notification-error {
                    background: #e74c3c;
                }

                .notification-info {
                    background: #3498db;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Método para ser chamado após login bem-sucedido
    async handleLoginSuccess(responseData) {
        await this.login(responseData.token, responseData.user);
        
        // Redirecionar baseado no tipo de usuário
        const redirectUrl = this.getRedirectUrl(responseData.user);
        if (redirectUrl) {
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
        }
    }

    getRedirectUrl(user) {
        // Redirecionar baseado no tipo de usuário e página atual
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'login.html') {
            // Se veio do login, redirecionar para home
            return 'index.html';
        } else if (currentPage === 'cadastro_alimento.html') {
            // Se está cadastrando alimento, redirecionar para minhas doações
            return 'minhas-doacoes.html';
        }
        
        return null; // Não redirecionar
    }
}

// Instância global
window.authManager = new AuthManager();

// Exportar para uso em outros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
