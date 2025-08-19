document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const importTypeGroup = document.getElementById('importTypeGroup');
    const checkboxOptions = document.querySelectorAll('input[name="importTypes"]');
    const policyTypeStep = document.getElementById('policyTypeStep');
    const policyTypeOptions = document.querySelectorAll('input[name="policyType"]');
    const singlePolicyStep = document.getElementById('singlePolicyStep');
    const policyInfoStep = document.getElementById('policyInfoStep');
    const documentsStep = document.getElementById('documentsStep');
    const agentTypeStep = document.getElementById('agentTypeStep');
    const agentTypeOptions = document.querySelectorAll('input[name="agentType"]');
    const singleAgentStep = document.getElementById('singleAgentStep');
    const policiesStep = document.getElementById('policiesStep');
    const agentsStep = document.getElementById('agentsStep');
    const confirmationStep = document.getElementById('confirmationStep');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const confirmationFiles = document.getElementById('confirmationFiles');
    const progressSteps = document.querySelectorAll('.progress-step');
    const clientsUploadGroup = document.getElementById('clientsUploadGroup');
    const progressBar = document.querySelector('.progress-bar');
    const progressInfo = document.querySelector('.progress-info');
    
    // Elementos do modal
    const modalOverlay = document.getElementById('modalOverlay');
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    const modalOkButton = document.getElementById('modalOkButton');
    const errorModalButton = document.getElementById('errorModalButton');
    const errorMessage = document.getElementById('errorMessage');
    
    // Upload areas
    const policiesUploadArea = document.getElementById('policiesUploadArea');
    const clientsUploadArea = document.getElementById('clientsUploadArea');
    const agentsUploadArea = document.getElementById('agentsUploadArea');
    const policiesUpload = document.getElementById('policiesUpload');
    const clientsUpload = document.getElementById('clientsUpload');
    const agentsUpload = document.getElementById('agentsUpload');
    
    // Checkboxes de conversão
    const convertPoliciesCSV = document.getElementById('convertPoliciesCSV');
    const convertClientsCSV = document.getElementById('convertClientsCSV');
    const convertAgentsCSV = document.getElementById('convertAgentsCSV');
    
    // Info de arquivos
    const policiesFileInfo = document.getElementById('policiesFileInfo');
    const clientsFileInfo = document.getElementById('clientsFileInfo');
    const agentsFileInfo = document.getElementById('agentsFileInfo');
    
    // Status
    const policiesStatus = document.getElementById('policiesStatus');
    const clientsStatus = document.getElementById('clientsStatus');
    const agentsStatus = document.getElementById('agentsStatus');
    
    // Estado atual
    let currentStep = 1;
    let selectedImportTypes = []; // Array para múltiplas seleções
    let selectedPolicyType = null;
    let selectedAgentType = null;
    let totalSteps = 4;
    
    // Arquivos carregados
    let uploadedFiles = {
        policies: null,
        clients: null,
        agents: null
    };
    
    // Variáveis para o dropdown de agentes upline
    let uplineAgents = [];
    let selectedUplineAgent = '';
    
    // Inicializar funções de modal
    initModals();
    
    // Configuração de tooltips
    setupTooltips();
    
    // Configuração de acessibilidade para upload areas
    setupAccessibleUploads();
    
    // Configurar funcionalidade de arrastar e soltar para áreas de upload
    setupDragAndDrop();
    
    // Configurar eventos para checkboxes - SISTEMA REVOLUCIONÁRIO!
    checkboxOptions.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log('Checkbox alterado:', this.value, this.checked);
            updateSelectedImportTypes();
        });
    });
    
    // Função para atualizar array de tipos selecionados
    function updateSelectedImportTypes() {
        selectedImportTypes = [];
        checkboxOptions.forEach(checkbox => {
            if (checkbox.checked) {
                selectedImportTypes.push(checkbox.value);
            }
        });
        console.log('Tipos selecionados:', selectedImportTypes);
    }
    
    // Configurar eventos para radio buttons de tipo de apólice
    policyTypeOptions.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                selectedPolicyType = this.value;
                // Avançar automaticamente para a próxima etapa
                setTimeout(goToNextStep, 300);
            }
        });
    });
    
    // Configurar eventos para radio buttons de tipo de agente
    agentTypeOptions.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                selectedAgentType = this.value;
                // Avançar automaticamente para a próxima etapa
                setTimeout(goToNextStep, 300);
            }
        });
    });
    
    // Adicionar evento de clique para toda a área da opção
    document.querySelectorAll('.radio-option, .checkbox-option').forEach(option => {
        option.addEventListener('click', function(e) {
            // Verificar se a opção está desabilitada
            if (this.classList.contains('disabled')) {
                e.preventDefault();
                return;
            }
            
            // Evitar propagação dupla se clicar diretamente no input
            if (e.target.type === 'radio' || e.target.type === 'checkbox') return;
            
            const input = this.querySelector('input[type="radio"], input[type="checkbox"]');
            if (input && !input.disabled) {
                if (input.type === 'checkbox') {
                    input.checked = !input.checked;
                } else if (input.type === 'radio' && !input.checked) {
                    input.checked = true;
                }
                input.dispatchEvent(new Event('change'));
            }
        });
    });
    
    // Inicializar funções de modal
    function initModals() {
        // Configurar botões para fechar os modais
        modalOkButton.addEventListener('click', closeModals);
        errorModalButton.addEventListener('click', closeModals);
        
        // Fechar modal ao clicar fora (overlay)
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModals();
            }
        });
        
        // Suporte a teclado para modais (ESC para fechar)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModals();
            }
        });
    }
    
    // Exibir modal de sucesso
    function showSuccessModal(message) {
        if (message) {
            successModal.querySelector('.modal-message').innerHTML = message;
        } else {
            successModal.querySelector('.modal-message').textContent = 'Operação realizada com sucesso!';
        }
        
        modalOverlay.classList.add('active');
        successModal.classList.add('active');
        errorModal.classList.remove('active');
        
        // Foco no botão OK para acessibilidade
        setTimeout(() => modalOkButton.focus(), 100);
    }
    
    // Exibir modal de erro
    function showErrorModal(message) {
        errorMessage.innerHTML = message || 'Ocorreu um erro.';
        
        modalOverlay.classList.add('active');
        errorModal.classList.add('active');
        successModal.classList.remove('active');
        
        // Centralizar o modal na tela
        setTimeout(() => {
            // Posicionar o modal no centro da janela
            const viewportHeight = window.innerHeight;
            const modalHeight = errorModal.offsetHeight;
            
            // Ajustar posição vertical se necessário
            if (modalHeight > viewportHeight * 0.8) {
                errorModal.style.maxHeight = (viewportHeight * 0.8) + 'px';
                errorModal.style.overflowY = 'auto';
            } else {
                errorModal.style.maxHeight = '';
                errorModal.style.overflowY = '';
            }
        }, 10);
        
        // Foco no botão OK para acessibilidade
        setTimeout(() => errorModalButton.focus(), 100);
    }
    
    // Fechar todos os modais
    function closeModals() {
        modalOverlay.classList.remove('active');
        successModal.classList.remove('active');
        errorModal.classList.remove('active');
    }
    
    // Função para criar tooltips
    function setupTooltips() {
        const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');
        
        tooltipTriggers.forEach(trigger => {
            // Adicionar suporte a teclado
            trigger.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const tooltip = this.nextElementSibling;
                    tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
                }
            });
            
            // Fechar tooltip ao clicar fora
    document.addEventListener('click', function(e) {
                if (!trigger.contains(e.target)) {
                    trigger.nextElementSibling.style.display = 'none';
                }
            });
        });
    }
    
    // Função para configurar acessibilidade nas áreas de upload
    function setupAccessibleUploads() {
        const uploadAreas = document.querySelectorAll('.upload-area');
        
        uploadAreas.forEach(area => {
            // Permitir ativação via teclado (Enter ou Space)
            area.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Clicar no input de arquivo
                    this.querySelector('input[type="file"]').click();
                }
            });
            
            // Melhorar feedback visual para estado de foco
            area.addEventListener('focus', function() {
                this.style.borderColor = 'var(--primary)';
                this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';
            });
            
            area.addEventListener('blur', function() {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            });
        });
    }
    
    // Inicializar apenas o passo 1 centralizado
    function initSingleStepProgressBar() {
        // Limpar a barra de progresso existente
        progressBar.innerHTML = '';
        
        // Criar elemento centralizado
        const stepDiv = document.createElement('div');
        stepDiv.className = 'progress-step active';
        stepDiv.style.width = '100%'; // Fazer ocupar toda a largura para centralizar
        stepDiv.style.justifyContent = 'center'; // Centralizar conteúdo
        
        const stepNumber = document.createElement('div');
        stepNumber.className = 'step-number';
        stepNumber.textContent = '1';
        
        const stepTitle = document.createElement('div');
        stepTitle.className = 'step-title';
        stepTitle.textContent = 'Tipo de Importação';
        
        stepDiv.appendChild(stepNumber);
        stepDiv.appendChild(stepTitle);
        
        progressBar.appendChild(stepDiv);
        
        // Atualizar texto de progresso
        if (progressInfo) {
            progressInfo.innerHTML = '<span class="current-step">Etapa 1 de 1:</span> Tipo de Importação';
        }
    }
    
    // Ajustar a barra de progresso com base no tipo de importação
    function adjustProgressBar(importType) {
        // Limpar a barra de progresso existente
        progressBar.innerHTML = '';
        
        // Configurar etapas com base no tipo de importação
        let steps = [];
        
        if (importType === 'single-policy') {
            steps = [
                { number: 1, title: 'Tipo de Importação' },
                { number: 2, title: 'Informações do Contato' },
                { number: 3, title: 'Informações da Apólice' },
                { number: 4, title: 'Documentos' },
                { number: 5, title: 'Confirmação' }
            ];
            totalSteps = 5;
        } else if (importType === 'multiple-policies') {
            steps = [
                { number: 1, title: 'Tipo de Importação' },
                { number: 2, title: 'Apólices/Clientes' },
                { number: 3, title: 'Confirmação' }
            ];
            totalSteps = 3;
        } else if (importType === 'single-agent') {
            steps = [
                { number: 1, title: 'Tipo de Importação' },
                { number: 2, title: 'Informações do Agente' },
                { number: 3, title: 'Confirmação' }
            ];
            totalSteps = 3;
        } else if (importType === 'multiple-agents') {
            steps = [
                { number: 1, title: 'Tipo de Importação' },
                { number: 2, title: 'Agentes' },
                { number: 3, title: 'Confirmação' }
            ];
            totalSteps = 3;
        } else if (importType === 'import-both') {
            steps = [
                { number: 1, title: 'Tipo de Importação' },
                { number: 2, title: 'Apólices/Clientes' },
                { number: 3, title: 'Agentes' },
                { number: 4, title: 'Confirmação' }
            ];
            totalSteps = 4;
        }
        
        // Remover o estilo de centralização
        progressBar.style.justifyContent = '';
        
        // Criar novas etapas de progresso
        steps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'progress-step' + (index === 0 ? ' active' : '');
            // Remover width 100% para cada etapa ter a mesma largura
            stepDiv.style.width = '';
            
            const stepNumber = document.createElement('div');
            stepNumber.className = 'step-number';
            stepNumber.textContent = step.number;
            
            const stepTitle = document.createElement('div');
            stepTitle.className = 'step-title';
            stepTitle.textContent = step.title;
            
            stepDiv.appendChild(stepNumber);
            stepDiv.appendChild(stepTitle);
            
            progressBar.appendChild(stepDiv);
        });
        
        // Atualizar texto de progresso
        if (progressInfo) {
            progressInfo.innerHTML = `<span class="current-step">Etapa 1 de ${totalSteps}:</span> Tipo de Importação`;
        }
    }
    
        // Função para avançar para a próxima etapa - SISTEMA REVOLUCIONÁRIO!
    function goToNextStep() {
        console.log('goToNextStep chamada - currentStep:', currentStep);
        console.log('selectedImportTypes.length:', selectedImportTypes.length);
        
        if (currentStep === 1) {
            if (selectedImportTypes.length === 0) {
                console.log('Nenhum tipo selecionado - mostrando modal de erro');
                showErrorModal('Por favor, selecione pelo menos um tipo de importação.');
            return;
        }
        
            // Determinar fluxo baseado nas seleções
            const hasPolicies = selectedImportTypes.includes('policies');
            const hasAgents = selectedImportTypes.includes('agents');
            
            if (hasPolicies && hasAgents) {
                // AMBOS SELECIONADOS - vai direto para upload
                selectedPolicyType = 'multiple-policies'; // Auto-definir como múltiplas
                adjustProgressBar('import-both');
            policiesStep.style.display = 'block';
            clientsUploadGroup.style.display = 'block';
                importTypeGroup.parentElement.style.display = 'none';
            updateStep(2);
                return;
            } else if (hasPolicies) {
                // SÓ APÓLICES - vai para sub-etapa de apólices
                policyTypeStep.style.display = 'block';
                importTypeGroup.parentElement.style.display = 'none';
            updateStep(2);
                return;
            } else if (hasAgents) {
                // SÓ AGENTES - vai para sub-etapa de agentes
                agentTypeStep.style.display = 'block';
                importTypeGroup.parentElement.style.display = 'none';
                updateStep(2);
                return;
            }
        } else if (currentStep === 2) {
            // Lógica para sub-etapas
            const hasPolicies = selectedImportTypes.includes('policies');
            const hasAgents = selectedImportTypes.includes('agents');
            
            if (hasPolicies && !hasAgents) {
                // Sub-etapa de apólices
                if (!selectedPolicyType) {
                    showErrorModal('Por favor, selecione o tipo de apólice.');
                    return;
                }
                
                if (selectedPolicyType === 'single-policy') {
                    // APÓLICE ÚNICA - vai para formulário manual
                    adjustProgressBar('single-policy');
                    singlePolicyStep.style.display = 'block';
                    policyTypeStep.style.display = 'none';
                    updateStep(2); // Corrigido: formulário de contato é etapa 2
                } else {
                    // MÚLTIPLAS APÓLICES - vai para upload
                    adjustProgressBar('multiple-policies');
            policiesStep.style.display = 'block';
            clientsUploadGroup.style.display = 'block';
                    policyTypeStep.style.display = 'none';
                    updateStep(3);
                }
            } else if (hasAgents && !hasPolicies) {
                // Sub-etapa de agentes
                if (!selectedAgentType) {
                    showErrorModal('Por favor, selecione o tipo de agente.');
                    return;
                }
                
                if (selectedAgentType === 'single-agent') {
                    // AGENTE ÚNICO - vai para formulário manual
                    adjustProgressBar('single-agent');
                    singleAgentStep.style.display = 'block';
                    agentTypeStep.style.display = 'none';
                    updateStep(2); // Formulário do agente é etapa 2
                } else {
                    // MÚLTIPLOS AGENTES - vai para upload
                    adjustProgressBar('multiple-agents');
                    agentsStep.style.display = 'block';
                    agentTypeStep.style.display = 'none';
                    updateStep(3);
                }
            }
        }
    }
    

    
    // Upload areas click - Corrigindo para que o evento funcione corretamente
    policiesUploadArea.querySelector('.upload-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        policiesUpload.click();
    });
    
    clientsUploadArea.querySelector('.upload-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        clientsUpload.click();
    });
    
    agentsUploadArea.querySelector('.upload-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        agentsUpload.click();
    });
    
    // Event listeners para documentos do formulário manual
    const policyDocumentArea = document.getElementById('policyDocumentArea');
    const idDocumentArea = document.getElementById('idDocumentArea');
    const insuredIdDocumentArea = document.getElementById('insuredIdDocumentArea');
    const otherDocumentsArea = document.getElementById('otherDocumentsArea');
    
    if (policyDocumentArea) {
        policyDocumentArea.querySelector('.upload-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('policyDocument').click();
        });
    }
    
    if (idDocumentArea) {
        idDocumentArea.querySelector('.upload-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('idDocument').click();
        });
    }
    
    if (insuredIdDocumentArea) {
        insuredIdDocumentArea.querySelector('.upload-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('insuredIdDocument').click();
        });
    }
    
    if (otherDocumentsArea) {
        otherDocumentsArea.querySelector('.upload-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('otherDocuments').click();
        });
    }
    
    // Event listeners para mudanças nos documentos
    const policyDocument = document.getElementById('policyDocument');
    const idDocument = document.getElementById('idDocument');
    const insuredIdDocument = document.getElementById('insuredIdDocument');
    const otherDocuments = document.getElementById('otherDocuments');
    
    if (policyDocument) {
        policyDocument.addEventListener('change', function() {
            handleDocumentChange(this, 'policyDocumentInfo', 'policyDocumentStatus');
        });
    }
    
    if (idDocument) {
        idDocument.addEventListener('change', function() {
            handleDocumentChange(this, 'idDocumentInfo', 'idDocumentStatus');
        });
    }
    
    if (insuredIdDocument) {
        insuredIdDocument.addEventListener('change', function() {
            handleDocumentChange(this, 'insuredIdDocumentInfo', 'insuredIdDocumentStatus');
        });
    }
    
    if (otherDocuments) {
        otherDocuments.addEventListener('change', function() {
            handleMultipleDocumentsChange(this, 'otherDocumentsInfo', 'otherDocumentsStatus');
        });
    }
    
    // Permitir clique em toda a área de upload para selecionar arquivo
    policiesUploadArea.addEventListener('click', function() {
        policiesUpload.click();
    });
    
    clientsUploadArea.addEventListener('click', function() {
        clientsUpload.click();
    });
    
    agentsUploadArea.addEventListener('click', function() {
        agentsUpload.click();
    });
    
    // Permitir clique em toda a área de upload para documentos do formulário manual
    if (policyDocumentArea) {
        policyDocumentArea.addEventListener('click', function() {
            document.getElementById('policyDocument').click();
        });
    }
    
    if (idDocumentArea) {
        idDocumentArea.addEventListener('click', function() {
            document.getElementById('idDocument').click();
        });
    }
    
    if (insuredIdDocumentArea) {
        insuredIdDocumentArea.addEventListener('click', function() {
            document.getElementById('insuredIdDocument').click();
        });
    }
    
    if (otherDocumentsArea) {
        otherDocumentsArea.addEventListener('click', function() {
            document.getElementById('otherDocuments').click();
        });
    }
    
    // Função para converter arquivo XLSX para CSV usando SheetJS
    function convertToCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const data = e.target.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    
                    // Converter para CSV
                    const csv = XLSX.utils.sheet_to_csv(worksheet);
                    
                    resolve({
                        success: true,
                        data: csv,
                        rows: csv.split('\n').length - 1,
                        columns: csv.split('\n')[0].split(',').length
                    });
                } catch (error) {
                    reject({
                        success: false,
                        error: error.message
                    });
                }
            };
            
            reader.onerror = function() {
                reject({
                    success: false,
                    error: 'Erro ao ler o arquivo'
                });
            };
            
            reader.readAsBinaryString(file);
        });
    }
    
    // Função para baixar CSV
    function downloadCSV(data, filename) {
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Resetar área de upload de arquivo
    function resetFileUpload(uploadArea, fileInput, fileInfo, statusElement) {
        // Limpar input de arquivo
        fileInput.value = '';
        
        // Resetar texto da área de upload
        uploadArea.querySelector('.upload-text').textContent = 'Inserir arquivo aqui';
        
        // Limpar e esconder info do arquivo
        fileInfo.innerHTML = '';
        fileInfo.classList.remove('show');
        
        // Resetar status
        statusElement.innerHTML = '';
        statusElement.className = 'status';
        
        // Resetar estilo da área de upload
        uploadArea.style.borderColor = 'var(--border)';
    }
    
    // Limpar todos os uploads de acordo com o tipo de importação
    function resetUploads(type) {
        if (type === 'policies' || type === 'all') {
            resetFileUpload(policiesUploadArea, policiesUpload, policiesFileInfo, policiesStatus);
            uploadedFiles.policies = null;
        }
        
        if (type === 'clients' || type === 'all') {
            resetFileUpload(clientsUploadArea, clientsUpload, clientsFileInfo, clientsStatus);
            uploadedFiles.clients = null;
        }
        
        if (type === 'agents' || type === 'all') {
            resetFileUpload(agentsUploadArea, agentsUpload, agentsFileInfo, agentsStatus);
            uploadedFiles.agents = null;
            uploadedFiles.agentsCSV = null;
            
            // Remover dropdown de agentes upline
            const existingDropdown = document.getElementById('uplineAgentDropdown');
            if (existingDropdown) {
                existingDropdown.remove();
            }
            uplineAgents = [];
            selectedUplineAgent = '';
        }
    }
    
    // Resetar todo o formulário
    function resetForm() {
        // Resetar todos os uploads
        resetUploads('all');
        
        // Resetar tipo de importação
        selectedImportTypes = [];
        selectedPolicyType = null;
        selectedAgentType = null;
        
        // Forçar reset do currentStep
        currentStep = 1;
        
        // Desmarcar todos os checkboxes
        checkboxOptions.forEach(checkbox => {
            checkbox.checked = false;
        });
        policyTypeOptions.forEach(radio => {
            radio.checked = false;
        });
        agentTypeOptions.forEach(radio => {
            radio.checked = false;
        });
        
        // Limpar todos os formulários
        const allInputs = document.querySelectorAll('#singlePolicyStep input, #policyInfoStep input, #policyInfoStep select, #singleAgentStep input, #singleAgentStep select');
        allInputs.forEach(input => {
            input.value = '';
            input.checked = false;
        });
        
        // Resetar documentos do formulário manual
        const documentInputs = document.querySelectorAll('#policyDocument, #idDocument, #insuredIdDocument, #otherDocuments');
        documentInputs.forEach(input => {
            input.value = '';
        });
        
        // Limpar informações dos documentos
        const documentInfoElements = document.querySelectorAll('#policyDocumentInfo, #idDocumentInfo, #insuredIdDocumentInfo, #otherDocumentsInfo');
        documentInfoElements.forEach(element => {
            if (element) {
                element.innerHTML = '';
                element.classList.remove('show');
            }
        });
        
        // Limpar status dos documentos
        const documentStatusElements = document.querySelectorAll('#policyDocumentStatus, #idDocumentStatus, #insuredIdDocumentStatus, #otherDocumentsStatus');
        documentStatusElements.forEach(element => {
            if (element) {
                element.innerHTML = '';
                element.className = 'status';
            }
        });
        
        // Resetar texto das áreas de upload de documentos
        const documentAreas = document.querySelectorAll('#policyDocumentArea .upload-text, #idDocumentArea .upload-text, #insuredIdDocumentArea .upload-text, #otherDocumentsArea .upload-text');
        documentAreas.forEach(element => {
            if (element) {
                if (element.closest('#otherDocumentsArea')) {
                    element.textContent = 'Inserir outros documentos';
                } else if (element.closest('#policyDocumentArea')) {
                    element.textContent = 'Inserir arquivo da apólice';
                } else if (element.closest('#idDocumentArea')) {
                    element.textContent = 'Inserir ID do contratante';
                } else if (element.closest('#insuredIdDocumentArea')) {
                    element.textContent = 'Inserir ID do assegurado';
                }
            }
        });
        
        // Voltar para a primeira etapa
        policiesStep.style.display = 'none';
        agentsStep.style.display = 'none';
        confirmationStep.style.display = 'none';
        policyTypeStep.style.display = 'none';
        singlePolicyStep.style.display = 'none';
        policyInfoStep.style.display = 'none';
        documentsStep.style.display = 'none';
        agentTypeStep.style.display = 'none';
        singleAgentStep.style.display = 'none';
        clientsUploadGroup.style.display = 'none';
        importTypeGroup.parentElement.style.display = 'block';
        
        // Resetar texto do botão próximo
        nextBtn.innerHTML = 'Próximo <i class="fas fa-arrow-right"></i>';
        nextBtn.style.display = 'flex';
        confirmBtn.style.display = 'none';
        
        // Restaurar barra de progresso inicial com apenas 1 passo
        initSingleStepProgressBar();
        
        // Atualizar indicadores de progresso
        updateStep(1);
    }
    
    // Processar upload de políticas (CSV)
    policiesUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            uploadedFiles.policies = file;
            
            policiesUploadArea.querySelector('.upload-text').textContent = file.name;
            policiesFileInfo.innerHTML = `
                <strong>Arquivo:</strong> ${file.name}
            `;
            policiesFileInfo.classList.add('show');
            policiesStatus.innerHTML = '<i class="fas fa-check-circle"></i> Arquivo adicionado com sucesso';
            policiesStatus.className = 'status success';
        }
    });
    
    // Processar upload de clientes (CSV)
    clientsUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            uploadedFiles.clients = file;
            
            clientsUploadArea.querySelector('.upload-text').textContent = file.name;
            clientsFileInfo.innerHTML = `
                <strong>Arquivo:</strong> ${file.name}
            `;
            clientsFileInfo.classList.add('show');
            clientsUploadArea.style.borderColor = 'var(--success)';
            clientsStatus.innerHTML = '<i class="fas fa-check-circle"></i> Arquivo adicionado com sucesso';
            clientsStatus.className = 'status success';
        }
    });
    
    // Extrair nomes únicos da coluna "Upline Agent" do CSV
    function extractUplineAgents(csvText) {
        if (!csvText) return [];
        
        try {
            // Dividir o CSV em linhas
            const lines = csvText.split('\n');
            
            // Obter os cabeçalhos
            const headers = lines[0].split(',');
            
            // Remover aspas e espaços dos cabeçalhos
            const cleanHeaders = headers.map(h => h.trim().replace(/"/g, '').toLowerCase());
            console.log('Cabeçalhos encontrados:', cleanHeaders);
            
            // Nomes possíveis para a coluna de upline
            const possibleNames = ['upline agent', 'upline', 'upline agents', 'supervisor', 'manager'];
            
            // Encontrar o índice da coluna "Upline Agent" ou similar
            let uplineAgentIndex = -1;
            
            for (const name of possibleNames) {
                uplineAgentIndex = cleanHeaders.findIndex(header => header === name);
                if (uplineAgentIndex !== -1) {
                    console.log(`Coluna encontrada: "${name}" no índice ${uplineAgentIndex}`);
                    break;
                }
            }
            
            // Se ainda não encontrou, tenta uma busca mais flexível (contém)
            if (uplineAgentIndex === -1) {
                for (const name of possibleNames) {
                    uplineAgentIndex = cleanHeaders.findIndex(header => header.includes(name));
                    if (uplineAgentIndex !== -1) {
                        console.log(`Coluna similar encontrada: "${cleanHeaders[uplineAgentIndex]}" no índice ${uplineAgentIndex}`);
                        break;
                    }
                }
            }
            
            if (uplineAgentIndex === -1) {
                console.error('Coluna de upline não encontrada. Cabeçalhos:', cleanHeaders);
                return [];
            }
            
            console.log('Índice da coluna Upline Agent:', uplineAgentIndex);
            
            // Extrair todos os nomes de upline e contar frequência
            const uplineFrequency = {};
            
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue; // Pular linhas vazias
                
                // Dividir a linha em colunas, respeitando aspas
                const values = parseCSVLine(lines[i]);
                
                if (values.length > uplineAgentIndex) {
                    const uplineName = values[uplineAgentIndex].trim().replace(/"/g, '');
                    if (uplineName) {
                        // Incrementar contador de frequência
                        uplineFrequency[uplineName] = (uplineFrequency[uplineName] || 0) + 1;
                    }
                }
            }
            
            // Converter o objeto de frequência em um array
            const uplineNames = Object.keys(uplineFrequency);
            
            // Ordenar por frequência (do mais comum para o menos comum)
            uplineNames.sort((a, b) => uplineFrequency[b] - uplineFrequency[a]);
            
            console.log('Nomes de upline extraídos por frequência:', uplineNames);
            console.log('Frequência de cada upline:', uplineFrequency);
            
            return uplineNames;
        } catch (error) {
            console.error('Erro ao extrair nomes de upline:', error);
            return [];
        }
    }
    
    // Função auxiliar para dividir uma linha CSV, respeitando aspas
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current); // Adicionar o último campo
        return result;
    }
    
    // Criar o dropdown de seleção de agente upline
    function createUplineAgentDropdown(agents) {
        // Remover dropdown existente se houver
        const existingDropdown = document.getElementById('uplineAgentDropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }
        
        if (!agents || agents.length === 0) return;
        
        // Criar o wrapper do dropdown
        const dropdownWrapper = document.createElement('div');
        dropdownWrapper.id = 'uplineAgentDropdown';
        dropdownWrapper.className = 'upline-agent-dropdown';
        
        // Criar o label
        const label = document.createElement('label');
        label.setAttribute('for', 'uplineAgentSelect');
        label.textContent = 'Selecione seu nome (opcional):';
        dropdownWrapper.appendChild(label);
        
        // Criar o select
        const select = document.createElement('select');
        select.id = 'uplineAgentSelect';
        select.className = 'form-control';
        
        // Adicionar opção vazia
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Selecione um agente...';
        select.appendChild(emptyOption);
        
        // Adicionar opções para cada agente
        agents.forEach(agent => {
            const option = document.createElement('option');
            option.value = agent;
            option.textContent = agent;
            select.appendChild(option);
        });
        
        // Adicionar evento de change
        select.addEventListener('change', function() {
            selectedUplineAgent = this.value;
            console.log('Agente upline selecionado:', selectedUplineAgent);
        });
        
        dropdownWrapper.appendChild(select);
        
        // Inserir após os botões de navegação
        const navigationDiv = document.querySelector('.navigation');
        navigationDiv.insertAdjacentElement('afterend', dropdownWrapper);
        
        return dropdownWrapper;
    }

    // Processar upload de agentes (XLSX ou CSV)
    agentsUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            uploadedFiles.agents = file;
            
            agentsUploadArea.querySelector('.upload-text').textContent = file.name;
            
            // Verificar extensão do arquivo
            const fileExtension = file.name.split('.').pop().toLowerCase();
            
            if (fileExtension === 'csv') {
                // Se for CSV, ler diretamente
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const csvText = e.target.result;
                    
                    // Armazenar o CSV
                    uploadedFiles.agentsCSV = csvText;
                    
                    // Extrair nomes de upline do CSV
                    uplineAgents = extractUplineAgents(csvText);
                    
                    // Criar dropdown para seleção de agente se houver uplines
                    if (uplineAgents.length > 0) {
                        createUplineAgentDropdown(uplineAgents);
                    }
                    
                    agentsFileInfo.innerHTML = `<strong>Arquivo:</strong> ${file.name}`;
                    agentsFileInfo.classList.add('show');
                    agentsUploadArea.style.borderColor = 'var(--success)';
                    agentsStatus.innerHTML = '<i class="fas fa-check-circle"></i> Arquivo CSV adicionado com sucesso';
                    agentsStatus.className = 'status success';
                };
                
                reader.onerror = function() {
                    agentsFileInfo.innerHTML = `<strong>Arquivo:</strong> ${file.name}`;
                    agentsFileInfo.classList.add('show');
                    agentsStatus.textContent = 'Erro ao ler arquivo CSV';
                    agentsStatus.className = 'status error';
                };
                
                reader.readAsText(file);
            } else {
                // Se for XLSX ou XLS, converter para CSV
            convertToCSV(file).then(result => {
                // Armazenar o CSV convertido
                uploadedFiles.agentsCSV = result.data;
                
                    // Extrair nomes de upline do CSV
                    uplineAgents = extractUplineAgents(result.data);
                    
                    // Criar dropdown para seleção de agente se houver uplines
                    if (uplineAgents.length > 0) {
                        createUplineAgentDropdown(uplineAgents);
                    }
                    
                    agentsFileInfo.innerHTML = `<strong>Arquivo:</strong> ${file.name}`;
                agentsFileInfo.classList.add('show');
                agentsUploadArea.style.borderColor = 'var(--success)';
                agentsStatus.innerHTML = '<i class="fas fa-check-circle"></i> Arquivo convertido para CSV com sucesso';
                agentsStatus.className = 'status success';
            }).catch(error => {
                    agentsFileInfo.innerHTML = `<strong>Arquivo:</strong> ${file.name}`;
                agentsFileInfo.classList.add('show');
                agentsStatus.textContent = 'Erro ao converter arquivo';
                agentsStatus.className = 'status error';
            });
            }
        }
    });
    
    // Função para atualizar o passo atual
    function updateStep(step) {
        currentStep = step;
        
        // Atualizar as classes dos passos
        document.querySelectorAll('.progress-step').forEach((stepElement, index) => {
            if (index + 1 < currentStep) {
                stepElement.classList.remove('active');
                stepElement.classList.add('completed');
            } else if (index + 1 === currentStep) {
                stepElement.classList.add('active');
                stepElement.classList.remove('completed');
            } else {
                stepElement.classList.remove('active', 'completed');
            }
        });
        
        // Atualizar o texto de progresso
        if (progressInfo) {
            let stepTitle = '';
            if (currentStep === 1) stepTitle = 'Tipo de Importação';
            else if (currentStep === 2) {
                if (selectedImportType === 'multiple-policies' || selectedImportType === 'import-both') {
                    stepTitle = 'Apólices/Clientes';
                } else {
                    stepTitle = 'Agentes';
                }
            }
            else if (currentStep === 3) {
                if (selectedImportType === 'import-both') {
                    stepTitle = 'Agentes';
                } else {
                    stepTitle = 'Confirmação';
                }
            }
            else if (currentStep === 4) stepTitle = 'Confirmação';
            
            progressInfo.innerHTML = `<span class="current-step">Etapa ${currentStep} de ${totalSteps}:</span> ${stepTitle}`;
            
            // Anunciar para leitores de tela
            progressInfo.setAttribute('aria-live', 'polite');
        }
        
        // Adicionar class .current no passo atual
        const currentStepElement = document.querySelector(`.progress-step:nth-child(${currentStep})`);
        if (currentStepElement) {
            currentStepElement.classList.add('current');
        }
        
        // Mostrar/esconder botão anterior
        if (currentStep > 1) {
            prevBtn.style.display = 'flex';
        } else {
            prevBtn.style.display = 'none';
        }
    }
    
    // Prepara a confirmação final
    function prepareConfirmation() {
        const confirmationMessage = document.getElementById('confirmationMessage');
        const confirmationContent = document.getElementById('confirmationContent');
        
        confirmationContent.innerHTML = '';
        
        // Verificar se é formulário manual ou upload de arquivos
        if (selectedPolicyType === 'single-policy') {
            // FORMULÁRIO MANUAL DE APÓLICE - mostrar informações preenchidas
            confirmationMessage.textContent = 'Confira antes de enviar:';
            
            const formData = collectFormData();
            const confirmationHtml = generateConfirmationHtml(formData);
            confirmationContent.innerHTML = confirmationHtml;
            
        } else if (selectedAgentType === 'single-agent') {
            // FORMULÁRIO MANUAL DE AGENTE - mostrar informações preenchidas
            confirmationMessage.textContent = 'Confira antes de enviar:';
            
            const formData = collectAgentFormData();
            const confirmationHtml = generateAgentConfirmationHtml(formData);
            confirmationContent.innerHTML = confirmationHtml;
            
        } else {
            // UPLOAD DE ARQUIVOS - mostrar arquivos como antes
            confirmationMessage.textContent = 'Você está prestes a importar os seguintes arquivos:';
        
        if (uploadedFiles.policies) {
            const div = document.createElement('div');
            div.className = 'confirmation-file';
            div.innerHTML = `
                <i class="fas fa-file-csv"></i>
                <span class="file-name">${uploadedFiles.policies.name}</span>
            `;
                confirmationContent.appendChild(div);
        }
        
        if (uploadedFiles.clients) {
            const div = document.createElement('div');
            div.className = 'confirmation-file';
            div.innerHTML = `
                <i class="fas fa-file-csv"></i>
                <span class="file-name">${uploadedFiles.clients.name}</span>
            `;
                confirmationContent.appendChild(div);
        }
        
        if (uploadedFiles.agents) {
                // Determinar o ícone correto com base na extensão do arquivo
                const fileExtension = uploadedFiles.agents.name.split('.').pop().toLowerCase();
                const iconClass = fileExtension === 'csv' ? 'fa-file-csv' : 'fa-file-excel';
                
            const div = document.createElement('div');
            div.className = 'confirmation-file';
            div.innerHTML = `
                    <i class="fas ${iconClass}"></i>
                <span class="file-name">${uploadedFiles.agents.name}</span>
                `;
                confirmationContent.appendChild(div);
            }
        }
    }
    
    // Função para coletar dados do formulário manual (APENAS dados preenchidos à mão)
    function collectFormData() {
        console.log('Coletando dados do formulário...');
        const data = {};
        
        // Informações do Contato
        data.contactName = document.getElementById('contactName')?.value || '';
        data.contactPhone = document.getElementById('contactPhone')?.value || '';
        data.contactEmail = document.getElementById('contactEmail')?.value || '';
        data.contactBirthDate = document.getElementById('contactBirthDate')?.value || '';
        data.contactStreet = document.getElementById('contactStreet')?.value || '';
        data.contactState = document.getElementById('contactState')?.value || '';
        data.contactZipCode = document.getElementById('contactZipCode')?.value || '';
        
        // Informações da Apólice
        data.policyNumber = document.getElementById('policyNumber')?.value || '';
        data.issueDate = document.getElementById('issueDate')?.value || '';
        data.annualPremium = document.getElementById('annualPremium')?.value || '';
        data.totalCommission = document.getElementById('totalCommission')?.value || '';
        data.productCategory = document.getElementById('productCategory')?.value || '';
        data.carrier = document.getElementById('carrier')?.value || '';
        data.carrierOther = document.getElementById('carrierOther')?.value || '';
        
        // Informações do Assegurado
        data.insuredType = document.getElementById('insuredType')?.value || '';
        data.insuredTypeOther = document.getElementById('insuredTypeOther')?.value || '';
        data.insuredName = document.getElementById('insuredName')?.value || '';
        data.insuredBirthDate = document.getElementById('insuredBirthDate')?.value || '';
        
        // Documentos/Fotos (opcionais) - arquivos para envio via webhook
        data.documents = {
            policyDocument: document.getElementById('policyDocument')?.files[0] || null,
            idDocument: document.getElementById('idDocument')?.files[0] || null,
            insuredIdDocument: document.getElementById('insuredIdDocument')?.files[0] || null,
            otherDocuments: []
        };
        
        // Coletar outros documentos (pode haver múltiplos)
        const otherDocsInput = document.getElementById('otherDocuments');
        if (otherDocsInput && otherDocsInput.files) {
            for (let i = 0; i < otherDocsInput.files.length; i++) {
                data.documents.otherDocuments.push(otherDocsInput.files[i]);
            }
        }
        
        console.log('Dados coletados:', data);
        return data;
    }
    
    // Função para gerar HTML de confirmação
    function generateConfirmationHtml(data) {
        const sections = [];
        
        // Seção: Informações do Contato
        sections.push(`
            <div class="confirmation-section">
                <h4><i class="fas fa-user"></i> Informações do Contato</h4>
                <div class="confirmation-grid">
                    <div class="confirmation-item"><strong>Nome:</strong> ${data.contactName}</div>
                    <div class="confirmation-item"><strong>Telefone:</strong> ${data.contactPhone}</div>
                    <div class="confirmation-item"><strong>Email:</strong> ${data.contactEmail}</div>
                    <div class="confirmation-item"><strong>Data de Nascimento:</strong> ${formatDate(data.contactBirthDate)}</div>
                    <div class="confirmation-item"><strong>Endereço:</strong> ${data.contactStreet}</div>
                    <div class="confirmation-item"><strong>Estado:</strong> ${data.contactState}</div>
                    <div class="confirmation-item"><strong>ZIP Code:</strong> ${data.contactZipCode}</div>
                </div>
            </div>
        `);
        
        // Seção: Informações da Apólice
        const carrierDisplay = data.carrier === 'other' ? data.carrierOther : data.carrier;
        const productCategoryDisplay = getSelectText('productCategory', data.productCategory);
        
        sections.push(`
            <div class="confirmation-section">
                <h4><i class="fas fa-file-contract"></i> Informações da Apólice</h4>
                <div class="confirmation-grid">
                    <div class="confirmation-item"><strong>Número da Apólice:</strong> ${data.policyNumber}</div>
                    <div class="confirmation-item"><strong>Data de Emissão:</strong> ${formatDate(data.issueDate)}</div>
                    <div class="confirmation-item"><strong>Annual Premium:</strong> $${data.annualPremium}</div>
                    <div class="confirmation-item"><strong>Comissão Total:</strong> $${data.totalCommission}</div>
                    <div class="confirmation-item"><strong>Categoria do Produto:</strong> ${productCategoryDisplay}</div>
                    <div class="confirmation-item"><strong>Carrier:</strong> ${carrierDisplay}</div>
                </div>
            </div>
        `);
        
        // Seção: Informações do Assegurado
        if (data.insuredType && data.insuredType !== 'proprio') {
            const insuredTypeDisplay = data.insuredType === 'other' ? data.insuredTypeOther : getSelectText('insuredType', data.insuredType);
            
            sections.push(`
                <div class="confirmation-section">
                    <h4><i class="fas fa-user-shield"></i> Informações do Assegurado</h4>
                    <div class="confirmation-grid">
                        <div class="confirmation-item"><strong>Tipo:</strong> ${insuredTypeDisplay}</div>
                        ${data.insuredName ? `<div class="confirmation-item"><strong>Nome:</strong> ${data.insuredName}</div>` : ''}
                        ${data.insuredBirthDate ? `<div class="confirmation-item"><strong>Data de Aniversário:</strong> ${formatDate(data.insuredBirthDate)}</div>` : ''}
                    </div>
                </div>
            `);
        }
        
        return sections.join('');
    }
    
    // Função auxiliar para formatar datas
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }
    
    // Função auxiliar para obter texto de selects
    function getSelectText(selectId, value) {
        const select = document.getElementById(selectId);
        if (!select || !value) return value || '';
        const option = select.querySelector(`option[value="${value}"]`);
        return option ? option.textContent : value;
    }
    
    // Função para coletar dados do formulário de agente manual
    function collectAgentFormData() {
        const data = {};
        
        // Informações do Agente
        data.agentName = document.getElementById('agentName')?.value || '';
        data.agentEmail = document.getElementById('agentEmail')?.value || '';
        data.agentPhone = document.getElementById('agentPhone')?.value || '';
        data.agentStartDate = document.getElementById('agentStartDate')?.value || '';
        data.agentBirthDate = document.getElementById('agentBirthDate')?.value || '';
        data.agentCompensationLevel = document.getElementById('agentCompensationLevel')?.value || '';
        

        
        return data;
    }
    
    // Função para gerar HTML de confirmação do agente
    function generateAgentConfirmationHtml(data) {
        const sections = [];
        
        // Seção: Informações do Agente
        const compensationLevelDisplay = getSelectText('agentCompensationLevel', data.agentCompensationLevel);
        
        sections.push(`
            <div class="confirmation-section">
                <h4><i class="fas fa-user-tie"></i> Informações do Agente</h4>
                <div class="confirmation-grid">
                    <div class="confirmation-item"><strong>Nome:</strong> ${data.agentName}</div>
                    <div class="confirmation-item"><strong>Email:</strong> ${data.agentEmail}</div>
                    <div class="confirmation-item"><strong>Telefone:</strong> ${data.agentPhone}</div>
                    <div class="confirmation-item"><strong>Data de Início:</strong> ${formatDate(data.agentStartDate)}</div>
                    <div class="confirmation-item"><strong>Data de Nascimento:</strong> ${formatDate(data.agentBirthDate)}</div>
                    <div class="confirmation-item"><strong>Nível de Compensação:</strong> ${compensationLevelDisplay}</div>
                </div>
            </div>
        `);
        
        return sections.join('');
    }
    
    // Navegação entre etapas
    nextBtn.addEventListener('click', function() {
        console.log('Botão Próximo clicado - currentStep:', currentStep);
        console.log('selectedImportTypes:', selectedImportTypes);
        
        // Verificar etapa atual
        if (currentStep === 1) {
            goToNextStep();
        } else if (currentStep === 2) {
            // VERIFICAÇÃO EXTRA DE SEGURANÇA - só continuar se realmente estiver na tela correta
            const actuallyInContactForm = singlePolicyStep && singlePolicyStep.style.display !== 'none';
            const actuallyInAgentForm = singleAgentStep && singleAgentStep.style.display !== 'none';
            const actuallyInUploadForm = (policiesStep && policiesStep.style.display !== 'none') || (agentsStep && agentsStep.style.display !== 'none');
            const actuallyInSubStep = (policyTypeStep && policyTypeStep.style.display !== 'none') || (agentTypeStep && agentTypeStep.style.display !== 'none');
            
            // Se não estiver em nenhuma tela válida, resetar tudo
            if (!actuallyInContactForm && !actuallyInAgentForm && !actuallyInUploadForm && !actuallyInSubStep) {
                console.log('ERRO DE ESTADO DETECTADO - Resetando tudo!');
                resetForm();
                return;
            }
            
            // Se estiver em sub-etapa, chamar goToNextStep
            if (actuallyInSubStep) {
                goToNextStep();
                return;
            }
            
            // Determinar baseado nas seleções - SISTEMA ATUALIZADO!
            const hasPolicies = selectedImportTypes.includes('policies');
            const hasAgents = selectedImportTypes.includes('agents');
            
            if (hasPolicies && hasAgents) {
                // AMBOS SELECIONADOS - etapa 2 = upload, validar arquivos
                if (!uploadedFiles.policies) {
                    showErrorModal('Você deve selecionar o arquivo de apólices para prosseguir.');
                    return;
                }
                if (!uploadedFiles.clients) {
                    showErrorModal('Você deve selecionar o arquivo de clientes para prosseguir.');
                    return;
                }
                
                // Se arquivos foram carregados, avançar para etapa de agentes
                policiesStep.style.display = 'none';
                clientsUploadGroup.style.display = 'none';
                agentsStep.style.display = 'block';
                updateStep(3);
            } else if (hasPolicies && !hasAgents) {
                // SÓ APÓLICES - verificar se é formulário manual ou upload
                if (selectedPolicyType === 'single-policy') {
                    // VERIFICAÇÃO EXTRA: só validar se realmente estiver no formulário de contato
                    if (!actuallyInContactForm) {
                        console.log('ERRO: Tentando validar contato mas não está na tela de contato!');
                        resetForm();
                        return;
                    }
                    
                    // FORMULÁRIO MANUAL - validar campos do contato
                    const requiredFields = ['contactName', 'contactPhone', 'contactEmail', 'contactBirthDate', 'contactStreet', 'contactState', 'contactZipCode'];
                    const emptyFields = [];
                    
                    requiredFields.forEach(fieldId => {
                        const field = document.getElementById(fieldId);
                        if (!field || !field.value.trim()) {
                            if (field && field.previousElementSibling) {
                                emptyFields.push(field.previousElementSibling.textContent.replace(' *', ''));
                            }
                        }
                    });
                    
                    if (emptyFields.length > 0) {
                        showErrorModal(`Por favor, preencha os seguintes campos obrigatórios:<br><br>• ${emptyFields.join('<br>• ')}`);
                        return;
                    }
                    
                    // Todos os campos do contato preenchidos, avançar para informações da apólice
                    singlePolicyStep.style.display = 'none';
                    policyInfoStep.style.display = 'block';
                    updateStep(3); // Informações da apólice é etapa 3
                    return;
                } else {
                    // MÚLTIPLAS APÓLICES - etapa 2 = sub-etapa, chamar goToNextStep
                    goToNextStep();
                }
            } else if (hasAgents && !hasPolicies) {
                // SÓ AGENTES - verificar se é formulário manual ou upload
                if (selectedAgentType === 'single-agent') {
                    // VERIFICAÇÃO EXTRA: só validar se realmente estiver no formulário do agente
                    const actuallyInAgentForm = singleAgentStep && singleAgentStep.style.display !== 'none';
                    if (!actuallyInAgentForm) {
                        console.log('ERRO: Tentando validar agente mas não está na tela do agente!');
                        resetForm();
                        return;
                    }
                    
                    // FORMULÁRIO MANUAL - validar campos do agente
                    const requiredAgentFields = ['agentName', 'agentEmail', 'agentPhone', 'agentStartDate', 'agentBirthDate', 'agentCompensationLevel'];
                    const emptyAgentFields = [];
                    
                    requiredAgentFields.forEach(fieldId => {
                        const field = document.getElementById(fieldId);
                        if (!field || !field.value.trim()) {
                            if (field && field.previousElementSibling) {
                                emptyAgentFields.push(field.previousElementSibling.textContent.replace(' *', ''));
                            }
                        }
                    });
                    
                    if (emptyAgentFields.length > 0) {
                        showErrorModal(`Por favor, preencha os seguintes campos obrigatórios:<br><br>• ${emptyAgentFields.join('<br>• ')}`);
                        return;
                    }
                    
                    // Todos os campos do agente preenchidos, avançar para confirmação
                    singleAgentStep.style.display = 'none';
                    prepareConfirmation();
                    confirmationStep.style.display = 'block';
                    nextBtn.style.display = 'none';
                    confirmBtn.style.display = 'flex';
                    updateStep(3); // Confirmação é etapa 3 para agente único
                    return;
                } else {
                    // MÚLTIPLOS AGENTES - etapa 2 = sub-etapa, chamar goToNextStep
                    goToNextStep();
                }
            }
        } else if (currentStep === 3) {
            // Etapa 3 - pode ser informações da apólice ou outras validações
            const hasPolicies = selectedImportTypes.includes('policies');
            const hasAgents = selectedImportTypes.includes('agents');
            
            if (hasPolicies && !hasAgents) {
                // SÓ APÓLICES - verificar se é formulário manual ou upload
                if (selectedPolicyType === 'single-policy') {
                    // FORMULÁRIO MANUAL - validar campos da apólice
                    const requiredPolicyFields = ['policyNumber', 'issueDate', 'annualPremium', 'totalCommission', 'productCategory', 'carrier', 'insuredType'];
                    const emptyPolicyFields = [];
                    
                    requiredPolicyFields.forEach(fieldId => {
                        const field = document.getElementById(fieldId);
                        if (!field.value.trim()) {
                            const label = field.previousElementSibling;
                            emptyPolicyFields.push(label.textContent.replace(' *', ''));
                        }
                    });
                    
                    // Verificar campos condicionais
                    const carrier = document.getElementById('carrier');
                    const carrierOther = document.getElementById('carrierOther');
                    if (carrier.value === 'other' && !carrierOther.value.trim()) {
                        emptyPolicyFields.push('Nome do Carrier');
                    }
                    
                    const insuredType = document.getElementById('insuredType');
                    const insuredName = document.getElementById('insuredName');
                    const insuredBirthDate = document.getElementById('insuredBirthDate');
                    const insuredTypeOther = document.getElementById('insuredTypeOther');
                    
                    if (insuredType.value === 'other' && !insuredTypeOther.value.trim()) {
                        emptyPolicyFields.push('Tipo de Assegurado (especificar)');
                    }
                    
                    if (insuredType.value !== 'proprio' && insuredType.value !== '') {
                        if (!insuredName.value.trim()) {
                            emptyPolicyFields.push('Nome do Assegurado');
                        }
                        if (!insuredBirthDate.value.trim()) {
                            emptyPolicyFields.push('Data de Aniversário do Assegurado');
                        }
                    }
                    
                    if (emptyPolicyFields.length > 0) {
                        showErrorModal(`Por favor, preencha os seguintes campos obrigatórios:<br><br>• ${emptyPolicyFields.join('<br>• ')}`);
                        return;
                    }
                    
                    // Todos os campos preenchidos, avançar para documentos
                    policyInfoStep.style.display = 'none';
                    documentsStep.style.display = 'block';
                    updateStep(4); // Documentos é etapa 4
                    return;
                } else {
                    // MÚLTIPLAS APÓLICES - validar arquivos
                    if (!uploadedFiles.policies) {
                        showErrorModal('Você deve selecionar o arquivo de apólices para prosseguir.');
                        return;
                    }
                    if (!uploadedFiles.clients) {
                        showErrorModal('Você deve selecionar o arquivo de clientes para prosseguir.');
                    return;
                }
                
                // Preparar confirmação
                prepareConfirmation();
                
                // Mostrar etapa de confirmação
                policiesStep.style.display = 'none';
                confirmationStep.style.display = 'block';
                nextBtn.style.display = 'none';
                    confirmBtn.style.display = 'flex';
                    updateStep(4);
                }
            } else if (hasAgents && !hasPolicies) {
                // SÓ AGENTES - etapa 3 = upload, validar arquivos
                if (!uploadedFiles.agents) {
                    showErrorModal('Você deve selecionar o arquivo de agentes para prosseguir.');
                    return;
                }
                
                // Preparar confirmação
                prepareConfirmation();
                
                // Mostrar etapa de confirmação
                agentsStep.style.display = 'none';
                confirmationStep.style.display = 'block';
                nextBtn.style.display = 'none';
                confirmBtn.style.display = 'flex';
                updateStep(4);
            } else if (hasPolicies && hasAgents) {
                // AMBOS - etapa 3 = agentes, validar arquivo
                if (!uploadedFiles.agents) {
                    showErrorModal('Você deve selecionar o arquivo de agentes para prosseguir.');
                    return;
                }
                
                // Preparar confirmação
                prepareConfirmation();
                
                // Mostrar etapa de confirmação
                agentsStep.style.display = 'none';
                confirmationStep.style.display = 'block';
                nextBtn.style.display = 'none';
                confirmBtn.style.display = 'flex';
                updateStep(4);
            }
        } else if (currentStep === 4) {
            // Etapa 4 - documentos do formulário manual (opcionais)
            const hasPolicies = selectedImportTypes.includes('policies');
            const hasAgents = selectedImportTypes.includes('agents');
            
            if (hasPolicies && !hasAgents && selectedPolicyType === 'single-policy') {
                // FORMULÁRIO MANUAL - documentos são opcionais, ir direto para confirmação
                // Preparar dados para confirmação do formulário manual
                prepareConfirmation();
                
                documentsStep.style.display = 'none';
                confirmationStep.style.display = 'block';
                nextBtn.style.display = 'none';
                confirmBtn.style.display = 'flex';
                updateStep(5); // Confirmação é etapa 5
                
                return;
            }
        }
    });
    
    // Voltar para etapa anterior - ATUALIZADO PARA CHECKBOXES!
    prevBtn.addEventListener('click', function() {
        console.log('Botão Anterior clicado!');
        console.log('currentStep:', currentStep);
        console.log('selectedImportTypes:', selectedImportTypes);
        console.log('confirmationStep:', confirmationStep);
        console.log('confirmationStep display:', confirmationStep?.style.display);
        console.log('confirmationStep existe?', !!confirmationStep);
        console.log('confirmationStep display !== none?', confirmationStep?.style.display !== 'none');
        
        if (confirmationStep && confirmationStep.style.display !== 'none') {
            console.log('Detectada etapa de confirmação - voltando para upload');
            console.log('Entrando na lógica de confirmação');
            // Etapa de confirmação (upload de arquivos) - voltar para etapa anterior
            const hasPolicies = selectedImportTypes.includes('policies');
            const hasAgents = selectedImportTypes.includes('agents');
            
            if (hasPolicies && !hasAgents) {
                // SÓ APÓLICES - voltar para upload
                console.log('Voltando para upload de apólices');
                confirmationStep.style.display = 'none';
                policiesStep.style.display = 'block';
                clientsUploadGroup.style.display = 'block';
                nextBtn.style.display = 'flex';
                confirmBtn.style.display = 'none';
                updateStep(3);
            } else if (hasAgents && !hasPolicies) {
                // SÓ AGENTES - voltar para upload
                console.log('Voltando para upload de agentes');
                confirmationStep.style.display = 'none';
                agentsStep.style.display = 'block';
                nextBtn.style.display = 'flex';
                confirmBtn.style.display = 'none';
                updateStep(3);
            } else if (hasPolicies && hasAgents) {
                // AMBOS - voltar para upload de agentes
                console.log('Voltando para upload de agentes (ambos)');
                confirmationStep.style.display = 'none';
                agentsStep.style.display = 'block';
                nextBtn.style.display = 'flex';
                confirmBtn.style.display = 'none';
                updateStep(3);
            }
        } else if (currentStep === 2) {
            // Determinar de onde estamos vindo baseado nas seleções
            const hasPolicies = selectedImportTypes.includes('policies');
            const hasAgents = selectedImportTypes.includes('agents');
            
            if (hasPolicies && hasAgents) {
                // AMBOS SELECIONADOS - etapa 2 = upload, voltar para inicial
                policiesStep.style.display = 'none';
                clientsUploadGroup.style.display = 'none';
                importTypeGroup.parentElement.style.display = 'block';
                resetUploads('policies');
                resetUploads('clients');
                selectedImportTypes = [];
                selectedPolicyType = null;
                checkboxOptions.forEach(checkbox => {
                    checkbox.checked = false;
                });
            initSingleStepProgressBar();
            updateStep(1);

            } else if (hasPolicies) {
                // SÓ APÓLICES - verificar se estamos no formulário manual ou na sub-etapa
                const isInPolicyForm = singlePolicyStep && singlePolicyStep.style.display !== 'none';
                const isInPolicyTypeStep = policyTypeStep && policyTypeStep.style.display !== 'none';
                
                if (isInPolicyForm) {
                    // Estamos no formulário de contato da apólice única, voltar para sub-etapa
                    singlePolicyStep.style.display = 'none';
                    policyTypeStep.style.display = 'block';
                    
                    // Limpar dados do formulário de contato
                    const contactForm = document.querySelectorAll('#singlePolicyStep input');
                    contactForm.forEach(input => {
                        input.value = '';
                    });
                    
                    updateStep(2); // Manter na etapa 2 (sub-etapa de seleção)

                } else if (isInPolicyTypeStep) {
                    // Estamos na sub-etapa de seleção, voltar para inicial
                    policyTypeStep.style.display = 'none';
                    importTypeGroup.parentElement.style.display = 'block';
                    
                    // Reset completo de todas as variáveis de estado
                    selectedPolicyType = null;
                    selectedImportTypes = [];
                    selectedAgentType = null;
                    
                    // Limpar todas as seleções
                    checkboxOptions.forEach(checkbox => {
                        checkbox.checked = false;
                    });
                    policyTypeOptions.forEach(radio => {
                        radio.checked = false;
                    });
                    agentTypeOptions.forEach(radio => {
                        radio.checked = false;
                    });
                    
                    // Resetar uploads
                    resetUploads('all');
                    
                                        // Resetar a barra de progresso
            initSingleStepProgressBar();
                    updateStep(1);
                    
                    // Forçar reset completo do estado
                    currentStep = 1;

                }
            } else if (hasAgents) {
                // SÓ AGENTES - verificar se estamos no formulário manual ou na sub-etapa
                const isInAgentForm = singleAgentStep && singleAgentStep.style.display !== 'none';
                const isInAgentTypeStep = agentTypeStep && agentTypeStep.style.display !== 'none';
                
                if (isInAgentForm) {
                    // Estamos no formulário do agente único, voltar para sub-etapa
                    singleAgentStep.style.display = 'none';
                    agentTypeStep.style.display = 'block';
                    
                    // Limpar dados do formulário do agente
                    const agentForm = document.querySelectorAll('#singleAgentStep input, #singleAgentStep select');
                    agentForm.forEach(input => {
                        input.value = '';
                    });
                    
                    updateStep(2); // Manter na etapa 2 (sub-etapa de seleção)
                } else if (isInAgentTypeStep) {
                    // Estamos na sub-etapa de seleção, voltar para inicial
                    agentTypeStep.style.display = 'none';
                    importTypeGroup.parentElement.style.display = 'block';
                    
                    // Reset completo de todas as variáveis de estado
                    selectedAgentType = null;
                    selectedImportTypes = [];
                    selectedPolicyType = null;
                    
                    // Limpar todas as seleções
                    checkboxOptions.forEach(checkbox => {
                        checkbox.checked = false;
                    });
                    agentTypeOptions.forEach(radio => {
                        radio.checked = false;
                    });
                    policyTypeOptions.forEach(radio => {
                        radio.checked = false;
                    });
                    
                    // Resetar uploads
                    resetUploads('all');
                    
                    // Resetar a barra de progresso
                    initSingleStepProgressBar();
            updateStep(1);
                    
                    // Forçar reset completo do estado
                    currentStep = 1;
                }
            }
        } else if (currentStep === 3) {
            // Determinar de onde estamos vindo baseado nas seleções
            const hasPolicies = selectedImportTypes.includes('policies');
            const hasAgents = selectedImportTypes.includes('agents');
            
            if (hasPolicies && !hasAgents) {
                // SÓ APÓLICES - verificar se é formulário manual ou upload
                if (selectedPolicyType === 'single-policy') {
                    // FORMULÁRIO MANUAL - Vem das informações da apólice, voltar para informações do contato
                    policyInfoStep.style.display = 'none';
                    singlePolicyStep.style.display = 'block';
                updateStep(2);
                } else {
                    // UPLOAD - Vem do upload, voltar para sub-etapa de apólices
                    policiesStep.style.display = 'none';
                    clientsUploadGroup.style.display = 'none';
                    policyTypeStep.style.display = 'block';
                    resetUploads('policies');
                    resetUploads('clients');
                updateStep(2);
                }
            } else if (hasAgents && !hasPolicies) {
                // SÓ AGENTES - etapa 3 = upload, voltar para sub-etapa de agentes
                agentsStep.style.display = 'none';
                agentTypeStep.style.display = 'block';
                resetUploads('agents');
                updateStep(2);
            } else if (hasPolicies && hasAgents) {
                // AMBOS SELECIONADOS - etapa 3 = upload de agentes, voltar para upload de apólices
                agentsStep.style.display = 'none';
                policiesStep.style.display = 'block';
                clientsUploadGroup.style.display = 'block';
                updateStep(2);
            }
        } else if (currentStep === 4) {
            // Etapa 4 - documentos do formulário manual, voltar para informações da apólice
            const hasPolicies = selectedImportTypes.includes('policies');
            const hasAgents = selectedImportTypes.includes('agents');
            
            if (hasPolicies && !hasAgents && selectedPolicyType === 'single-policy') {
                // Vem dos documentos, voltar para informações da apólice
                documentsStep.style.display = 'none';
                policyInfoStep.style.display = 'block';
                
                // Resetar documentos ao voltar
                const documentInputs = document.querySelectorAll('#policyDocument, #idDocument, #insuredIdDocument, #otherDocuments');
                documentInputs.forEach(input => {
                    input.value = '';
                });
                
                // Limpar informações dos documentos
                const documentInfoElements = document.querySelectorAll('#policyDocumentInfo, #idDocumentInfo, #insuredIdDocumentInfo, #otherDocumentsInfo');
                documentInfoElements.forEach(element => {
                    if (element) {
                        element.innerHTML = '';
                        element.classList.remove('show');
                    }
                });
                
                // Limpar status dos documentos
                const documentStatusElements = document.querySelectorAll('#policyDocumentStatus, #idDocumentStatus, #insuredIdDocumentStatus, #otherDocumentsStatus');
                documentStatusElements.forEach(element => {
                    if (element) {
                        element.innerHTML = '';
                        element.className = 'status';
                    }
                });
                
                // Resetar texto das áreas de upload de documentos
                const documentAreas = document.querySelectorAll('#policyDocumentArea .upload-text, #idDocumentArea .upload-text, #insuredIdDocumentArea .upload-text, #otherDocumentsArea .upload-text');
                documentAreas.forEach(element => {
                    if (element) {
                        if (element.closest('#otherDocumentsArea')) {
                            element.textContent = 'Inserir outros documentos';
                        } else if (element.closest('#policyDocumentArea')) {
                            element.textContent = 'Inserir arquivo da apólice';
                        } else if (element.closest('#idDocumentArea')) {
                            element.textContent = 'Inserir ID do contratante';
                        } else if (element.closest('#insuredIdDocumentArea')) {
                            element.textContent = 'Inserir ID do assegurado';
                        }
                    }
                });
                
                updateStep(3);
            }
        } else if (currentStep === 5) {
            // Etapa 5 - confirmação do formulário manual, voltar para documentos
            const hasPolicies = selectedImportTypes.includes('policies');
            const hasAgents = selectedImportTypes.includes('agents');
            
            if (hasPolicies && !hasAgents && selectedPolicyType === 'single-policy') {
                // Vem da confirmação, voltar para documentos
                confirmationStep.style.display = 'none';
                documentsStep.style.display = 'block';
                nextBtn.style.display = 'flex';
                confirmBtn.style.display = 'none';
                updateStep(4);
            }

        }
        
        console.log('Fim da função prevBtn - nenhuma condição foi executada');
    });
    
    // Função para obter parâmetros da URL
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Função para converter arquivo para Base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Verificar tamanho do arquivo Base64
                const base64String = reader.result;
                const sizeInMB = (base64String.length * 0.75) / (1024*1024);
                console.log(`Arquivo ${file.name} convertido para Base64: ${sizeInMB.toFixed(2)}MB`);
                
                // Remover o prefixo data:tipo;base64, para obter apenas os dados Base64
                const base64Data = base64String.split(',')[1];
                
                // Retornar apenas a parte Base64 pura
                resolve(base64Data);
            };
            reader.onerror = error => reject(error);
        });
    }
    
    // Função auxiliar para converter Blob para Base64
    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => {
                // Remover o prefixo data:tipo;base64, para obter apenas os dados Base64
                const base64String = reader.result;
                const base64Data = base64String.split(',')[1];
                
                // Retornar apenas a parte Base64 pura
                resolve(base64Data);
            };
            reader.onerror = error => reject(error);
        });
    }
    
    // Função auxiliar para ler um arquivo como texto
    const readFileAsText = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    };

    // Função para verificar número de colunas nos arquivos CSV
    function validateColumnCount(csvText, expectedColumnCount, fileType) {
        if (!csvText) return false;
        
        // Pegar a primeira linha (cabeçalhos) e contar as colunas
        const firstLine = csvText.split('\n')[0];
        const columns = firstLine.split(',');
        
        // Número esperado de colunas por tipo de arquivo
        const expectedColumns = {
            'policies': 16,
            'clients': 15,
            'agents': 11
        };
        
        const expectedCount = expectedColumns[fileType] || expectedColumnCount;
        return columns.length === expectedCount;
    }
    
    // Função para verificar o arquivo CSV
    async function validateCSVFile(file, expectedColumnCount, fileType) {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve({ valid: false, message: 'Arquivo não encontrado.' });
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const csvText = e.target.result;
                const isValid = validateColumnCount(csvText, expectedColumnCount, fileType);
                
                if (isValid) {
                    resolve({ valid: true });
                } else {
                    const expectedColumns = {
                        'policies': 16,
                        'clients': 15,
                        'agents': 10
                    };
                    const expectedCount = expectedColumns[fileType] || expectedColumnCount;
                    const message = `O arquivo deve conter exatamente ${expectedCount} colunas. Por favor, verifique o arquivo.`;
                    resolve({ valid: false, message: message });
                }
            };
            
            reader.onerror = function() {
                resolve({ valid: false, message: 'Erro ao ler o arquivo.' });
            };
            
            reader.readAsText(file);
        });
    }

    // Função para enviar dados para o webhook
    async function sendWebhook(files) {
        try {
            // Obter o client_location_id da URL
            const locationId = getUrlParameter('client_location_id') || '';
            
            console.log('Preparando arquivos para envio via webhook Make...');
            console.log('Codificando arquivos em Base64 para envio...');
            
            // Determinar URL do webhook baseado no tipo de envio
            let webhookUrl;
            
            // Usar webhook do Railway através do proxy CORS
            const originalWebhookUrl = 'https://primary-production-38295.up.railway.app/webhook/82d3c6dc-01e4-46ae-85f4-42784c7c0054';
            webhookUrl = `https://cors-anywhere-production-7ede.up.railway.app/${originalWebhookUrl}`;
            
            // Verificar se o URL começa com https://
            if (!webhookUrl.startsWith('https://')) {
                console.error('Erro: O webhook deve usar uma conexão segura (HTTPS)');
                return false;
            }
            
            // Se for formulário manual, enviar dados do formulário
            if (selectedPolicyType === 'single-policy') {
                console.log('Enviando dados do formulário manual...');
                const formData = collectFormData();
                
                const manualData = {
                    location_id: locationId,
                    type: 'single-policy',
                    webhook_type: 'manual_form',
                    contact_info: {
                        name: formData.contactName,
                        phone: formData.contactPhone,
                        email: formData.contactEmail,
                        birth_date: formData.contactBirthDate,
                        address: {
                            street: formData.contactStreet,
                            state: formData.contactState,
                            zip_code: formData.contactZipCode
                        }
                    },
                    policy_info: {
                        policy_number: formData.policyNumber,
                        issue_date: formData.issueDate,
                        annual_premium: formData.annualPremium,
                        total_commission: formData.totalCommission,
                        product_category: formData.productCategory,
                        carrier: formData.carrier === 'other' ? formData.carrierOther : formData.carrier
                    },
                    insured_info: {
                        type: formData.insuredType === 'other' ? formData.insuredTypeOther : formData.insuredType,
                        name: formData.insuredName || null,
                        birth_date: formData.insuredBirthDate || null
                    },
                    documents: {}
                };
                
                // Processar documentos/fotos opcionais
                if (formData.documents.policyDocument) {
                    console.log('Processando foto da apólice...');
                    const policyBase64 = await fileToBase64(formData.documents.policyDocument);
                    manualData.documents.policy_photo = {
                        name: formData.documents.policyDocument.name,
                        content: policyBase64,
                        type: formData.documents.policyDocument.type,
                        size: formData.documents.policyDocument.size
                    };
                }
                
                if (formData.documents.idDocument) {
                    console.log('Processando foto do ID...');
                    const idBase64 = await fileToBase64(formData.documents.idDocument);
                    manualData.documents.id_photo = {
                        name: formData.documents.idDocument.name,
                        content: idBase64,
                        type: formData.documents.idDocument.type,
                        size: formData.documents.idDocument.size
                    };
                }
                
                if (formData.documents.insuredIdDocument) {
                    console.log('Processando foto do ID do assegurado...');
                    const insuredIdBase64 = await fileToBase64(formData.documents.insuredIdDocument);
                    manualData.documents.insured_id_photo = {
                        name: formData.documents.insuredIdDocument.name,
                        content: insuredIdBase64,
                        type: formData.documents.insuredIdDocument.type,
                        size: formData.documents.insuredIdDocument.size
                    };
                }
                
                // Processar outras fotos (array)
                if (formData.documents.otherDocuments.length > 0) {
                    console.log(`Processando ${formData.documents.otherDocuments.length} outras fotos...`);
                    manualData.documents.other_photos = [];
                    
                    for (let i = 0; i < formData.documents.otherDocuments.length; i++) {
                        const otherFile = formData.documents.otherDocuments[i];
                        const otherBase64 = await fileToBase64(otherFile);
                        manualData.documents.other_photos.push({
                            name: otherFile.name,
                            content: otherBase64,
                            type: otherFile.type,
                            size: otherFile.size
                        });
                    }
                }
                
                console.log('Dados do formulário preparados (com fotos):', {
                    ...manualData,
                    documents: Object.keys(manualData.documents).reduce((acc, key) => {
                        if (Array.isArray(manualData.documents[key])) {
                            acc[key] = `[${manualData.documents[key].length} fotos]`;
                        } else if (manualData.documents[key] && manualData.documents[key].content) {
                            acc[key] = `[Base64: ${manualData.documents[key].content.length} chars]`;
                        }
                        return acc;
                    }, {})
                });
                
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(manualData)
                });
                
                console.log('Resposta do webhook manual:', response.status);
                
                if (response.ok) {
                    console.log('Formulário manual enviado com sucesso (com fotos)');
                    return true;
                } else {
                    const errorText = await response.text();
                    console.error('Erro ao enviar formulário manual:', response.status, errorText);
                    return false;
                }
            } else if (selectedAgentType === 'single-agent') {
                // FORMULÁRIO MANUAL DE AGENTE - webhook específico
                console.log('Enviando dados do formulário manual de agente...');
                const formData = collectAgentFormData();
                
                const manualData = {
                    location_id: locationId,
                    type: 'single-agent',
                    webhook_type: 'manual_form',
                    agent_info: {
                        name: formData.agentName,
                        email: formData.agentEmail,
                        phone: formData.agentPhone,
                        start_date: formData.agentStartDate,
                        birth_date: formData.agentBirthDate,
                        compensation_level: formData.agentCompensationLevel
                    }
                };
                
                console.log('Dados do formulário de agente preparados:', manualData);
                
                // Tentar diferentes abordagens para contornar CORS
                let response;
                try {
                    // Primeira tentativa: requisição normal
                    response = await fetch(webhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(manualData)
                    });
                } catch (corsError) {
                    console.log('Erro CORS detectado, tentando proxy...');
                    
                    // Segunda tentativa: usar proxy CORS
                    const proxyUrl = `https://cors-anywhere.herokuapp.com/${webhookUrl}`;
                    response = await fetch(proxyUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Origin': window.location.origin
                        },
                        body: JSON.stringify(manualData)
                    });
                }
                
                console.log('Resposta do webhook manual de agente:', response.status);
                
                if (response.ok) {
                    console.log('Formulário manual de agente enviado com sucesso');
                    return true;
                } else {
                    const errorText = await response.text();
                    console.error('Erro ao enviar formulário manual de agente:', response.status, errorText);
                    return false;
                }
            }

            // Ler o conteúdo dos arquivos como texto, quando aplicável (apenas para upload de arquivos)
            let policiesText = null;
            let clientsText = null;
            
            if (files.policies && files.policies.type === 'text/csv') {
                try {
                    policiesText = await readFileAsText(files.policies);
                    console.log("Conteúdo texto do arquivo de políticas obtido");
                } catch (e) {
                    console.error("Erro ao ler arquivo de políticas como texto:", e);
                }
            }
            
            if (files.clients && files.clients.type === 'text/csv') {
                try {
                    clientsText = await readFileAsText(files.clients);
                    console.log("Conteúdo texto do arquivo de clientes obtido");
                } catch (e) {
                    console.error("Erro ao ler arquivo de clientes como texto:", e);
                }
            }
            
            // Converter arquivos para Base64
            const requestData = {
                location_id: locationId,
                correct_agent: selectedUplineAgent || '',
                webhook_type: 'file_upload',
                parse_options: {
                    has_headers: true,
                    delimiter: ',',
                    first_row_as_header: true
                }
            };
            
            // Definir cabeçalhos (apenas para informação, sem modificar o CSV)
            const policiesHeaders = [
                "Number", "Status", "Clients", "Owner's Email", "Owner's Phone",
                "Carrier", "Product", "Product Type", "Product Category", "State",
                "Annual Premium", "Submitted Date", "Issued Date", "Effective Date",
                "Agents", "Upline Agents"
            ];
            
            const clientsHeaders = [
                "Name", "Type", "Status", "Latest Policy", "Latest Policy Status",
                "Policies", "Products", "Product Type", "Product Category",
                "Email", "Phone", "Address", "Gender", "Birth Date", "Start Date"
            ];
            
            const agentsHeaders = [
                "Name", "Email", "Address", "Phone", "Status",
                "Upline Agent", "Compensation Level", "Coat Color", "Birth Date", "Start Date"
            ];
            
            // Adicionar arrays de cabeçalhos
            requestData.policies_headers = policiesHeaders;
            requestData.clients_headers = clientsHeaders;
            requestData.agents_headers = agentsHeaders;
            
            // Adicionar conteúdo de texto quando disponível
            if (policiesText) {
                requestData.policies_csv_text = policiesText;
            }
            
            if (clientsText) {
                requestData.clients_csv_text = clientsText;
            }
            
            if (files.agentsCSV) {
                requestData.agents_csv_text = files.agentsCSV;
            }
            
            // Adicionar arquivos como Base64
            if (files.policies) {
                const policiesBase64 = await fileToBase64(files.policies);
                requestData.police_file = {
                    name: files.policies.name,
                    content: policiesBase64,
                    type: files.policies.type || 'text/csv',
                    mime_type: files.policies.type || 'text/csv',
                    is_base64: true,
                    extension: getFileExtension(files.policies.name),
                    has_headers: true,
                    csv_options: {
                        delimiter: ',',
                        first_row_as_header: true
                    }
                };
                console.log(`Arquivo de políticas codificado: ${files.policies.name}`);
            }
            
            if (files.clients) {
                const clientsBase64 = await fileToBase64(files.clients);
                requestData.cliente_file = {
                    name: files.clients.name,
                    content: clientsBase64,
                    type: files.clients.type || 'text/csv',
                    mime_type: files.clients.type || 'text/csv',
                    is_base64: true,
                    extension: getFileExtension(files.clients.name),
                    has_headers: true,
                    csv_options: {
                        delimiter: ',',
                        first_row_as_header: true
                    }
                };
                console.log(`Arquivo de clientes codificado: ${files.clients.name}`);
            }
            
            if (files.agents) {
                const agentsBase64 = await fileToBase64(files.agents);
                requestData.agent_file = {
                    name: files.agents.name,
                    content: agentsBase64,
                    type: files.agents.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    mime_type: files.agents.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    is_base64: true,
                    extension: getFileExtension(files.agents.name)
                };
                console.log(`Arquivo de agentes codificado: ${files.agents.name}`);
                
                // Adicionar os dados CSV do agente, se disponível
                if (files.agentsCSV) {
                    // Criar um Blob e converter para Base64
                    const csvBlob = new Blob([files.agentsCSV], { type: 'text/csv;charset=utf-8' });
                    const csvBase64 = await blobToBase64(csvBlob);
                    
                    requestData.agent_csv = {
                        name: files.agents.name.replace(/\.[^/.]+$/, ".csv"),
                        content: csvBase64,
                        type: 'text/csv',
                        mime_type: 'text/csv;charset=utf-8',
                        is_base64: true,
                        extension: 'csv',
                        has_headers: true,
                        csv_options: {
                            delimiter: ',',
                            first_row_as_header: true
                        }
                    };
                    console.log(`CSV de agentes codificado: ${files.agents.name.replace(/\.[^/.]+$/, ".csv")}`);
                }
            }
            
            console.log('Enviando dados para o webhook Make via JSON/Base64...');
            
            // Log para diagnóstico - mostra a estrutura do objeto enviado (sem os conteúdos reais do Base64)
            const debugData = JSON.parse(JSON.stringify(requestData));
            if (debugData.police_file && debugData.police_file.content) {
                debugData.police_file.content = `[Base64 String - ${debugData.police_file.content.length} chars]`;
            }
            if (debugData.cliente_file && debugData.cliente_file.content) {
                debugData.cliente_file.content = `[Base64 String - ${debugData.cliente_file.content.length} chars]`;
            }
            if (debugData.agent_file && debugData.agent_file.content) {
                debugData.agent_file.content = `[Base64 String - ${debugData.agent_file.content.length} chars]`;
            }
            if (debugData.agent_csv && debugData.agent_csv.content) {
                debugData.agent_csv.content = `[Base64 String - ${debugData.agent_csv.content.length} chars]`;
            }
            
            // Mostrar partes iniciais dos conteúdos CSV e headers
            if (debugData.policies_csv_text) {
                const preview = debugData.policies_csv_text.substring(0, 100) + '...';
                debugData.policies_csv_text = `[CSV Text: ${preview}]`;
                console.log(`Cabeçalhos de Políticas: ${JSON.stringify(debugData.policies_headers)}`);
            }
            if (debugData.clients_csv_text) {
                const preview = debugData.clients_csv_text.substring(0, 100) + '...';
                debugData.clients_csv_text = `[CSV Text: ${preview}]`;
                console.log(`Cabeçalhos de Clientes: ${JSON.stringify(debugData.clients_headers)}`);
            }
            if (debugData.agent_csv_content) {
                const preview = debugData.agent_csv_content.substring(0, 100) + '...';
                debugData.agent_csv_content = `[CSV Text: ${preview}]`;
                console.log(`Cabeçalhos de Agentes: ${JSON.stringify(debugData.agents_headers)}`);
            }
            
            console.log('Estrutura dos dados enviados:', debugData);
            
            const jsonResponse = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            console.log('Resposta do webhook Make:', jsonResponse.status);
            
            if (jsonResponse.ok) {
                console.log('Webhook enviado com sucesso para o Make');
                return true;
            }
            
            // Se falhar, tentar com FormData como fallback
            console.log('Método JSON falhou, tentando com FormData...');
            
            // Criar um objeto FormData para envio de arquivos
            const formData = new FormData();
            
            // Adicionar o location_id
            formData.append('location_id', locationId);
            
            // Adicionar os arquivos com os nomes esperados pelo webhook
            if (files.policies) {
                formData.append('police_file', files.policies, files.policies.name);
                console.log(`Adicionando arquivo de políticas: ${files.policies.name} (${(files.policies.size/1024).toFixed(2)} KB)`);
            }
            
            if (files.clients) {
                formData.append('cliente_file', files.clients, files.clients.name);
                console.log(`Adicionando arquivo de clientes: ${files.clients.name} (${(files.clients.size/1024).toFixed(2)} KB)`);
            }
            
            if (files.agents) {
                formData.append('agent_file', files.agents, files.agents.name);
                console.log(`Adicionando arquivo de agentes: ${files.agents.name} (${(files.agents.size/1024).toFixed(2)} KB)`);
                
                // Se temos o CSV convertido, adicionar como um blob separado
                if (files.agentsCSV) {
                    const csvBlob = new Blob([files.agentsCSV], { type: 'text/csv' });
                    formData.append('agent_csv_file', csvBlob, files.agents.name.replace(/\.[^/.]+$/, ".csv"));
                    console.log(`Adicionando CSV convertido: ${files.agents.name.replace(/\.[^/.]+$/, ".csv")} (${(csvBlob.size/1024).toFixed(2)} KB)`);
                }
            }
            
            console.log('Enviando arquivos para o webhook via FormData...');
            
            // Enviar os arquivos diretamente via FormData (multipart/form-data)
            const response = await fetch(webhookUrl, {
                method: 'POST',
                // Não definimos o Content-Type aqui, pois o navegador o define automaticamente para FormData
                body: formData
            });
            
            console.log('Resposta do webhook (FormData):', response.status);
            
            if (response.ok) {
                console.log('Webhook enviado com sucesso via FormData');
                return true;
            }
            
            const errorText = await response.text();
            console.error('Erro final do webhook:', response.status, errorText);
            return false;
            
        } catch (error) {
            console.error('Erro ao enviar webhook:', error);
            return false;
        }
    }
    
    // Função para obter a extensão de um arquivo
    function getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }
    
    // Botão de confirmação final
    confirmBtn.addEventListener('click', async function() {
        console.log('Botão Confirmar clicado!');
        console.log('selectedPolicyType:', selectedPolicyType);
        console.log('selectedAgentType:', selectedAgentType);
        console.log('uploadedFiles:', uploadedFiles);
        
        // Simular envio com um breve atraso para feedback visual
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        confirmBtn.disabled = true;
        
        // Verificar número de colunas nos arquivos antes de enviar
        let validationErrors = [];
        
        // SÓ validar arquivos se NÃO for formulário manual
        if (selectedPolicyType !== 'single-policy' && selectedAgentType !== 'single-agent') {
            console.log('Validando arquivos de upload...');
            
            // Validar Policies (16 colunas)
            if (uploadedFiles.policies) {
                const policiesValidation = await validateCSVFile(uploadedFiles.policies, 16, 'policies');
                if (!policiesValidation.valid) {
                    validationErrors.push(`Arquivo de Apólices`);
                }
            }
            
            // Validar Clients (15 colunas)
            if (uploadedFiles.clients) {
                const clientsValidation = await validateCSVFile(uploadedFiles.clients, 15, 'clients');
                if (!clientsValidation.valid) {
                    validationErrors.push(`Arquivo de Clientes`);
                }
            }
            
            // Validar Agents (11 colunas)
            if (uploadedFiles.agents && uploadedFiles.agentsCSV) {
                // Para agentes, validamos o CSV convertido
                const isValid = validateColumnCount(uploadedFiles.agentsCSV, 11, 'agents');
                if (!isValid) {
                    validationErrors.push('Arquivo de Agentes');
                }
            }
        } else {
            console.log('Formulário manual detectado - pulando validação de arquivos');
        }
        
        // Se houver erros de validação, mostrar mensagem e não prosseguir
        if (validationErrors.length > 0) {
            let errorMessage = '';
            
            errorMessage += '<p style="margin: 5px 0 15px; display: flex; align-items: center;"><i class="fas fa-exclamation-triangle" style="color: #e74c3c; margin-right: 8px;"></i> <span style="color: #e74c3c; font-weight: 600;">Ops! Encontramos um problema com seus arquivos</span></p>';
            
            errorMessage += '<p style="margin: 0 0 10px;">Não foi possível processar os seguintes arquivos:</p>';
            
            errorMessage += '<ul class="validation-list" style="margin: 0 0 15px; list-style-type: none;">';
            validationErrors.forEach(error => {
                errorMessage += `<li style="padding-left: 8px; position: relative;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #e74c3c; position: absolute; left: -8px; top: 8px; border-radius: 50%;"></span>
                    ${error}
                </li>`;
            });
            errorMessage += '</ul>';
            
            errorMessage += '<div class="validation-help" style="margin-bottom: 0;">';
            errorMessage += '<p style="margin: 0 0 8px;"><strong>Possíveis causas:</strong></p>';
            errorMessage += '<ul style="list-style-type: none; padding-left: 0; margin: 0 0 10px;">';
            errorMessage += '<li style="margin-bottom: 5px; display: flex; align-items: center;"><span style="display: inline-block; width: 6px; height: 6px; background-color: #2196F3; margin-right: 10px; border-radius: 50%;"></span>Ausência de colunas obrigatórias no arquivo</li>';
            errorMessage += '<li style="margin-bottom: 5px; display: flex; align-items: center;"><span style="display: inline-block; width: 6px; height: 6px; background-color: #2196F3; margin-right: 10px; border-radius: 50%;"></span>Os arquivos foram trocados (ex: colocou clientes no campo de apólices)</li>';
            errorMessage += '</ul>';
            
            // Destaque especial para a dica sobre artigos úteis
            errorMessage += '<div class="help-tip-highlight">';
            errorMessage += '<i class="fas fa-lightbulb"></i> Para mais orientações, confira os vídeos em <a href="#" onclick="document.getElementById(\'modalOverlay\').classList.remove(\'active\'); return false;">"Artigos Úteis Para Você"</a> na lateral da página.';
            errorMessage += '</div>';
            
            errorMessage += '</div>';
            
            showErrorModal(errorMessage);
            
            // Restaurar o botão
            confirmBtn.innerHTML = '<i class="fas fa-upload"></i> Confirmar e Enviar';
            confirmBtn.disabled = false;
            return;
        }
        
        // Se todos os arquivos foram validados, prosseguir com o envio
        console.log('Chamando sendWebhook...');
        const webhookSuccess = await sendWebhook(uploadedFiles);
        console.log('Resultado do webhook:', webhookSuccess);
        
        // Processar a submissão final dos arquivos
        console.log('Dados importados:', uploadedFiles);
        
        // Mostrar modal de sucesso ou erro baseado na resposta do webhook
        if (webhookSuccess) {
            // Verificar se o tamanho de algum arquivo excede o limite
            let mensagemAdicional = '';
            const MAX_SIZE_MB = 5;
            let temArquivosGrandes = false;
            
            // Verificar tamanhos dos arquivos
            if (uploadedFiles.policies && uploadedFiles.policies.size > MAX_SIZE_MB * 1024 * 1024) {
                temArquivosGrandes = true;
            } else if (uploadedFiles.clients && uploadedFiles.clients.size > MAX_SIZE_MB * 1024 * 1024) {
                temArquivosGrandes = true;
            } else if (uploadedFiles.agents && uploadedFiles.agents.size > MAX_SIZE_MB * 1024 * 1024) {
                temArquivosGrandes = true;
            }
            
            if (temArquivosGrandes) {
                mensagemAdicional = '<br><br><strong>Atenção:</strong> Alguns arquivos são muito grandes. ' +
                                   'Os dados foram enviados, mas você pode precisar enviar os arquivos originais por e-mail para garantir o processamento completo.';
            }
            
            // Verificar se o agente foi enviado com CSV
            // Removido mensagem sobre conversão automática
            
            showSuccessModal('Importação concluída com sucesso!' + mensagemAdicional);
        } else {
            showErrorModal('Ocorreu um erro ao processar os arquivos. Por favor, tente novamente ou entre em contato com o suporte.');
        }
        
        // Resetar o formulário após o envio
        resetForm();
        
        // Restaurar o botão
        confirmBtn.innerHTML = '<i class="fas fa-upload"></i> Confirmar e Enviar';
        confirmBtn.disabled = false;
    });
    
    // Inicializar a barra de progresso com apenas o primeiro passo
    initSingleStepProgressBar();
    
    // Lógica para campos condicionais do formulário manual
    setupConditionalFields();

    // Configurar campos condicionais do formulário manual
    function setupConditionalFields() {
        // Carrier - mostrar campo "outro" quando selecionado
        const carrier = document.getElementById('carrier');
        const carrierOther = document.getElementById('carrierOther');
        
        if (carrier && carrierOther) {
            carrier.addEventListener('change', function() {
                if (this.value === 'other') {
                    carrierOther.style.display = 'block';
                    carrierOther.setAttribute('required', 'required');
                } else {
                    carrierOther.style.display = 'none';
                    carrierOther.removeAttribute('required');
                    carrierOther.value = '';
                }
            });
        }
        
        // Tipo de Assegurado - mostrar campos adicionais quando não for "próprio"
        const insuredType = document.getElementById('insuredType');
        const insuredTypeOther = document.getElementById('insuredTypeOther');
        const additionalInsuredFields = document.getElementById('additionalInsuredFields');
        const insuredIdGroup = document.getElementById('insuredIdGroup');
        const insuredName = document.getElementById('insuredName');
        const insuredBirthDate = document.getElementById('insuredBirthDate');
        const insuredIdDocument = document.getElementById('insuredIdDocument');
        
        if (insuredType && additionalInsuredFields) {
            insuredType.addEventListener('change', function() {
                if (this.value === 'other') {
                    insuredTypeOther.style.display = 'block';
                    insuredTypeOther.setAttribute('required', 'required');
                } else {
                    insuredTypeOther.style.display = 'none';
                    insuredTypeOther.removeAttribute('required');
                    insuredTypeOther.value = '';
                }
                
                if (this.value !== 'proprio' && this.value !== '') {
                    // Mostrar campos adicionais do assegurado
                    additionalInsuredFields.style.display = 'block';
                    insuredIdGroup.style.display = 'block';
                    insuredName.setAttribute('required', 'required');
                    insuredBirthDate.setAttribute('required', 'required');
                    // insuredIdDocument.setAttribute('required', 'required'); // Removido - documentos são opcionais
                } else {
                    // Ocultar campos adicionais
                    additionalInsuredFields.style.display = 'none';
                    insuredIdGroup.style.display = 'none';
                    insuredName.removeAttribute('required');
                    insuredBirthDate.removeAttribute('required');
                    // insuredIdDocument.removeAttribute('required'); // Já é opcional
                    insuredName.value = '';
                    insuredBirthDate.value = '';
                }
            });
        }
    }

    // Configurar funcionalidade de arrastar e soltar para áreas de upload
    function setupDragAndDrop() {
        // Configurar cada área de upload
        setupDragAndDropArea(policiesUploadArea, policiesUpload);
        setupDragAndDropArea(clientsUploadArea, clientsUpload);
        setupDragAndDropArea(agentsUploadArea, agentsUpload);
        
        // Configurar drag and drop para documentos do formulário manual
        const policyDocumentArea = document.getElementById('policyDocumentArea');
        const idDocumentArea = document.getElementById('idDocumentArea');
        const insuredIdDocumentArea = document.getElementById('insuredIdDocumentArea');
        const otherDocumentsArea = document.getElementById('otherDocumentsArea');
        
        if (policyDocumentArea) {
            setupDragAndDropArea(policyDocumentArea, document.getElementById('policyDocument'));
        }
        if (idDocumentArea) {
            setupDragAndDropArea(idDocumentArea, document.getElementById('idDocument'));
        }
        if (insuredIdDocumentArea) {
            setupDragAndDropArea(insuredIdDocumentArea, document.getElementById('insuredIdDocument'));
        }
        if (otherDocumentsArea) {
            setupDragAndDropArea(otherDocumentsArea, document.getElementById('otherDocuments'));
        }
        
        function setupDragAndDropArea(dropArea, fileInput) {
            // Prevenir comportamento padrão para eventos de arrastar
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            // Adicionar/remover classe de destaque durante o arrasto
            ['dragenter', 'dragover'].forEach(eventName => {
                dropArea.addEventListener(eventName, highlight, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, unhighlight, false);
            });
            
            function highlight() {
                dropArea.classList.add('drag-highlight');
            }
            
            function unhighlight() {
                dropArea.classList.remove('drag-highlight');
            }
            
            // Processar o arquivo quando solto na área
            dropArea.addEventListener('drop', handleDrop, false);
            
            function handleDrop(e) {
                if (!e.dataTransfer.files || !e.dataTransfer.files[0]) return;
                
                const file = e.dataTransfer.files[0];
                
                // Verificar a extensão do arquivo com base nas restrições do input
                const allowedExtensions = fileInput.getAttribute('accept').split(',');
                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                
                if (allowedExtensions.includes(fileExtension)) {
                    // Simular um evento de mudança no input de arquivo
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;
                    
                    // Disparar o evento change para processar o arquivo
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                } else {
                    // Mostrar mensagem de erro se o arquivo não for do tipo correto
                    let fileType = '';
                    if (fileInput === policiesUpload || fileInput === clientsUpload) {
                        fileType = 'CSV';
                    } else if (fileInput === agentsUpload) {
                        fileType = 'XLSX, XLS ou CSV';
                    }
                    
                    showErrorModal(`Por favor, selecione um arquivo ${fileType} válido.`);
                }
            }
        }
    }
    
    // Função para processar mudanças em documentos únicos
    function handleDocumentChange(fileInput, infoElementId, statusElementId) {
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const infoElement = document.getElementById(infoElementId);
            const statusElement = document.getElementById(statusElementId);
            
            if (infoElement) {
                infoElement.innerHTML = `
                    <strong>Arquivo:</strong> ${file.name}<br>
                    <strong>Tamanho:</strong> ${(file.size / 1024).toFixed(2)} KB
                `;
                infoElement.classList.add('show');
            }
            
            if (statusElement) {
                statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Arquivo adicionado com sucesso';
                statusElement.className = 'status success';
            }
        }
    }
    
    // Função para processar mudanças em múltiplos documentos
    function handleMultipleDocumentsChange(fileInput, infoElementId, statusElementId) {
        if (fileInput.files && fileInput.files.length > 0) {
            const infoElement = document.getElementById(infoElementId);
            const statusElement = document.getElementById(statusElementId);
            
            let fileList = '';
            let totalSize = 0;
            
            for (let i = 0; i < fileInput.files.length; i++) {
                const file = fileInput.files[i];
                totalSize += file.size;
                fileList += `<strong>Arquivo ${i + 1}:</strong> ${file.name}<br>`;
            }
            
            if (infoElement) {
                infoElement.innerHTML = `
                    ${fileList}
                    <strong>Total:</strong> ${(totalSize / 1024).toFixed(2)} KB
                `;
                infoElement.classList.add('show');
            }
            
            if (statusElement) {
                statusElement.innerHTML = `<i class="fas fa-check-circle"></i> ${fileInput.files.length} arquivo(s) adicionado(s) com sucesso`;
                statusElement.className = 'status success';
            }
        }
    }
}); 