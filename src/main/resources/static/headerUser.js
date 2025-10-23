/**
 * Sistema de Header do Usuário - Prato Justo
 * Sistema organizado e limpo para gerenciar o header do usuário
 * Integra com o sistema de autenticação global
 */
class HeaderUserManager {
    constructor() {
        this.isInitialized = false;
        this.retryCount = 0;
        this.maxRetries = 50; // 5 segundos máximo
        this.init();
    }

    /**
     * Inicializa o sistema de header do usuário
     */
    async init() {
        if (window.authManager) {
            this.setupHeaderUser();
            this.updateUserHeader();
            this.isInitialized = true;
        } else if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            setTimeout(() => this.init(), 100);
        } else {
            console.warn('HeaderUserManager: authManager não encontrado após múltiplas tentativas');
        }
    }

    /**
     * Configura o header do usuário
     */
    setupHeaderUser() {
        this.removeExistingHeader();
        this.createUserHeader();
        this.setupEvents();
        this.updateUserHeader();
    }

    /**
     * Remove header existente se houver
     */
    removeExistingHeader() {
        const existingHeader = document.querySelector('.header-user-section');
        if (existingHeader) {
            existingHeader.remove();
        }
    }

    /**
     * Cria o HTML do header do usuário
     */
    createUserHeader() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) {
            console.warn('HeaderUserManager: .header-actions não encontrado');
            return;
        }

        const userSection = document.createElement('div');
        userSection.className = 'header-user-section';
        userSection.innerHTML = this.getUserHeaderHTML();
        headerActions.appendChild(userSection);
    }

    /**
     * Retorna o HTML do header do usuário
     */
    getUserHeaderHTML() {
        return `
            <!-- Usuário Logado -->
            <div class="user-logged-in" id="user-logged-in" style="display: none;">
                <div class="profile-dropdown">
                    <button class="avatar-btn" id="avatar-btn" aria-label="Abrir menu de perfil">
                        <img id="user-avatar-img" src="" alt="Avatar" style="display: none;">
                        <div id="user-avatar-placeholder">U</div>
                    </button>
                    <div class="dropdown-content" id="dropdown-content">
                        <div class="dropdown-header">
                            <span class="user-greeting">Olá, <span id="user-name">Usuário</span>!</span>
                        </div>
                        <a href="paginaUsuario.html">
                            <i class="fas fa-user-circle"></i> Perfil
                        </a>
                        <a href="#" id="logout-btn">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </div>
                </div>
            </div>

            <!-- Seção de Login -->
            <div class="login-section" id="login-section">
                <a href="login.html" class="login-btn">
                    <i class="fas fa-sign-in-alt"></i> Entrar
                </a>
                <a href="cadastro_perfil.html" class="register-btn">
                    <i class="fas fa-user-plus"></i> Cadastrar
                </a>
            </div>
        `;
    }

    /**
     * Configura os eventos do header
     */
    setupEvents() {
        this.setupAvatarButton();
        this.setupLogoutButton();
        this.setupAuthStateListener();
        this.setupClickOutsideListener();
    }

    /**
     * Configura o botão do avatar
     */
    setupAvatarButton() {
        const avatarBtn = document.getElementById('avatar-btn');
        const dropdown = document.getElementById('dropdown-content');

        if (avatarBtn && dropdown) {
            avatarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(dropdown);
            });
        }
    }

    /**
     * Configura o botão de logout
     */
    setupLogoutButton() {
        const logoutBtn = document.getElementById('logout-btn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }

    /**
     * Configura o listener de mudança de estado de autenticação
     */
    setupAuthStateListener() {
        document.addEventListener('authStateChanged', () => {
            this.updateUserHeader();
        });
    }

    /**
     * Configura o listener para fechar dropdown ao clicar fora
     */
    setupClickOutsideListener() {
        window.addEventListener('click', (e) => {
            const dropdown = document.getElementById('dropdown-content');
            const avatarBtn = document.getElementById('avatar-btn');
            
            if (dropdown && dropdown.classList.contains('show')) {
                if (!avatarBtn || !avatarBtn.contains(e.target)) {
                    this.closeDropdown(dropdown);
                }
            }
        });
    }

    /**
     * Alterna o dropdown
     */
    toggleDropdown(dropdown) {
        if (dropdown.classList.contains('show')) {
            this.closeDropdown(dropdown);
        } else {
            this.openDropdown(dropdown);
        }
    }

    /**
     * Abre o dropdown
     */
    openDropdown(dropdown) {
        dropdown.classList.add('show');
    }

    /**
     * Fecha o dropdown
     */
    closeDropdown(dropdown) {
        dropdown.classList.remove('show');
    }

    /**
     * Manipula o logout
     */
    handleLogout() {
        if (window.authManager) {
            window.authManager.logout();
        } else {
            localStorage.clear();
            window.location.href = 'index.html';
        }
    }

    /**
     * Atualiza o header do usuário baseado no estado de autenticação
     */
    updateUserHeader() {
        const userLoggedInSection = document.getElementById('user-logged-in');
        const loginSection = document.getElementById('login-section');
        const userName = document.getElementById('user-name');
        const userAvatarImg = document.getElementById('user-avatar-img');
        const userAvatarPlaceholder = document.getElementById('user-avatar-placeholder');

        if (!userLoggedInSection || !loginSection) return;

        const { user, isAuthenticated } = this.getUserData();

        if (isAuthenticated && user) {
            this.showLoggedInState(userLoggedInSection, loginSection, userName, userAvatarImg, userAvatarPlaceholder, user);
        } else {
            this.showLoginState(userLoggedInSection, loginSection);
        }
    }

    /**
     * Obtém os dados do usuário
     */
    getUserData() {
        let user = null;
        let isAuthenticated = false;

        if (window.authManager && window.authManager.isAuthenticated()) {
            user = window.authManager.getCurrentUser();
            isAuthenticated = true;
        }

        return { user, isAuthenticated };
    }

    /**
     * Mostra o estado logado
     */
    showLoggedInState(userLoggedInSection, loginSection, userName, userAvatarImg, userAvatarPlaceholder, user) {
        userLoggedInSection.style.display = 'flex';
        loginSection.style.display = 'none';
        
        if (userName) {
            userName.textContent = user.nome || 'Usuário';
        }

        this.updateUserAvatar(userAvatarImg, userAvatarPlaceholder, user);
    }

    /**
     * Mostra o estado de login
     */
    showLoginState(userLoggedInSection, loginSection) {
        userLoggedInSection.style.display = 'none';
        loginSection.style.display = 'flex';
    }

    /**
     * Atualiza o avatar do usuário
     */
    updateUserAvatar(userAvatarImg, userAvatarPlaceholder, user) {
        const avatarUrl = user.avatarUrl || localStorage.getItem('userAvatar');
        
        if (avatarUrl && userAvatarImg && userAvatarPlaceholder) {
            userAvatarImg.src = avatarUrl;
            userAvatarImg.style.display = 'block';
            userAvatarPlaceholder.style.display = 'none';
        } else if (userAvatarImg && userAvatarPlaceholder) {
            userAvatarImg.style.display = 'none';
            userAvatarPlaceholder.style.display = 'flex';
            
            // Atualiza a inicial do placeholder
            const userInitial = this.getUserInitial(user.nome || 'Usuário');
            userAvatarPlaceholder.textContent = userInitial;
        }
    }

    /**
     * Obtém a inicial do nome do usuário
     */
    getUserInitial(name) {
        return name.charAt(0).toUpperCase();
    }
}

// Inicialização automática
function initializeHeaderUser() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new HeaderUserManager();
        });
    } else {
        new HeaderUserManager();
    }
}

// Inicializar
initializeHeaderUser();