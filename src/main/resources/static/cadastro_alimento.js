// Dependência: O 'showNotification' é esperado do arquivo notification.js (existente no projeto)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('donationForm');
    const btnSubmit = document.getElementById('btnSubmit');
    const photoInput = document.getElementById('foodPhoto');
    const photoPreview = document.getElementById('photoPreview');
    const toggleBtn = document.getElementById('toggleOptional');
    const optionalContent = document.getElementById('optionalContent');
    const getLocationBtn = document.getElementById('getLocationBtn');
    const locationStatus = document.getElementById('locationStatus');
    const cepInput = document.getElementById('cep');
    const searchCepBtn = document.getElementById('searchCepBtn');
    const streetInput = document.getElementById('street');
    const numberInput = document.getElementById('number');
    const cityInput = document.getElementById('city');
    const stateInput = document.getElementById('state');
    const complementInput = document.getElementById('complement');
    const addressInput = document.getElementById('address');

    // Mapeamento de campos para validação
    const fields = [
        'foodName', 'foodType', 'description', 'quantity', 'unit',
        'expiryDate', 'collectionDate', 'cep', 'street', 'number', 'city', 'state', 'address', 'conservation', 'foodPhoto', 'terms'
    ];

    // --- Lógica de CEP e ViaCEP ---
    
    // Formatação automática do CEP
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        // Limita a 8 dígitos
        if (value.length > 8) {
            value = value.substring(0, 8);
        }
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        e.target.value = value;
    });

    // Busca endereço pelo CEP
    async function searchAddressByCep(cep) {
        const cleanCep = cep.replace(/\D/g, '');
        
        if (cleanCep.length !== 8) {
            showNotification('CEP deve ter 8 dígitos.', 'error');
            return;
        }

        try {
            searchCepBtn.disabled = true;
            searchCepBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (data.erro) {
                showNotification('CEP não encontrado.', 'error');
                return;
            }

            // Preenche os campos automaticamente
            streetInput.value = data.logradouro || '';
            cityInput.value = data.localidade || '';
            stateInput.value = data.uf || '';
            
            // Gera o endereço completo
            generateFullAddress();
            
            showNotification('Endereço encontrado com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            showNotification('Erro ao buscar CEP. Tente novamente.', 'error');
        } finally {
            searchCepBtn.disabled = false;
            searchCepBtn.innerHTML = '<i class="fas fa-search"></i>';
        }
    }

    // Gera endereço completo automaticamente
    function generateFullAddress() {
        const street = streetInput.value.trim();
        const number = numberInput.value.trim();
        const city = cityInput.value.trim();
        const state = stateInput.value.trim();
        const complement = complementInput.value.trim();
        
        if (street && number && city && state) {
            let fullAddress = `${street}, ${number}`;
            if (complement) {
                fullAddress += `, ${complement}`;
            }
            fullAddress += `, ${city} - ${state}`;
            
            addressInput.value = fullAddress;
        }
    }

    // Event listeners para busca de CEP
    searchCepBtn.addEventListener('click', () => {
        const cep = cepInput.value.trim();
        if (cep) {
            searchAddressByCep(cep);
        } else {
            showNotification('Digite um CEP válido.', 'error');
        }
    });

    // Busca automática quando CEP estiver completo
    cepInput.addEventListener('blur', () => {
        const cep = cepInput.value.trim();
        if (cep && cep.length === 9) { // 00000-000
            searchAddressByCep(cep);
        }
    });

    // Atualiza endereço completo quando outros campos mudam
    [streetInput, numberInput, cityInput, stateInput, complementInput].forEach(input => {
        input.addEventListener('input', generateFullAddress);
    });

    // --- Lógica de Imagem e Pré-visualização ---
    photoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
                const icon = photoPreview.previousElementSibling;
                if (icon) icon.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            photoPreview.style.display = 'none';
            const icon = photoPreview.previousElementSibling;
            if (icon) icon.style.display = 'block';
        }
    });

    // --- Lógica de Seção Opcional Expansível ---
    toggleBtn.addEventListener('click', () => {
        const isHidden = optionalContent.classList.toggle('hidden');
        optionalContent.classList.toggle('visible', !isHidden);
        
        // Atualizar ícone e texto
        const icon = toggleBtn.querySelector('i');
        toggleBtn.innerHTML = '';
        if (isHidden) {
            icon.className = 'fas fa-chevron-down';
            toggleBtn.appendChild(icon);
            toggleBtn.appendChild(document.createTextNode(' Mostrar Mais Detalhes (Opcional)'));
        } else {
            icon.className = 'fas fa-chevron-up';
            toggleBtn.appendChild(icon);
            toggleBtn.appendChild(document.createTextNode(' Ocultar Detalhes'));
        }
    });
    
    // --- Lógica de Geolocalização ---
    getLocationBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            locationStatus.textContent = 'Geolocalização não suportada pelo seu navegador.';
            showNotification('Seu navegador não suporta a API de Geolocalização.', 'warning');
            return;
        }

        locationStatus.textContent = 'Localizando...';

        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            document.getElementById('lat').value = lat;
            document.getElementById('lng').value = lng;
            locationStatus.textContent = `Lat: ${lat.toFixed(5)}, Lon: ${lng.toFixed(5)} (Localização obtida)`;
            
            // Tenta obter o endereço reverso (API externa - ViaCEP é mais confiável para o BR)
            // Simulação de endereço reverso para manter o código self-contained
            const mockAddress = `Endereço Automático, Próximo a Lat ${lat.toFixed(2)}`;
            document.getElementById('address').value = mockAddress;

            showNotification('Localização obtida com sucesso!', 'success');
        }, (error) => {
            locationStatus.textContent = 'Não foi possível obter sua localização. Preencha manualmente.';
            showNotification('Erro: ' + error.message, 'error');
            document.getElementById('lat').value = '';
            document.getElementById('lng').value = '';
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    });


    // --- Lógica de Validação ---
    function validateForm() {
        let isValid = true;
        
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const errorElement = document.getElementById(`error-${fieldName}`);
            const parent = field.closest('.form-group') || field.closest('.terms-group');
            
            errorElement.textContent = '';
            parent.classList.remove('has-error');
            
            if (field.required && (!field.value.trim() && field.type !== 'file' && field.type !== 'checkbox' || (field.type === 'checkbox' && !field.checked))) {
                errorElement.textContent = `Este campo é obrigatório.`;
                parent.classList.add('has-error');
                isValid = false;
            } 
            
            if (fieldName === 'quantity' && parseFloat(field.value) <= 0) {
                 errorElement.textContent = `A quantidade deve ser maior que zero.`;
                 parent.classList.add('has-error');
                 isValid = false;
            }

            // Validação específica para CEP
            if (fieldName === 'cep') {
                const cepValue = field.value.replace(/\D/g, '');
                if (cepValue.length !== 8) {
                    errorElement.textContent = `CEP deve ter 8 dígitos.`;
                    parent.classList.add('has-error');
                    isValid = false;
                }
            }

            // Validação específica para Estado (UF)
            if (fieldName === 'state') {
                const stateValue = field.value.trim().toUpperCase();
                if (stateValue.length !== 2) {
                    errorElement.textContent = `Estado deve ter 2 caracteres (UF).`;
                    parent.classList.add('has-error');
                    isValid = false;
                }
            }

            if (fieldName === 'foodPhoto' && field.required && (!field.files || field.files.length === 0)) {
                errorElement.textContent = `Uma foto é obrigatória.`;
                parent.classList.add('has-error');
                isValid = false;
            }
        });

        return isValid;
    }

    // --- Lógica de Submissão ---
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showNotification('Corrija os erros destacados no formulário.', 'error', 4000);
            return;
        }

        const formData = new FormData(form);
        const data = {};
        
        // Coleta todos os dados do formulário
        for (let [key, value] of formData.entries()) {
            // Converte quantidade para número
            if (key === 'quantity') {
                data[key] = parseFloat(value);
            } else if (key !== 'foodPhoto') { // Ignora a foto por enquanto
                data[key] = value;
            }
        }

        // Adiciona campos de termos (booleano) e geolocalização
        data.termsAccepted = formData.get('terms') === 'on';
        data.latitude = formData.get('lat') ? parseFloat(formData.get('lat')) : null;
        data.longitude = formData.get('lng') ? parseFloat(formData.get('lng')) : null;
        
        // Prepara dados simulados para envio ao backend (que usa o modelo Doacao)
        const payload = {
            titulo: data.foodName,
            descricao: `Tipo: ${data.foodType}. Detalhes: ${data.description}. Conservação: ${data.conservation}. Restrições: ${data.restrictions || 'Nenhuma'}. Medida Caseira: ${data.homeMeasure || 'N/A'}`,
            tipoAlimento: data.foodType,
            quantidade: data.quantity,
            cidade: data.city,
            endereco: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
            // Campos extras que o backend não espera, mas o frontend coleta:
            dataValidade: data.expiryDate,
            dataColeta: data.collectionDate,
            destino: data.donationTarget,
            unidade: data.unit,
            // Novos campos de endereço detalhado:
            cep: data.cep,
            rua: data.street,
            numero: data.number,
            estado: data.state,
            complemento: data.complement || ''
        };

        // Envio real para o backend
        btnSubmit.textContent = 'Enviando...';
        btnSubmit.disabled = true;

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/doacoes', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                showNotification('Alimento cadastrado com sucesso! Redirecionando para suas doações.', 'success', 3000);
                
                // Notificar sistema de tempo real sobre nova doação
                if (typeof notifyNewDonation === 'function') {
                    notifyNewDonation(result);
                } else {
                    // Fallback para evento personalizado
                    const newDonationEvent = new CustomEvent('newDonationCreated', {
                        detail: {
                            doacao: result,
                            timestamp: new Date().toISOString()
                        }
                    });
                    window.dispatchEvent(newDonationEvent);
                }
                
                // Reseta o formulário
                form.reset();
                
                // Redirecionar para minhas doações após sucesso
                setTimeout(() => {
                    window.location.href = 'minhas-doacoes.html';
                }, 2000);
            } else {
                const errorText = await response.text();
                showNotification(`Erro ao cadastrar alimento: ${errorText}`, 'error', 5000);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            showNotification('Erro de conexão. Verifique sua internet e tente novamente.', 'error', 5000);
        } finally {
            btnSubmit.textContent = 'Cadastrar Alimento para Doação';
            btnSubmit.disabled = false;
        }
    });
});