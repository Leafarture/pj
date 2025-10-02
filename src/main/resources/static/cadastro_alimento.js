// Seleciona o formulário
const foodForm = document.getElementById('foodRegistrationForm');

// Evento de envio do formulário
foodForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita o reload da página

    const foodData = {
        nameProduto: document.getElementById('foodName').value,
        tipoAlimento: document.getElementById('foodType').value,
        quantidade: parseFloat(document.getElementById('quantity').value) || 0,
        validade: document.getElementById('expiryDate').value,
        descricao: document.getElementById('description').value,
        endereco: document.getElementById('address').value,
        cidade: document.getElementById('city').value,
    };

    console.log('Alimento cadastrado:', foodData);

    // Enviar para o backend via fetch
    fetch('/auth/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar alimento');
        }
        return response.json();
    })
    .then(data => {
        console.log('Sucesso:', data);
        alert('Alimento cadastrado com sucesso!');
        foodForm.reset();
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert('Falha ao cadastrar alimento. Verifique o console para mais detalhes.');
    });
});

// Botão de geolocalização
const getLocationBtn = document.getElementById('getLocationBtn');
const locationStatus = document.getElementById('locationStatus');

getLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        locationStatus.textContent = 'Localizando...';
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            locationStatus.textContent = `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;
        }, (err) => {
            locationStatus.textContent = 'Não foi possível obter localização';
        });
    } else {
        locationStatus.textContent = 'Geolocalização não suportada';
    }
});