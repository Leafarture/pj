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
    const expiryDateInput = document.getElementById('expiryDate');
    const collectionDateInput = document.getElementById('collectionDate');

    // --- Configurar datas mínimas ---
    // Data de hoje no formato YYYY-MM-DD
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    const hojeStr = hoje.toISOString().split('T')[0];
    const amanhaStr = amanha.toISOString().split('T')[0];
    
    // Data de coleta: mínimo hoje
    collectionDateInput.setAttribute('min', hojeStr);
    
    // Data de validade: mínimo amanhã (deve ser depois de hoje)
    expiryDateInput.setAttribute('min', amanhaStr);

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

            // Validação específica para Data de Validade
            if (fieldName === 'expiryDate' && field.value) {
                const expiryDate = new Date(field.value + 'T00:00:00');
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (expiryDate <= today) {
                    errorElement.textContent = `A data de validade deve ser posterior a hoje.`;
                    parent.classList.add('has-error');
                    isValid = false;
                }
            }

            // Validação específica para Data de Coleta
            if (fieldName === 'collectionDate' && field.value) {
                const collectionDate = new Date(field.value + 'T00:00:00');
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (collectionDate < today) {
                    errorElement.textContent = `A data de coleta não pode ser anterior a hoje.`;
                    parent.classList.add('has-error');
                    isValid = false;
                }
            }
        });

        // Validação adicional: data de validade deve ser posterior à data de coleta
        const expiryDate = document.getElementById('expiryDate').value;
        const collectionDate = document.getElementById('collectionDate').value;
        
        if (expiryDate && collectionDate) {
            const expiry = new Date(expiryDate + 'T00:00:00');
            const collection = new Date(collectionDate + 'T00:00:00');
            
            if (expiry <= collection) {
                const errorElement = document.getElementById('error-expiryDate');
                const parent = document.getElementById('expiryDate').closest('.form-group');
                errorElement.textContent = `A data de validade deve ser posterior à data de coleta.`;
                parent.classList.add('has-error');
                isValid = false;
            }
        }

        return isValid;
    }

    // --- Lógica de Submissão ---
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showNotification('Corrija os erros destacados no formulário.', 'error', 4000);
            return;
        }

        btnSubmit.textContent = 'Enviando...';
        btnSubmit.disabled = true;

        try {
            // 1. Fazer upload da imagem primeiro
            let imageUrl = null;
            const photoFile = photoInput.files[0];
            
            if (photoFile) {
                showNotification('Enviando imagem...', 'info', 2000);
                
                const imageFormData = new FormData();
                imageFormData.append('image', photoFile);
                
                const token = localStorage.getItem('token');
                const imageHeaders = {};
                if (token) {
                    imageHeaders['Authorization'] = `Bearer ${token}`;
                }
                
                const imageResponse = await fetch('/doacoes/upload-image', {
                    method: 'POST',
                    headers: imageHeaders,
                    body: imageFormData
                });
                
                if (!imageResponse.ok) {
                    throw new Error('Erro ao fazer upload da imagem');
                }
                
                const imageResult = await imageResponse.json();
                imageUrl = imageResult.imageUrl;
                
                console.log('✅ Imagem enviada:', imageUrl);
            }

            // 2. Coletar dados do formulário
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                if (key === 'quantity') {
                    data[key] = parseFloat(value);
                } else if (key !== 'foodPhoto') {
                    data[key] = value;
                }
            }

            data.termsAccepted = formData.get('terms') === 'on';
            data.latitude = formData.get('lat') ? parseFloat(formData.get('lat')) : null;
            data.longitude = formData.get('lng') ? parseFloat(formData.get('lng')) : null;
            
            // 3. Preparar dados para envio
            const payload = {
                titulo: data.foodName,
                descricao: `Tipo: ${data.foodType}. Detalhes: ${data.description}. Conservação: ${data.conservation}. Restrições: ${data.restrictions || 'Nenhuma'}. Medida Caseira: ${data.homeMeasure || 'N/A'}`,
                tipoAlimento: data.foodType,
                quantidade: data.quantity,
                cidade: data.city,
                endereco: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                dataValidade: data.expiryDate,
                dataColeta: data.collectionDate,
                destino: data.donationTarget,
                unidade: data.unit,
                cep: data.cep,
                rua: data.street,
                numero: data.number,
                estado: data.state,
                complemento: data.complement || '',
                imagem: imageUrl  // ✅ URL da imagem
            };

            // 4. Enviar doação
            showNotification('Salvando doação...', 'info', 2000);
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
                showNotification('Alimento cadastrado com sucesso! Redirecionando...', 'success', 3000);
                
                // Notificar sistema de tempo real
                if (typeof notifyNewDonation === 'function') {
                    notifyNewDonation(result);
                } else {
                    const newDonationEvent = new CustomEvent('newDonationCreated', {
                        detail: {
                            doacao: result,
                            timestamp: new Date().toISOString()
                        }
                    });
                    window.dispatchEvent(newDonationEvent);
                }
                
                form.reset();
                
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