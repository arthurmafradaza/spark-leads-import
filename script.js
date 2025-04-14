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
    
    // Arquivos carregados
    let uploadedFiles = {
        policies: null,
        clients: null,
        agents: null
    };
    
    // Abrir/fechar dropdown de seleção
    importTypeWrapper.addEventListener('click', function(e) {
        this.classList.toggle('open');
        e.stopPropagation();
    });
    
    // Clicar fora para fechar dropdown
    document.addEventListener('click', function(e) {
        if (!importTypeWrapper.contains(e.target)) {
            importTypeWrapper.classList.remove('open');
        }
    });
    
    // Função para avançar para a próxima etapa com base no tipo de importação
    function goToNextStep() {
        if (!selectedImportType) {
            alert('Por favor, selecione um tipo de importação.');
            return;
        }
        
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
            nextBtn.innerHTML = 'Finalizar <i class="fas fa-check"></i>';
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
                <strong>Arquivo:</strong> ${file.name}<br>
                <strong>Tipo:</strong> CSV
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
                <strong>Arquivo:</strong> ${file.name}<br>
                <strong>Tipo:</strong> CSV
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
                    <strong>Arquivo:</strong> ${file.name}<br>
                    <strong>Linhas:</strong> ${result.rows}<br>
                    <strong>Colunas:</strong> ${result.columns}<br>
                    <strong>Status:</strong> <span style="color: var(--success)">Convertido para CSV</span>
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
        
        // Atualizar indicadores de progresso
        progressSteps.forEach((stepElement, index) => {
            stepElement.classList.remove('active', 'completed');
            
            if (index + 1 < currentStep) {
                stepElement.classList.add('completed');
            } else if (index + 1 === currentStep) {
                stepElement.classList.add('active');
            }
        });
        
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
                <span class="file-type">CSV</span>
            `;
            confirmationFiles.appendChild(div);
        }
        
        if (uploadedFiles.clients) {
            const div = document.createElement('div');
            div.className = 'confirmation-file';
            div.innerHTML = `
                <i class="fas fa-file-csv"></i>
                <span class="file-name">${uploadedFiles.clients.name}</span>
                <span class="file-type">CSV</span>
            `;
            confirmationFiles.appendChild(div);
        }
        
        if (uploadedFiles.agents) {
            const div = document.createElement('div');
            div.className = 'confirmation-file';
            div.innerHTML = `
                <i class="fas fa-file-excel"></i>
                <span class="file-name">${uploadedFiles.agents.name}</span>
                <span class="file-type">XLSX → CSV</span>
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
                    alert('Por favor, carregue um arquivo de apólices.');
                    return;
                }
                if (!uploadedFiles.clients) {
                    alert('Por favor, carregue um arquivo de clientes.');
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
                    alert('Por favor, carregue um arquivo de agentes.');
                    return;
                }
                
                // Processar conclusão
                alert('Importação concluída com sucesso!');
                console.log('Dados importados:', uploadedFiles);
                
                // Resetar formulário após conclusão
                resetForm();
            } else if (selectedImportType === 'import-both') {
                // Verificar se arquivos de apólices e clientes foram carregados
                if (!uploadedFiles.policies) {
                    alert('Por favor, carregue um arquivo de apólices.');
                    return;
                }
                if (!uploadedFiles.clients) {
                    alert('Por favor, carregue um arquivo de clientes.');
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
                    alert('Por favor, carregue um arquivo de agentes.');
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
            
            importTypeWrapper.parentElement.style.display = 'block';
            updateStep(1);
        } else if (currentStep === 3) {
            if (selectedImportType === 'multiple-policies') {
                // Voltar para etapa 2
                confirmationStep.style.display = 'none';
                policiesStep.style.display = 'block';
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
    
    // Botão de confirmação final
    confirmBtn.addEventListener('click', function() {
        // Processar a submissão final dos arquivos
        alert('Importação concluída com sucesso!');
        console.log('Dados importados:', uploadedFiles);
        
        // Resetar o formulário após o envio
        resetForm();
    });
}); 