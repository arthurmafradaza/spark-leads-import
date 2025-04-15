document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const importTypeWrapper = document.getElementById('importTypeWrapper');
    const importType = document.getElementById('importType');
    const selectOptions = document.querySelectorAll('.select-option');
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
    let selectedImportType = null;
    let totalSteps = 4; // Padrão para "Importar Ambos"
    
    // Arquivos carregados
    let uploadedFiles = {
        policies: null,
        clients: null,
        agents: null
    };
    
    // Inicializar funções de modal
    initModals();
    
    // Configuração de tooltips
    setupTooltips();
    
    // Configuração de acessibilidade para upload areas
    setupAccessibleUploads();
    
    // Abrir/fechar dropdown de seleção
    importTypeWrapper.addEventListener('click', function(e) {
        this.classList.toggle('open');
        e.stopPropagation();
    });
    
    // Suporte a teclado para dropdown
    importType.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            importTypeWrapper.classList.add('open');
        }
    });
    
    // Suporte a teclado para opções de dropdown
    selectOptions.forEach(option => {
        option.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Adicionar tabindex para navegação por teclado
        option.setAttribute('tabindex', '0');
    });
    
    // Clicar fora para fechar dropdown
    document.addEventListener('click', function(e) {
        if (!importTypeWrapper.contains(e.target)) {
            importTypeWrapper.classList.remove('open');
        }
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
            successModal.querySelector('.modal-message').textContent = message;
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
        errorMessage.textContent = message || 'Ocorreu um erro.';
        
        modalOverlay.classList.add('active');
        errorModal.classList.add('active');
        successModal.classList.remove('active');
        
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
        
        if (importType === 'multiple-policies') {
            steps = [
                { number: 1, title: 'Tipo de Importação' },
                { number: 2, title: 'Apólices/Clientes' },
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
    
    // Função para avançar para a próxima etapa com base no tipo de importação
    function goToNextStep() {
        if (!selectedImportType) {
            showErrorModal('Por favor, selecione um tipo de importação.');
            return;
        }
        
        // Ajustar a barra de progresso para o tipo de importação selecionado
        adjustProgressBar(selectedImportType);
        
        // Configurar próxima etapa com base no tipo de importação
        if (selectedImportType === 'multiple-policies') {
            // Mostrar etapa de apólices e clientes
            policiesStep.style.display = 'block';
            importTypeWrapper.parentElement.style.display = 'none';
            clientsUploadGroup.style.display = 'block';
            updateStep(2);
        } else if (selectedImportType === 'multiple-agents') {
            // Mostrar etapa de agentes
            agentsStep.style.display = 'block';
            importTypeWrapper.parentElement.style.display = 'none';
            updateStep(2);
            // Mudar o texto do botão próximo
            nextBtn.innerHTML = 'Próximo <i class="fas fa-arrow-right"></i>';
        } else if (selectedImportType === 'import-both') {
            // Mostrar etapa de apólices e clientes
            policiesStep.style.display = 'block';
            importTypeWrapper.parentElement.style.display = 'none';
            clientsUploadGroup.style.display = 'block';
            updateStep(2);
        }
    }
    
    // Selecionar opção e avançar automaticamente
    selectOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation(); // Impedir que o evento de click se propague para o wrapper
            if (!this.hasAttribute('disabled')) {
                selectedImportType = this.getAttribute('data-value');
                importType.value = this.textContent;
                importTypeWrapper.classList.remove('open');
                
                // Avançar automaticamente para a próxima etapa
                setTimeout(goToNextStep, 300); // Pequeno delay para mostrar a seleção antes de avançar
            }
        });
    });
    
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
        }
    }
    
    // Resetar todo o formulário
    function resetForm() {
        // Resetar todos os uploads
        resetUploads('all');
        
        // Resetar tipo de importação
        selectedImportType = null;
        importType.value = '';
        
        // Voltar para a primeira etapa
        policiesStep.style.display = 'none';
        agentsStep.style.display = 'none';
        confirmationStep.style.display = 'none';
        importTypeWrapper.parentElement.style.display = 'block';
        
        // Resetar texto do botão próximo
        nextBtn.innerHTML = 'Próximo <i class="fas fa-arrow-right"></i>';
        nextBtn.style.display = 'flex';
        
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
            policiesUploadArea.style.borderColor = 'var(--success)';
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
    
    // Processar upload de agentes (XLSX)
    agentsUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            uploadedFiles.agents = file;
            
            agentsUploadArea.querySelector('.upload-text').textContent = file.name;
            
            // Converter XLSX para CSV automaticamente
            convertToCSV(file).then(result => {
                // Armazenar o CSV convertido
                uploadedFiles.agentsCSV = result.data;
                
                agentsFileInfo.innerHTML = `
                    <strong>Arquivo:</strong> ${file.name}
                `;
                agentsFileInfo.classList.add('show');
                agentsUploadArea.style.borderColor = 'var(--success)';
                agentsStatus.innerHTML = '<i class="fas fa-check-circle"></i> Arquivo convertido para CSV com sucesso';
                agentsStatus.className = 'status success';
            }).catch(error => {
                agentsFileInfo.innerHTML = `
                    <strong>Erro:</strong> ${error.error}<br>
                    <strong>Arquivo:</strong> ${file.name}
                `;
                agentsFileInfo.classList.add('show');
                agentsStatus.textContent = 'Erro ao converter arquivo';
                agentsStatus.className = 'status error';
            });
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
        confirmationFiles.innerHTML = '';
        
        if (uploadedFiles.policies) {
            const div = document.createElement('div');
            div.className = 'confirmation-file';
            div.innerHTML = `
                <i class="fas fa-file-csv"></i>
                <span class="file-name">${uploadedFiles.policies.name}</span>
            `;
            confirmationFiles.appendChild(div);
        }
        
        if (uploadedFiles.clients) {
            const div = document.createElement('div');
            div.className = 'confirmation-file';
            div.innerHTML = `
                <i class="fas fa-file-csv"></i>
                <span class="file-name">${uploadedFiles.clients.name}</span>
            `;
            confirmationFiles.appendChild(div);
        }
        
        if (uploadedFiles.agents) {
            const div = document.createElement('div');
            div.className = 'confirmation-file';
            div.innerHTML = `
                <i class="fas fa-file-excel"></i>
                <span class="file-name">${uploadedFiles.agents.name}</span>
            `;
            confirmationFiles.appendChild(div);
        }
    }
    
    // Navegação entre etapas
    nextBtn.addEventListener('click', function() {
        // Verificar etapa atual
        if (currentStep === 1) {
            goToNextStep();
        } else if (currentStep === 2) {
            if (selectedImportType === 'multiple-policies') {
                // Verificar se arquivos de apólices e clientes foram carregados
                if (!uploadedFiles.policies) {
                    showErrorModal('Por favor, carregue um arquivo de apólices.');
                    return;
                }
                if (!uploadedFiles.clients) {
                    showErrorModal('Por favor, carregue um arquivo de clientes.');
                    return;
                }
                
                // Preparar confirmação
                prepareConfirmation();
                
                // Mostrar etapa de confirmação
                policiesStep.style.display = 'none';
                confirmationStep.style.display = 'block';
                nextBtn.style.display = 'none';
                updateStep(3);
            } else if (selectedImportType === 'multiple-agents') {
                // Verificar se arquivo de agentes foi carregado
                if (!uploadedFiles.agents) {
                    showErrorModal('Por favor, carregue um arquivo de agentes.');
                    return;
                }
                
                // Preparar confirmação
                prepareConfirmation();
                
                // Mostrar etapa de confirmação
                agentsStep.style.display = 'none';
                confirmationStep.style.display = 'block';
                nextBtn.style.display = 'none';
                updateStep(3);
            } else if (selectedImportType === 'import-both') {
                // Verificar se arquivos de apólices e clientes foram carregados
                if (!uploadedFiles.policies) {
                    showErrorModal('Por favor, carregue um arquivo de apólices.');
                    return;
                }
                if (!uploadedFiles.clients) {
                    showErrorModal('Por favor, carregue um arquivo de clientes.');
                    return;
                }
                
                // Mostrar etapa de agentes
                policiesStep.style.display = 'none';
                agentsStep.style.display = 'block';
                updateStep(3);
            }
        } else if (currentStep === 3) {
            if (selectedImportType === 'import-both') {
                // Verificar se arquivo de agentes foi carregado
                if (!uploadedFiles.agents) {
                    showErrorModal('Por favor, carregue um arquivo de agentes.');
                    return;
                }
                
                // Preparar confirmação
                prepareConfirmation();
                
                // Mostrar etapa de confirmação
                agentsStep.style.display = 'none';
                confirmationStep.style.display = 'block';
                nextBtn.style.display = 'none';
                updateStep(4);
            }
        }
    });
    
    // Voltar para etapa anterior
    prevBtn.addEventListener('click', function() {
        if (currentStep === 2) {
            if (selectedImportType === 'multiple-policies' || selectedImportType === 'import-both') {
                // Limpar uploads de apólices e clientes
                resetUploads('policies');
                resetUploads('clients');
                
                // Voltar para etapa 1
                policiesStep.style.display = 'none';
            } else if (selectedImportType === 'multiple-agents') {
                // Limpar upload de agentes
                resetUploads('agents');
                
                // Voltar para etapa 1
                agentsStep.style.display = 'none';
                nextBtn.innerHTML = 'Próximo <i class="fas fa-arrow-right"></i>';
            }
            
            // Restaurar a visão inicial da barra de progresso
            initSingleStepProgressBar();
            
            // Restaurar a tela inicial
            importTypeWrapper.parentElement.style.display = 'block';
            selectedImportType = null;
            importType.value = '';
            updateStep(1);
        } else if (currentStep === 3) {
            if (selectedImportType === 'multiple-policies') {
                // Voltar para etapa 2
                confirmationStep.style.display = 'none';
                policiesStep.style.display = 'block';
                nextBtn.style.display = 'flex';
                updateStep(2);
            } else if (selectedImportType === 'multiple-agents') {
                // Voltar para etapa 2
                confirmationStep.style.display = 'none';
                agentsStep.style.display = 'block';
                nextBtn.style.display = 'flex';
                updateStep(2);
            } else if (selectedImportType === 'import-both') {
                // Limpar upload de agentes
                resetUploads('agents');
                
                // Voltar para etapa 2 (apólices)
                agentsStep.style.display = 'none';
                policiesStep.style.display = 'block';
                updateStep(2);
            }
        } else if (currentStep === 4) {
            if (selectedImportType === 'import-both') {
                // Voltar para etapa 3 (agentes)
                confirmationStep.style.display = 'none';
                agentsStep.style.display = 'block';
                nextBtn.style.display = 'flex';
                updateStep(3);
            }
        }
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
            reader.onload = () => resolve(reader.result); // Mantém o prefixo data:...;base64, como uma URL válida
            reader.onerror = error => reject(error);
        });
    }

    // Função para enviar dados para o webhook
    async function sendWebhook(files) {
        try {
            // Obter o client_location_id da URL
            const locationId = getUrlParameter('client_location_id') || '';
            
            // Converter todos os arquivos para URLs Base64
            const policiesUrl = files.policies ? await fileToBase64(files.policies) : '';
            const clientsUrl = files.clients ? await fileToBase64(files.clients) : '';
            const agentsUrl = files.agents ? await fileToBase64(files.agents) : '';
            
            // Criar o objeto de dados para enviar
            const requestData = {
                location_id: locationId,
                police_file: policiesUrl,
                cliente_file: clientsUrl,
                agent_file: agentsUrl
            };
            
            console.log('Enviando arquivos como URLs Base64...');
            
            // Enviar os dados como JSON
            const response = await fetch('https://services.leadconnectorhq.com/hooks/efZEjK6PqtPGDHqB2vV6/webhook-trigger/c73f9458-05f6-440b-90d6-4ba4194a8167', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            console.log('Resposta do webhook:', response.status);
            
            if (response.ok) {
                console.log('Webhook enviado com sucesso');
                return true;
            } else {
                const errorText = await response.text();
                console.error('Erro ao enviar webhook:', response.status, errorText);
                return false;
            }
        } catch (error) {
            console.error('Erro ao enviar webhook:', error);
            return false;
        }
    }
    
    // Botão de confirmação final
    confirmBtn.addEventListener('click', async function() {
        // Simular envio com um breve atraso para feedback visual
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        confirmBtn.disabled = true;
        
        // Enviar arquivos para o webhook
        const webhookSuccess = await sendWebhook(uploadedFiles);
        
        // Processar a submissão final dos arquivos
        console.log('Dados importados:', uploadedFiles);
        
        // Mostrar modal de sucesso ou erro baseado na resposta do webhook
        if (webhookSuccess) {
            showSuccessModal('Importação concluída com sucesso!');
        } else {
            showErrorModal('Ocorreu um erro ao processar os arquivos. Por favor, tente novamente.');
        }
        
        // Resetar o formulário após o envio
        resetForm();
        
        // Restaurar o botão
        confirmBtn.innerHTML = '<i class="fas fa-upload"></i> Confirmar e Enviar';
        confirmBtn.disabled = false;
    });
    
    // Inicializar a barra de progresso com apenas o primeiro passo
    initSingleStepProgressBar();
});