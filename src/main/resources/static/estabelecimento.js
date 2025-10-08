// =====================
// Utilitários de validação
// =====================
const validators = {
    nomeEmpresa: (value) => {
        if (!value.trim()) return 'Nome da empresa é obrigatório';
        if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
        return null;
    },
    email: (value) => {
        if (!value.trim()) return 'E-mail é obrigatório';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'E-mail inválido';
        return null;
    },
    cnpj: (value) => {
        if (!value.trim()) return 'CNPJ é obrigatório';
        const cnpj = value.replace(/\D/g, '');
        if (cnpj.length !== 14) return 'CNPJ deve ter 14 dígitos';
        return null;
    },
    telefone: (value) => {
        if (!value.trim()) return 'Telefone é obrigatório';
        const telefone = value.replace(/\D/g, '');
        if (telefone.length < 10 || telefone.length > 11) return 'Telefone deve ter 10 ou 11 dígitos';
        return null;
    },
    rua: (value) => {
        if (!value.trim()) return 'Rua é obrigatória';
        if (value.trim().length < 2) return 'Nome da rua deve ter pelo menos 2 caracteres';
        return null;
    },
    numero: (value) => {
        if (!value.trim()) return 'Número é obrigatório';
        if (!/^\d+$/.test(value.trim())) return 'Número deve conter apenas dígitos';
        return null;
    },
    cidade: (value) => {
        if (!value.trim()) return 'Cidade é obrigatória';
        if (value.trim().length < 2) return 'Cidade deve ter pelo menos 2 caracteres';
        return null;
    },
    estado: (value) => {
        if (!value) return 'Estado é obrigatório';
        return null;
    },
    cep: (value) => {
        if (!value.trim()) return 'CEP é obrigatório';
        const cep = value.replace(/\D/g, '');
        if (cep.length !== 8) return 'CEP deve ter 8 dígitos';
        return null;
    },
    senha: (value) => {
        if (!value) return 'Senha é obrigatória';
        if (value.length < 8) return 'Senha deve ter pelo menos 8 caracteres';
        return null;
    },
    confirmar: (value, formData) => {
        if (!value) return 'Confirmação de senha é obrigatória';
        if (value !== formData.senha) return 'Senhas não coincidem';
        return null;
    },
    termos: (checked) => {
        if (!checked) return 'Você deve concordar com os termos de uso';
        return null;
    }
};

// =====================
// Máscaras de entrada
// =====================
function formatarCNPJ(value) {
    const cnpj = value.replace(/\D/g, '');
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function formatarTelefone(value) {
    const telefone = value.replace(/\D/g, '');
    if (telefone.length <= 10) {
        return telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else {
        return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
}

function formatarCEP(value) {
    const cep = value.replace(/\D/g, '');
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

// =====================
// Validação de campos
// =====================
function validarCampo(campo, formData = null) {
    const value = campo.type === 'checkbox' ? campo.checked : campo.value;
    const validator = validators[campo.name];
    if (!validator) return true;

    const error = validator(value, formData);
    const errorElement = document.getElementById(`erro-${campo.name}`);

    if (error) {
        campo.classList.add('field--error');
        if (errorElement) errorElement.textContent = error;
        return false;
    } else {
        campo.classList.remove('field--error');
        if (errorElement) errorElement.textContent = '';
        return true;
    }
}

function validarFormulario(formData, form) {
    let valido = true;
    const campos = form.querySelectorAll('input, select');
    campos.forEach(campo => {
        if (!validarCampo(campo, formData)) {
            valido = false;
        }
    });
    return valido;
}

// =====================
// Buscar CEP via ViaCEP
// =====================
async function buscarCEP(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (!data.erro) {
            document.getElementById('rua').value = data.logradouro || '';
            document.getElementById('cidade').value = data.localidade || '';
            document.getElementById('estado').value = data.uf || '';
            validarCampo(document.getElementById('rua'));
            validarCampo(document.getElementById('cidade'));
            validarCampo(document.getElementById('estado'));
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
    }
}

// =====================
// Obter dados do formulário
// =====================
function obterDadosFormulario(form) {
    const formData = new FormData(form);
    const dados = {};

    for (let [key, value] of formData.entries()) {
        dados[key] = value;
    }

    const enderecoCompleto = [
        dados.rua,
        dados.numero,
        dados.complemento,
        dados.cidade,
        dados.estado,
        dados.cep
    ].filter(Boolean).join(', ');

    dados.enderecoCompleto = enderecoCompleto;
    return dados;
}

// =====================
// Enviar para o backend
// =====================
async function enviarDadosParaBackend(dados, form) {
    const btnSubmit = form.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.textContent;

    try {
        btnSubmit.textContent = 'Cadastrando...';
        btnSubmit.disabled = true;

        const dadosEnvio = {
            nomeEmpresa: dados.nomeEmpresa,
            email: dados.email,
            senha: dados.senha,
            confirmarSenha: dados.confirmar,
            cnpj: dados.cnpj,
            telefone: dados.telefone,
            rua: dados.rua,
            numero: dados.numero,
            complemento: dados.complemento || "",
            cidade: dados.cidade,
            estado: dados.estado,
            cep: dados.cep,
            termos: dados.termos === 'on' || dados.termos === true
        };

        console.log("Enviando para o backend:", JSON.stringify(dadosEnvio, null, 2));

        const response = await fetch('/auth/estabelecimento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosEnvio)
        });

        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            form.reset();
        } else {
            const erro = await response.text();
            alert('Erro no cadastro: ' + erro);
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor. Tente novamente.');
        console.error(error);
    } finally {
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
    }
}

// =====================
// Inicialização
// =====================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastro-estabelecimento');
    const anoElement = document.getElementById('ano');

    if (anoElement) {
        anoElement.textContent = new Date().getFullYear();
    }

    // Máscaras
    const cnpjInput = document.getElementById('cnpj');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');

    if (cnpjInput) {
        cnpjInput.addEventListener('input', e => {
            e.target.value = formatarCNPJ(e.target.value);
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', e => {
            e.target.value = formatarTelefone(e.target.value);
        });
    }

    if (cepInput) {
        cepInput.addEventListener('input', e => {
            e.target.value = formatarCEP(e.target.value);
        });

        cepInput.addEventListener('blur', e => {
            buscarCEP(e.target.value);
        });
    }

    // Validação em tempo real
    const campos = form.querySelectorAll('input, select');
    campos.forEach(campo => {
        campo.addEventListener('blur', function () {
            const formData = obterDadosFormulario(form);
            validarCampo(this, formData);
        });

        campo.addEventListener('input', function () {
            this.classList.remove('field--error');
            const errorElement = document.getElementById(`erro-${this.name}`);
            if (errorElement && errorElement.textContent) {
                errorElement.textContent = '';
            }
        });
    });

    // Submissão do formulário
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = obterDadosFormulario(form);
        if (validarFormulario(formData, form)) {
            enviarDadosParaBackend(formData, form);
        } else {
            const primeiroErro = form.querySelector('.field--error');
            if (primeiroErro) primeiroErro.focus();
        }
    });
});
