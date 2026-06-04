const patientId = window.location.pathname.split('/')[2];

function renderSection(title, content) {
    return `
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="section-title">${title}</h5>
                ${content}
            </div>
        </div>
    `;
}

function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function loadRecord() {
    const response = await apiFetch(`/patients/${patientId}/history`);
    const data = await response.json();
    const container = document.getElementById('recordContent');

    if (!data || !data.patient) {
        container.innerHTML = '<div class="alert alert-warning">Paciente não encontrado.</div>';
        return;
    }

    const patient = data.patient;
    const latestTriage = data.triages[0] || null;
    const latestAnamnese = data.anamneses[0] || null;
    const latestConsultation = data.consultations[0] || null;
    const latestEvolution = data.evolutions[0] || null;

    container.innerHTML = `
        <div class="row g-4 mb-4">
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="section-title">Dados do Paciente</h5>
                        <p><strong>Nome:</strong> ${patient.full_name}</p>
                        <p><strong>CPF:</strong> ${patient.cpf || '-'}</p>
                        <p><strong>Data de nascimento:</strong> ${formatDate(patient.birth_date)}</p>
                        <p><strong>Telefone:</strong> ${patient.phone || '-'}</p>
                        <p><strong>Email:</strong> ${patient.email || '-'}</p>
                        <p><strong>Tipo sanguíneo:</strong> ${patient.blood_type || '-'}</p>
                        <p><strong>Alergias:</strong> ${patient.allergies || '-'}</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card summary-card">
                    <div class="card-body">
                        <h5 class="section-title">Resumo Rápido</h5>
                        <div class="summary-grid">
                            <div>
                                <strong>${data.appointments.length}</strong>
                                <p class="mb-0 text-muted">Agendamentos</p>
                            </div>
                            <div>
                                <strong>${data.triages.length}</strong>
                                <p class="mb-0 text-muted">Triagens</p>
                            </div>
                            <div>
                                <strong>${data.anamneses.length}</strong>
                                <p class="mb-0 text-muted">Anamneses</p>
                            </div>
                            <div>
                                <strong>${data.evolutions.length}</strong>
                                <p class="mb-0 text-muted">Evoluções</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ${renderSection('Última Triagem', latestTriage ? `
            <p><strong>Data:</strong> ${formatDate(latestTriage.created_at)}</p>
            <p><strong>Pressão:</strong> ${latestTriage.blood_pressure || '-'}</p>
            <p><strong>Peso:</strong> ${latestTriage.weight || '-'} kg</p>
            <p><strong>Altura:</strong> ${latestTriage.height || '-'} m</p>
            <p><strong>Queixa:</strong> ${latestTriage.chief_complaint || '-'}</p>
        ` : '<p class="text-muted">Nenhuma triagem registrada.</p>' )}
        ${renderSection('Última Anamnese', latestAnamnese ? `
            <p><strong>Data:</strong> ${formatDate(latestAnamnese.created_at)}</p>
            <p><strong>Queixa principal:</strong> ${latestAnamnese.chief_complaint || '-'}</p>
            <p><strong>Histórico da doença atual:</strong> ${latestAnamnese.history_present_illness || '-'}</p>
        ` : '<p class="text-muted">Nenhuma anamnese registrada.</p>' )}
        ${renderSection('Última Consulta', latestConsultation ? `
            <p><strong>Data:</strong> ${formatDate(latestConsultation.created_at)}</p>
            <p><strong>Diagnóstico:</strong> ${latestConsultation.diagnosis || '-'}</p>
            <p><strong>Conduta:</strong> ${latestConsultation.conduct || '-'}</p>
            <p><strong>Médico:</strong> ${latestConsultation.doctor_name || '-'}</p>
        ` : '<p class="text-muted">Nenhuma consulta registrada.</p>' )}
        ${renderSection('Última Evolução', latestEvolution ? `
            <p><strong>Data:</strong> ${formatDate(latestEvolution.created_at)}</p>
            <p>${latestEvolution.evolution_text || '-'}</p>
        ` : '<p class="text-muted">Nenhuma evolução registrada.</p>' )}
        ${renderSection('Prescrições', data.prescriptions.length ? data.prescriptions.map(item => `
            <div class="mb-3 border-bottom pb-3">
                <p><strong>Prescrição ID:</strong> ${item.id || '-'}</p>
                <p><strong>Data:</strong> ${formatDate(item.created_at)}</p>
                <p><strong>Consulta:</strong> ${item.consultation_id || '-'}</p>
            </div>
        `).join('') : '<p class="text-muted">Nenhuma prescrição registrada.</p>' )}
        ${renderSection('Anexos', data.attachments.length ? data.attachments.map(file => `
            <div class="mb-3">
                <p><strong>Arquivo:</strong> ${file.original_name || 'Sem nome'}</p>
                <p><strong>Tipo:</strong> ${file.mime_type || '-'}</p>
                <p><strong>Enviado em:</strong> ${formatDate(file.created_at)}</p>
            </div>
        `).join('') : '<p class="text-muted">Nenhum anexo disponível.</p>' )}
    `;
}

if (document.getElementById('recordContent')) {
    loadRecord();
}
