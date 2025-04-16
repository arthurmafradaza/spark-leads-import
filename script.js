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
            // Determinar o ícone correto com base na extensão do arquivo
            const fileExtension = uploadedFiles.agents.name.split('.').pop().toLowerCase();
            const iconClass = fileExtension === 'csv' ? 'fa-file-csv' : 'fa-file-excel';
            
            const div = document.createElement('div');
            div.className = 'confirmation-file';
            div.innerHTML = `
                <i class="fas ${iconClass}"></i>
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
                confirmBtn.style.display = 'flex';
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
                confirmBtn.style.display = 'flex';
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
                confirmBtn.style.display = 'flex';
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
                confirmBtn.style.display = 'none';
                updateStep(2);
            } else if (selectedImportType === 'multiple-agents') {
                // Voltar para etapa 2
                confirmationStep.style.display = 'none';
                agentsStep.style.display = 'block';
                nextBtn.style.display = 'flex';
                confirmBtn.style.display = 'none';
                updateStep(2);
            } else if (selectedImportType === 'import-both') {
                // Limpar upload de agentes
                resetUploads('agents');
                
                // Voltar para etapa 2 (apólices)
                agentsStep.style.display = 'none';
                policiesStep.style.display = 'block';
                confirmBtn.style.display = 'none';
                updateStep(2);
            }
        } else if (currentStep === 4) {
            if (selectedImportType === 'import-both') {
                // Voltar para etapa 3 (agentes)
                confirmationStep.style.display = 'none';
                agentsStep.style.display = 'block';
                nextBtn.style.display = 'flex';
                confirmBtn.style.display = 'none';
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
    function validateColumnCount(csvText, expectedColumnCount) {
        if (!csvText) return false;
        
        // Pegar a primeira linha (cabeçalhos) e contar as colunas
        const firstLine = csvText.split('\n')[0];
        const columns = firstLine.split(',');
        
        return columns.length === expectedColumnCount;
    }
    
    // Função para verificar o arquivo CSV
    async function validateCSVFile(file, expectedColumnCount) {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve({ valid: false, message: 'Arquivo não encontrado.' });
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const csvText = e.target.result;
                const isValid = validateColumnCount(csvText, expectedColumnCount);
                
                if (isValid) {
                    resolve({ valid: true });
                } else {
                    const message = `O arquivo deve conter exatamente ${expectedColumnCount} colunas. Por favor, verifique o arquivo.`;
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
            
            // Garantir que estamos usando HTTPS
            const webhookUrl = 'https://hook.us1.make.com/gerqw9zrak7lhliutaj0196c75ldn9u4';
            
            // Verificar se o URL começa com https://
            if (!webhookUrl.startsWith('https://')) {
                console.error('Erro: O webhook deve usar uma conexão segura (HTTPS)');
                return false;
            }

            // Ler o conteúdo dos arquivos como texto, quando aplicável
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
                "Number", "First Name", "Last Name", "Email", "Phone",
                "Address", "City", "State", "Zip", "Country"
            ];
            
            const agentsHeaders = [
                "Name", "Email", "Address", "Phone", "Status", 
                "Upline Agent", "Compensation", "Start Date"
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
        // Simular envio com um breve atraso para feedback visual
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        confirmBtn.disabled = true;
        
        // Verificar número de colunas nos arquivos antes de enviar
        let validationErrors = [];
        
        // Validar Policies (16 colunas)
        if (uploadedFiles.policies) {
            const policiesValidation = await validateCSVFile(uploadedFiles.policies, 16);
            if (!policiesValidation.valid) {
                validationErrors.push(`Arquivo de Apólices`);
            }
        }
        
        // Validar Clients (14 colunas)
        if (uploadedFiles.clients) {
            const clientsValidation = await validateCSVFile(uploadedFiles.clients, 14);
            if (!clientsValidation.valid) {
                validationErrors.push(`Arquivo de Clientes`);
            }
        }
        
        // Validar Agents (10 colunas)
        if (uploadedFiles.agents && uploadedFiles.agentsCSV) {
            // Para agentes, validamos o CSV convertido
            const isValid = validateColumnCount(uploadedFiles.agentsCSV, 10);
            if (!isValid) {
                validationErrors.push('Arquivo de Agentes');
            }
        }
        
        // Se houver erros de validação, mostrar mensagem e não prosseguir
        if (validationErrors.length > 0) {
            let errorMessage = '<div class="validation-header"><i class="fas fa-exclamation-circle"></i> Atenção</div>';
            
            errorMessage += '<p style="margin: 0 0 10px; display: flex; align-items: center;"><i class="fas fa-exclamation-triangle" style="color: #e74c3c; margin-right: 8px;"></i> <span style="color: #e74c3c; font-weight: 600;">Ops! Encontramos um problema com seus arquivos</span></p>';
            
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
        const webhookSuccess = await sendWebhook(uploadedFiles);
        
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
            if (uploadedFiles.agents && uploadedFiles.agentsCSV) {
                mensagemAdicional += '<br><br>O arquivo de agentes XLSX foi automaticamente convertido para CSV e enviado com sucesso.';
            }
            
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

    // Configurar funcionalidade de arrastar e soltar para áreas de upload
    function setupDragAndDrop() {
        // Configurar cada área de upload
        setupDragAndDropArea(policiesUploadArea, policiesUpload);
        setupDragAndDropArea(clientsUploadArea, clientsUpload);
        setupDragAndDropArea(agentsUploadArea, agentsUpload);
        
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
}); 