document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const importTypeWrapper = document.getElementById('importTypeWrapper');
    const importType = document.getElementById('importType');
    const selectOptions = document.querySelectorAll('.select-option');
    const policiesStep = document.getElementById('policiesStep');
    const clientsStep = document.getElementById('clientsStep');
    const agentsStep = document.getElementById('agentsStep');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressSteps = document.querySelectorAll('.progress-step');
    
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
    
    // Dados convertidos
    let convertedData = {
        policies: null,
        clients: null,
        agents: null
    };
    
    // Abrir/fechar dropdown de seleção
    importTypeWrapper.addEventListener('click', function() {
        this.classList.toggle('open');
    });
    
    // Clicar fora para fechar dropdown
    document.addEventListener('click', function(e) {
        if (!importTypeWrapper.contains(e.target)) {
            importTypeWrapper.classList.remove('open');
        }
    });
    
    // Selecionar opção
    selectOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (!this.hasAttribute('disabled')) {
                selectedImportType = this.getAttribute('data-value');
                importType.value = this.textContent;
                importTypeWrapper.classList.remove('open');
            }
        });
    });
    
    // Upload areas click
    policiesUploadArea.addEventListener('click', function(e) {
        // Prevenir que o click em elementos filhos ative o input file
        if (e.target === this || e.target.closest('.upload-btn')) {
            policiesUpload.click();
        }
    });
    
    clientsUploadArea.addEventListener('click', function(e) {
        if (e.target === this || e.target.closest('.upload-btn')) {
            clientsUpload.click();
        }
    });
    
    agentsUploadArea.addEventListener('click', function(e) {
        if (e.target === this || e.target.closest('.upload-btn')) {
            agentsUpload.click();
        }
    });
    
    // Função para converter arquivo para CSV usando SheetJS
    function convertToCSV(file, callback) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Converter para CSV
                const csv = XLSX.utils.sheet_to_csv(worksheet);
                
                // Verificar se o arquivo já era CSV
                const isAlreadyCSV = file.name.toLowerCase().endsWith('.csv');
                
                callback({
                    success: true,
                    data: csv,
                    originalFormat: isAlreadyCSV ? 'CSV' : 'Excel',
                    rows: csv.split('\n').length - 1,
                    columns: csv.split('\n')[0].split(',').length
                });
            } catch (error) {
                callback({
                    success: false,
                    error: error.message
                });
            }
        };
        
        reader.onerror = function() {
            callback({
                success: false,
                error: 'Erro ao ler o arquivo'
            });
        };
        
        reader.readAsBinaryString(file);
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
    
    // Processar upload de políticas
    policiesUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            policiesUploadArea.querySelector('.upload-text').textContent = file.name;
            
            if (convertPoliciesCSV.checked) {
                convertToCSV(file, function(result) {
                    if (result.success) {
                        convertedData.policies = result.data;
                        
                        // Mostrar info do arquivo
                        policiesFileInfo.innerHTML = `
                            <strong>Arquivo:</strong> ${file.name}<br>
                            <strong>Formato original:</strong> ${result.originalFormat}<br>
                            <strong>Linhas:</strong> ${result.rows}<br>
                            <strong>Colunas:</strong> ${result.columns}
                        `;
                        policiesFileInfo.classList.add('show');
                        
                        // Mostrar status de sucesso
                        policiesStatus.innerHTML = '<i class="fas fa-check-circle"></i> Arquivo convertido para CSV com sucesso';
                        policiesStatus.className = 'status success';
                        
                        // Alterar estilo da área de upload
                        policiesUploadArea.style.borderColor = 'var(--success)';
                        
                        // Opção para baixar o CSV
                        const downloadBtn = document.createElement('button');
                        downloadBtn.className = 'upload-btn';
                        downloadBtn.style.marginLeft = '10px';
                        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Baixar CSV';
                        downloadBtn.onclick = function(e) {
                            e.stopPropagation();
                            const csvFileName = file.name.replace(/\.[^/.]+$/, '') + '.csv';
                            downloadCSV(convertedData.policies, csvFileName);
                        };
                        
                        // Remover botão anterior se existir
                        const existingBtn = policiesStatus.querySelector('button');
                        if (existingBtn) {
                            policiesStatus.removeChild(existingBtn);
                        }
                        
                        policiesStatus.appendChild(downloadBtn);
                    } else {
                        policiesFileInfo.innerHTML = `
                            <strong>Erro:</strong> ${result.error}<br>
                            <strong>Arquivo:</strong> ${file.name}
                        `;
                        policiesFileInfo.classList.add('show');
                        policiesStatus.textContent = 'Erro ao converter arquivo';
                        policiesStatus.className = 'status error';
                    }
                });
            } else {
                policiesFileInfo.innerHTML = `<strong>Arquivo:</strong> ${file.name}`;
                policiesFileInfo.classList.add('show');
                policiesUploadArea.style.borderColor = 'var(--success)';
            }
        }
    });
    
    // Processar upload de clientes
    clientsUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            clientsUploadArea.querySelector('.upload-text').textContent = file.name;
            
            if (convertClientsCSV.checked) {
                convertToCSV(file, function(result) {
                    if (result.success) {
                        convertedData.clients = result.data;
                        
                        // Mostrar info do arquivo
                        clientsFileInfo.innerHTML = `
                            <strong>Arquivo:</strong> ${file.name}<br>
                            <strong>Formato original:</strong> ${result.originalFormat}<br>
                            <strong>Linhas:</strong> ${result.rows}<br>
                            <strong>Colunas:</strong> ${result.columns}
                        `;
                        clientsFileInfo.classList.add('show');
                        
                        // Mostrar status de sucesso
                        clientsStatus.innerHTML = '<i class="fas fa-check-circle"></i> Arquivo convertido para CSV com sucesso';
                        clientsStatus.className = 'status success';
                        
                        // Alterar estilo da área de upload
                        clientsUploadArea.style.borderColor = 'var(--success)';
                        
                        // Opção para baixar o CSV
                        const downloadBtn = document.createElement('button');
                        downloadBtn.className = 'upload-btn';
                        downloadBtn.style.marginLeft = '10px';
                        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Baixar CSV';
                        downloadBtn.onclick = function(e) {
                            e.stopPropagation();
                            const csvFileName = file.name.replace(/\.[^/.]+$/, '') + '.csv';
                            downloadCSV(convertedData.clients, csvFileName);
                        };
                        
                        // Remover botão anterior se existir
                        const existingBtn = clientsStatus.querySelector('button');
                        if (existingBtn) {
                            clientsStatus.removeChild(existingBtn);
                        }
                        
                        clientsStatus.appendChild(downloadBtn);
                    } else {
                        clientsFileInfo.innerHTML = `
                            <strong>Erro:</strong> ${result.error}<br>
                            <strong>Arquivo:</strong> ${file.name}
                        `;
                        clientsFileInfo.classList.add('show');
                        clientsStatus.textContent = 'Erro ao converter arquivo';
                        clientsStatus.className = 'status error';
                    }
                });
            } else {
                clientsFileInfo.innerHTML = `<strong>Arquivo:</strong> ${file.name}`;
                clientsFileInfo.classList.add('show');
                clientsUploadArea.style.borderColor = 'var(--success)';
            }
        }
    });
    
    // Processar upload de agentes
    agentsUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            agentsUploadArea.querySelector('.upload-text').textContent = file.name;
            
            if (convertAgentsCSV.checked) {
                convertToCSV(file, function(result) {
                    if (result.success) {
                        convertedData.agents = result.data;
                        
                        // Mostrar info do arquivo
                        agentsFileInfo.innerHTML = `
                            <strong>Arquivo:</strong> ${file.name}<br>
                            <strong>Formato original:</strong> ${result.originalFormat}<br>
                            <strong>Linhas:</strong> ${result.rows}<br>
                            <strong>Colunas:</strong> ${result.columns}
                        `;
                        agentsFileInfo.classList.add('show');
                        
                        // Mostrar status de sucesso
                        agentsStatus.innerHTML = '<i class="fas fa-check-circle"></i> Arquivo convertido para CSV com sucesso';
                        agentsStatus.className = 'status success';
                        
                        // Alterar estilo da área de upload
                        agentsUploadArea.style.borderColor = 'var(--success)';
                        
                        // Opção para baixar o CSV
                        const downloadBtn = document.createElement('button');
                        downloadBtn.className = 'upload-btn';
                        downloadBtn.style.marginLeft = '10px';
                        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Baixar CSV';
                        downloadBtn.onclick = function(e) {
                            e.stopPropagation();
                            const csvFileName = file.name.replace(/\.[^/.]+$/, '') + '.csv';
                            downloadCSV(convertedData.agents, csvFileName);
                        };
                        
                        // Remover botão anterior se existir
                        const existingBtn = agentsStatus.querySelector('button');
                        if (existingBtn) {
                            agentsStatus.removeChild(existingBtn);
                        }
                        
                        agentsStatus.appendChild(downloadBtn);
                    } else {
                        agentsFileInfo.innerHTML = `
                            <strong>Erro:</strong> ${result.error}<br>
                            <strong>Arquivo:</strong> ${file.name}
                        `;
                        agentsFileInfo.classList.add('show');
                        agentsStatus.textContent = 'Erro ao converter arquivo';
                        agentsStatus.className = 'status error';
                    }
                });
            } else {
                agentsFileInfo.innerHTML = `<strong>Arquivo:</strong> ${file.name}`;
                agentsFileInfo.classList.add('show');
                agentsUploadArea.style.borderColor = 'var(--success)';
            }
        }
    });
    
    // Navegação entre etapas
    nextBtn.addEventListener('click', function() {
        // Verificar etapa atual
        if (currentStep === 1) {
            // Verificar se tipo de importação foi selecionado
            if (!selectedImportType) {
                alert('Por favor, selecione um tipo de importação.');
                return;
            }
            
            // Atualizar UI para a próxima etapa
            progressSteps[0].classList.remove('active');
            progressSteps[0].classList.add('completed');
            progressSteps[1].classList.add('active');
            
            // Esconder etapa atual e mostrar a próxima
            importTypeWrapper.parentElement.style.display = 'none';
            policiesStep.style.display = 'block';
            
            // Mostrar botão anterior
            prevBtn.style.display = 'flex';
            
            // Atualizar estado
            currentStep = 2;
        } else if (currentStep === 2) {
            // Verificar se arquivo de apólices foi carregado
            if (!policiesUpload.files || !policiesUpload.files[0]) {
                alert('Por favor, carregue um arquivo de apólices.');
                return;
            }
            
            // Atualizar UI para a próxima etapa
            progressSteps[1].classList.remove('active');
            progressSteps[1].classList.add('completed');
            progressSteps[2].classList.add('active');
            
            // Esconder etapa atual e mostrar a próxima
            policiesStep.style.display = 'none';
            clientsStep.style.display = 'block';
            
            // Atualizar estado
            currentStep = 3;
        } else if (currentStep === 3) {
            // Verificar se arquivo de clientes foi carregado
            if (!clientsUpload.files || !clientsUpload.files[0]) {
                alert('Por favor, carregue um arquivo de clientes.');
                return;
            }
            
            // Atualizar UI para a próxima etapa
            progressSteps[2].classList.remove('active');
            progressSteps[2].classList.add('completed');
            progressSteps[3].classList.add('active');
            
            // Esconder etapa atual e mostrar a próxima
            clientsStep.style.display = 'none';
            agentsStep.style.display = 'block';
            
            // Atualizar texto do botão
            nextBtn.innerHTML = 'Finalizar <i class="fas fa-check"></i>';
            
            // Atualizar estado
            currentStep = 4;
        } else if (currentStep === 4) {
            // Verificar se arquivo de agentes foi carregado
            if (!agentsUpload.files || !agentsUpload.files[0]) {
                alert('Por favor, carregue um arquivo de agentes.');
                return;
            }
            
            // Finalizar importação
            alert('Importação concluída com sucesso!');
            
            // Aqui você pode enviar os dados para o servidor ou fazer o que for necessário
            console.log('Dados importados:', convertedData);
            
            // Redirecionar para outra página ou resetar o formulário
            // window.location.href = 'dashboard.html';
        }
    });
    
    // Voltar para etapa anterior
    prevBtn.addEventListener('click', function() {
        if (currentStep === 2) {
            // Voltar para etapa 1
            progressSteps[1].classList.remove('active');
            progressSteps[0].classList.remove('completed');
            progressSteps[0].classList.add('active');
            
            // Mostrar etapa anterior
            importTypeWrapper.parentElement.style.display = 'block';
            policiesStep.style.display = 'none';
            
            // Esconder botão anterior
            prevBtn.style.display = 'none';
            
            // Atualizar estado
            currentStep = 1;
        } else if (currentStep === 3) {
            // Voltar para etapa 2
            progressSteps[2].classList.remove('active');
            progressSteps[1].classList.remove('completed');
            progressSteps[1].classList.add('active');
            
            // Mostrar etapa anterior
            policiesStep.style.display = 'block';
            clientsStep.style.display = 'none';
            
            // Atualizar estado
            currentStep = 2;
        } else if (currentStep === 4) {
            // Voltar para etapa 3
            progressSteps[3].classList.remove('active');
            progressSteps[2].classList.remove('completed');
            progressSteps[2].classList.add('active');
            
            // Mostrar etapa anterior
            clientsStep.style.display = 'block';
            agentsStep.style.display = 'none';
            
            // Restaurar texto do botão
            nextBtn.innerHTML = 'Próximo <i class="fas fa-arrow-right"></i>';
            
            // Atualizar estado
            currentStep = 3;
        }
    });
}); 