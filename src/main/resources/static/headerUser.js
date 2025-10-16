/**
 * Sistema de Header do Usuário - Prato Justo
 * Integra com o sistema de autenticação global
 */

class HeaderUserManager {
    constructor() {
        this.init();
    }

    async init() {
        // Aguardar o sistema de autenticação estar pronto
        if (window.authManager) {
            this.setupHeaderUser();
            // Atualizar imediatamente com dados do usuário se já estiver logado
            this.updateUserHeader();
        } else {
            // Aguardar um pouco e tentar novamente
            setTimeout(() => this.init(), 100);
        }
    }

    setupHeaderUser() {
        // Verificar se já existe um header de usuário
        const existingHeader = document.querySelector('.header-user-section');
        if (existingHeader) {
            existingHeader.remove();
        }

        // Criar o header do usuário
        this.createUserHeader();
        
        // Configurar eventos
        this.setupEvents();
        
        // Atualizar UI inicial
        this.updateUserHeader();
    }

    createUserHeader() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;

        const userSection = document.createElement('div');
        userSection.className = 'header-user-section';
        userSection.innerHTML = `
            <div class="user-profile" id="user-profile" style="display: none;">
                <div class="user-avatar">
                    <img id="user-avatar-img" src="" alt="Avatar" style="display: none;">
                    <div id="user-avatar-placeholder">👤</div>
                </div>
                <div class="user-info">
                    <span class="user-greeting">Olá, <span id="user-name">Usuário</span>!</span>
                    <div class="user-actions">
                        <a href="minhas-doacoes.html" class="user-action-btn">
                            <i class="fas fa-heart"></i>
                            <span>Minhas Doações</span>
                        </a>
                        <a href="cadastro_alimento.html" class="user-action-btn">
                            <i class="fas fa-plus"></i>
                            <span>Nova Doação</span>
                        </a>
                        <button id="logout-btn" class="user-action-btn logout">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Sair</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="login-section" id="login-section">
                <a href="login.html" class="login-btn">
                    <i class="fas fa-sign-in-alt"></i>
                    Entrar
                </a>
                <a href="cadastro_perfil.html" class="register-btn">
                    <i class="fas fa-user-plus"></i>
                    Cadastrar
                </a>
            </div>
        `;

        headerActions.appendChild(userSection);
    }

    setupEvents() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (window.authManager) {
                    window.authManager.logout();
                } else {
                    // Fallback: limpar localStorage e recarregar página
                    localStorage.clear();
                    window.location.reload();
                }
            });
        }

        // Escutar mudanças no estado de autenticação
        document.addEventListener('authStateChanged', (event) => {
            this.updateUserHeader();
        });

        // Verificar periodicamente se o usuário ainda está logado
        setInterval(() => {
            this.checkAuthStatus();
        }, 5000); // Verificar a cada 5 segundos
    }

    checkAuthStatus() {
        // Verificar se ainda há dados de autenticação válidos
        const hasToken = localStorage.getItem('token');
        const hasUser = localStorage.getItem('user');
        
        if (!hasToken || !hasUser) {
            // Se não há dados de autenticação, esconder perfil do usuário
            const userProfile = document.getElementById('user-profile');
            const loginSection = document.getElementById('login-section');
            
            if (userProfile) userProfile.style.display = 'none';
            if (loginSection) loginSection.style.display = 'flex';
        }
    }

    updateUserHeader() {
        const userProfile = document.getElementById('user-profile');
        const loginSection = document.getElementById('login-section');
        const userName = document.getElementById('user-name');
        const userAvatarImg = document.getElementById('user-avatar-img');
        const userAvatarPlaceholder = document.getElementById('user-avatar-placeholder');

        let user = null;
        let isAuthenticated = false;

        // Verificar se o usuário está autenticado via authManager
        if (window.authManager && window.authManager.isAuthenticated()) {
            user = window.authManager.getCurrentUser();
            isAuthenticated = true;
        } else {
            // Fallback: verificar localStorage diretamente
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            
            if (storedUser && storedToken) {
                try {
                    user = JSON.parse(storedUser);
                    isAuthenticated = true;
                } catch (error) {
                    console.error('Erro ao parsear dados do usuário:', error);
                }
            }
        }

        if (isAuthenticated && user) {
            if (userProfile) userProfile.style.display = 'flex';
            if (loginSection) loginSection.style.display = 'none';
            
            if (userName) {
                userName.textContent = user.nome || user.name || user.userName || 'Usuário';
            }

            // Configurar avatar
            const avatarUrl = user.avatarUrl || user.avatarDataUrl || localStorage.getItem('userAvatar');
            if (avatarUrl) {
                if (userAvatarImg) {
                    userAvatarImg.src = avatarUrl;
                    userAvatarImg.style.display = 'block';
                }
                if (userAvatarPlaceholder) {
                    userAvatarPlaceholder.style.display = 'none';
                }
            } else {
                if (userAvatarImg) userAvatarImg.style.display = 'none';
                if (userAvatarPlaceholder) userAvatarPlaceholder.style.display = 'flex';
            }

            // Sincronizar dados com localStorage para compatibilidade com paginaUsuario.html
            this.syncUserDataToLocalStorage(user);
        } else {
            if (userProfile) userProfile.style.display = 'none';
            if (loginSection) loginSection.style.display = 'flex';
        }
    }

    syncUserDataToLocalStorage(user) {
        // Sincronizar dados do usuário com localStorage para manter compatibilidade
        // com o sistema existente da paginaUsuario.html
        if (user) {
            localStorage.setItem('userName', user.nome || user.name || 'Usuário');
            localStorage.setItem('userEmail', user.email || user.email || 'usuario@email.com');
            localStorage.setItem('joinDate', user.joinDate || '01/01/2024');
            localStorage.setItem('totalDoacoes', user.totalDoacoes || '0');
            localStorage.setItem('familiasAjudadas', user.familiasAjudadas || '0');
            localStorage.setItem('avaliacaoMedia', user.avaliacaoMedia || '0');
            
            // Manter dados de avatar se disponíveis
            if (user.avatarUrl || user.avatarDataUrl) {
                localStorage.setItem('userAvatar', user.avatarUrl || user.avatarDataUrl);
            }
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new HeaderUserManager();
});

// Também inicializar se o DOM já estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HeaderUserManager();
    });
} else {
    new HeaderUserManager();
}




