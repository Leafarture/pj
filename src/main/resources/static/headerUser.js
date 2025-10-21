/**
 * Sistema de Header do Usuário - Prato Justo
 * Integra com o sistema de autenticação global e cria um menu de perfil moderno.
 */
class HeaderUserManager {
    constructor() {
        this.init();
    }

    async init() {
        if (window.authManager) {
            this.setupHeaderUser();
            this.updateUserHeader();
        } else {
            setTimeout(() => this.init(), 100);
        }
    }

    setupHeaderUser() {
        const existingHeader = document.querySelector('.header-user-section');
        if (existingHeader) {
            existingHeader.remove();
        }

        this.createUserHeader();
        this.setupEvents();
        this.updateUserHeader();
    }

    createUserHeader() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;

        const userSection = document.createElement('div');
        userSection.className = 'header-user-section';
        userSection.innerHTML = `
            <div class="user-logged-in" id="user-logged-in" style="display: none;">
                <div class="profile-dropdown">
                    <button class="avatar-btn" id="avatar-btn" aria-label="Abrir menu de perfil">
                        <img id="user-avatar-img" src="" alt="Avatar" style="display: none;">
                        <div id="user-avatar-placeholder">👤</div>
                    </button>
                    <div class="dropdown-content" id="dropdown-content">
                        <div class="dropdown-header">
                            <span class="user-greeting">Olá, <span id="user-name">Usuário</span>!</span>
                        </div>
                        <a href="paginaUsuario.html"><i class="fas fa-user-circle"></i> Perfil</a>
                        <a href="minhas-doacoes.html"><i class="fas fa-heart"></i> Minhas Doações</a>
                        <a href="cadastro_alimento.html"><i class="fas fa-plus"></i> Nova Doação</a>
                        <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            </div>

            <div class="login-section" id="login-section">
                <a href="login.html" class="login-btn">
                    <i class="fas fa-sign-in-alt"></i> Entrar
                </a>
                <a href="cadastro_perfil.html" class="register-btn">
                    <i class="fas fa-user-plus"></i> Cadastrar
                </a>
            </div>
        `;
        headerActions.appendChild(userSection);
    }

    setupEvents() {
        const avatarBtn = document.getElementById('avatar-btn');
        const dropdown = document.getElementById('dropdown-content');
        const logoutBtn = document.getElementById('logout-btn');

        if (avatarBtn) {
            avatarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (window.authManager) {
                    window.authManager.logout();
                } else {
                    localStorage.clear();
                    window.location.reload();
                }
            });
        }

        document.addEventListener('authStateChanged', () => {
            this.updateUserHeader();
        });
        
        // Fecha o dropdown se clicar fora
        window.addEventListener('click', (e) => {
            if (dropdown && dropdown.classList.contains('show')) {
                if (!avatarBtn.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            }
        });
    }

    updateUserHeader() {
        const userLoggedInSection = document.getElementById('user-logged-in');
        const loginSection = document.getElementById('login-section');
        const userName = document.getElementById('user-name');
        const userAvatarImg = document.getElementById('user-avatar-img');
        const userAvatarPlaceholder = document.getElementById('user-avatar-placeholder');

        let user = null;
        let isAuthenticated = false;

        if (window.authManager && window.authManager.isAuthenticated()) {
            user = window.authManager.getCurrentUser();
            isAuthenticated = true;
        }

        if (isAuthenticated && user) {
            if (userLoggedInSection) userLoggedInSection.style.display = 'flex';
            if (loginSection) loginSection.style.display = 'none';
            
            if (userName) {
                userName.textContent = user.nome || 'Usuário';
            }

            const avatarUrl = user.avatarUrl || localStorage.getItem('userAvatar');
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
        } else {
            if (userLoggedInSection) userLoggedInSection.style.display = 'none';
            if (loginSection) loginSection.style.display = 'flex';
        }
    }
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new HeaderUserManager());
} else {
    new HeaderUserManager();
}