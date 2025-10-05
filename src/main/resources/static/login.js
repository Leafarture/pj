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
            window.location.href = "./HomeUsuario.html";
        } else if (response.status === 401) {
            alert('Email ou senha inválidos.');
        } else {
            alert('Erro ao realizar login.');
        }
    } catch (err) {
        alert('Falha de conexão com o servidor.');
    }
});