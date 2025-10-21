// Sistema de gerenciamento de atualizações em tempo real
class RealtimeManager {
    constructor() {
        this.eventListeners = new Map();
        this.storageKey = 'prato_justo_realtime';
        this.init();
    }

    init() {
        // Escutar mudanças no localStorage (comunicação entre abas)
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.handleStorageChange(e.newValue);
            }
        });

        // Escutar eventos personalizados
        window.addEventListener('newDonationCreated', (e) => {
            this.broadcastToOtherTabs('newDonation', e.detail);
        });
    }

    // Registrar listener para eventos específicos
    on(eventType, callback) {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, []);
        }
        this.eventListeners.get(eventType).push(callback);
    }

    // Remover listener
    off(eventType, callback) {
        if (this.eventListeners.has(eventType)) {
            const listeners = this.eventListeners.get(eventType);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    // Disparar evento local
    emit(eventType, data) {
        const event = new CustomEvent(eventType, { detail: data });
        window.dispatchEvent(event);
    }

    // Enviar mensagem para outras abas
    broadcastToOtherTabs(eventType, data) {
        const message = {
            type: eventType,
            data: data,
            timestamp: Date.now(),
            source: 'realtime-manager'
        };

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(message));
            // Limpar após um tempo para evitar acúmulo
            setTimeout(() => {
                localStorage.removeItem(this.storageKey);
            }, 1000);
        } catch (error) {
            console.warn('Erro ao enviar mensagem para outras abas:', error);
        }
    }

    // Processar mudanças no localStorage
    handleStorageChange(newValue) {
        if (!newValue) return;

        try {
            const message = JSON.parse(newValue);
            if (message.source === 'realtime-manager') {
                this.notifyListeners(message.type, message.data);
            }
        } catch (error) {
            console.warn('Erro ao processar mensagem do localStorage:', error);
        }
    }

    // Notificar listeners registrados
    notifyListeners(eventType, data) {
        if (this.eventListeners.has(eventType)) {
            this.eventListeners.get(eventType).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Erro ao executar listener:', error);
                }
            });
        }
    }

    // Método de conveniência para nova doação
    notifyNewDonation(doacao) {
        this.emit('newDonationCreated', { doacao, timestamp: new Date().toISOString() });
        this.broadcastToOtherTabs('newDonation', { doacao, timestamp: new Date().toISOString() });
    }
}

// Instância global
const realtimeManager = new RealtimeManager();

// Função global para facilitar o uso
function notifyNewDonation(doacao) {
    realtimeManager.notifyNewDonation(doacao);
}

// Exportar para uso em outros arquivos
window.RealtimeManager = RealtimeManager;
window.realtimeManager = realtimeManager;
window.notifyNewDonation = notifyNewDonation;
