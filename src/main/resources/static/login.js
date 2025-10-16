// Atualizar o ano no footer
document.getElementById('ano').textContent = new Date().getFullYear();

document.getElementById('loginForm').addEventListener('submit', async function(e){
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(!email || !password){
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            
            // Usar o sistema global de autenticação
            if (window.authManager && data.token) {
                await window.authManager.handleLoginSuccess(data);
            } else {
                // Fallback para o sistema antigo
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirecionar baseado no tipo de usuário
                if (data.user && data.user.tipoUsuario === 'ESTABELECIMENTO') {
                    window.location.href = "./HomeEmpresas.html";
                } else {
                    window.location.href = "./HomeUsuario.html";
                }
            }
        } else if (response.status === 401) {
            const errorData = await response.json();
            alert(errorData.error || 'Email ou senha inválidos.');
        } else {
            alert('Erro ao realizar login.');
        }
    } catch (err) {
        alert('Falha de conexão com o servidor.');
    }
});