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
        // Disparar evento customizado para notificar mudanças
        const event = new CustomEvent('authStateChanged', {
            detail: {
                isAuthenticated: this.isAuthenticated(),
                user: this.currentUser
            }
        });
        document.dispatchEvent(event);

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

        // Atualizar botões de login e cadastro
        const loginButtons = document.querySelectorAll('.login-btn, .register-btn');
        loginButtons.forEach(btn => {
            if (this.isAuthenticated()) {
                btn.style.display = 'none';
            } else {
                btn.style.display = 'flex';
            }
        });
    }

    showAuthRequired(message) {
        // Criar modal bonito para autenticação
        this.createAuthModal(message);
    }

    createAuthModal(message) {
        // Remover modal existente se houver
        const existingModal = document.getElementById('auth-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Criar modal
        const modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-overlay">
                <div class="auth-modal-content">
                    <div class="auth-modal-header">
                        <i class="fas fa-lock"></i>
                        <h3>Login Necessário</h3>
                    </div>
                    <div class="auth-modal-body">
                        <p>${message}</p>
                        <p class="auth-modal-subtitle">Faça login para continuar e aproveitar todos os recursos!</p>
                    </div>
                    <div class="auth-modal-actions">
                        <button class="btn-auth-modal-cancel" onclick="this.closest('#auth-modal').remove()">
                            <i class="fas fa-times"></i>
                            Cancelar
                        </button>
                        <a href="login.html" class="btn-auth-modal-login">
                            <i class="fas fa-sign-in-alt"></i>
                            Fazer Login
                        </a>
                    </div>
                    <div class="auth-modal-features">
                        <div class="auth-feature-item">
                            <i class="fas fa-heart"></i>
                            <span>Gerencie suas doações</span>
                        </div>
                        <div class="auth-feature-item">
                            <i class="fas fa-chart-line"></i>
                            <span>Acompanhe estatísticas</span>
                        </div>
                        <div class="auth-feature-item">
                            <i class="fas fa-users"></i>
                            <span>Conecte-se com outros</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Adicionar estilos do modal
        if (!document.querySelector('#auth-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'auth-modal-styles';
            styles.textContent = `
                #auth-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }

                .auth-modal-overlay {
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }

                .auth-modal-content {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 20px;
                    padding: 2.5rem;
                    max-width: 500px;
                    width: 100%;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                    position: relative;
                    overflow: hidden;
                    animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .auth-modal-content::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transform: rotate(45deg);
                    animation: shimmer 3s infinite;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .auth-modal-header {
                    text-align: center;
                    margin-bottom: 1.5rem;
                    position: relative;
                    z-index: 1;
                }

                .auth-modal-header i {
                    font-size: 3rem;
                    background: linear-gradient(45deg, #ff6b6b, #feca57);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: pulse 2s infinite;
                    margin-bottom: 1rem;
                    display: block;
                }

                .auth-modal-header h3 {
                    color: white;
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin: 0;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }

                .auth-modal-body {
                    text-align: center;
                    margin-bottom: 2rem;
                    position: relative;
                    z-index: 1;
                }

                .auth-modal-body p {
                    color: white;
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                    line-height: 1.6;
                }

                .auth-modal-subtitle {
                    opacity: 0.8;
                    font-size: 1rem;
                }

                .auth-modal-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-bottom: 2rem;
                    position: relative;
                    z-index: 1;
                }

                .btn-auth-modal-cancel {
                    padding: 0.75rem 1.5rem;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .btn-auth-modal-cancel:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }

                .btn-auth-modal-login {
                    padding: 0.75rem 2rem;
                    background: linear-gradient(45deg, #ff6b6b, #feca57);
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
                }

                .btn-auth-modal-login:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.6);
                    background: linear-gradient(45deg, #ff5252, #ffeb3b);
                }

                .auth-modal-features {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    position: relative;
                    z-index: 1;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                }

                .auth-feature-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    color: white;
                    opacity: 0.8;
                }

                .auth-feature-item i {
                    font-size: 1.5rem;
                    color: #feca57;
                    margin-bottom: 0.5rem;
                }

                .auth-feature-item span {
                    font-size: 0.8rem;
                    line-height: 1.2;
                }

                @media (max-width: 600px) {
                    .auth-modal-content {
                        margin: 1rem;
                        padding: 2rem;
                    }
                    
                    .auth-modal-features {
                        grid-template-columns: 1fr;
                        gap: 0.75rem;
                    }
                    
                    .auth-modal-actions {
                        flex-direction: column;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(modal);

        // Fechar modal ao clicar no overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('auth-modal-overlay')) {
                modal.remove();
            }
        });

        // Fechar modal com ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
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
