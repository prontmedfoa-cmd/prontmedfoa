const consultationId = window.location.pathname.split('/').pop();

async function fetchConsultation() {
    const response = await apiFetch(`/consultations/${consultationId}`);
    if (!response || !response.ok) {
        return null;
    }
    return await response.json();
}

async function fetchPatient(patientId) {
    if (!patientId) return null;
    const response = await apiFetch(`/patients/${patientId}`);
    if (!response || !response.ok) return null;
    return await response.json();
}

async function fetchTriage(triageId) {
    if (!triageId) return null;
    const response = await apiFetch(`/triages/${triageId}`);
    if (!response || !response.ok) return null;
    return await response.json();
}

async function fetchAnamnese(anamneseId) {
    if (!anamneseId) return null;
    const response = await apiFetch(`/anamneses/${anamneseId}`);
    if (!response || !response.ok) return null;
    return await response.json();
}

async function loadPatients(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const response = await apiFetch('/patients?limit=100');
    const result = response ? await response.json() : null;
    const patients = result?.data || [];

    select.innerHTML = '<option value="">Selecione um paciente</option>';
    patients.forEach(patient => {
        select.innerHTML += `
            <option value="${patient.id}">${patient.full_name} (${patient.cpf || 'sem CPF'})</option>
        `;
    });
}

async function loadTriagesForPatient(patientId) {
    const select = document.getElementById('triageSelect');
    if (!select) return;

    select.innerHTML = '<option value="">Nenhuma</option>';
    if (!patientId) return;

    const response = await apiFetch(`/triages/patient/${patientId}`);
    const triages = response ? await response.json() : [];
    triages.forEach(triage => {
        select.innerHTML += `
            <option value="${triage.id}">Triagem ${triage.id} - ${triage.blood_pressure || 'sem pressão'}</option>
        `;
    });
}

async function loadAnamnesesForPatient(patientId) {
    const select = document.getElementById('anamneseSelect');
    if (!select) return;

    select.innerHTML = '<option value="">Nenhuma</option>';
    if (!patientId) return;

    const response = await apiFetch(`/anamneses/patient/${patientId}`);
    const anamneses = response ? await response.json() : [];
    anamneses.forEach(anamnese => {
        select.innerHTML += `
            <option value="${anamnese.id}">Anamnese ${anamnese.id} - ${anamnese.chief_complaint || 'sem queixa'}</option>
        `;
    });
}

async function loadEvolutions(patientId) {
    const tbody = document.getElementById('evolutionsTable');
    if (!tbody) return;

    if (!patientId) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">Nenhuma evolução carregada.</td>
            </tr>
        `;
        return;
    }

    const response = await apiFetch(`/evolutions/patient/${patientId}`);
    const evolutions = response ? await response.json() : [];

    if (!evolutions || evolutions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">Nenhuma evolução encontrada.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = '';
    evolutions.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.evolution_type || '—'}</td>
                <td>${item.professional_name || '—'}</td>
                <td>${item.evolution_text || '—'}</td>
                <td>${new Date(item.created_at).toLocaleString('pt-BR')}</td>
            </tr>
        `;
    });
}

function renderPrescriptionsTable(prescriptions) {
    const tbody = document.getElementById('prescriptionsTable');
    if (!tbody) return;

    if (!prescriptions || prescriptions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">Nenhuma prescrição encontrada.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    prescriptions.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.consultation_id || '—'}</td>
                <td>${p.notes || '—'}</td>
                <td>${new Date(p.created_at).toLocaleString('pt-BR')}</td>
            </tr>
        `;
    });
}

function renderAttachmentsTable(attachments) {
    const tbody = document.getElementById('attachmentsTable');
    if (!tbody) return;

    if (!attachments || attachments.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">Nenhum anexo encontrado.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    attachments.forEach(a => {
        tbody.innerHTML += `
            <tr>
                <td>${a.id}</td>
                <td><a href="${a.file_path}" target="_blank">${a.file_name}</a></td>
                <td>${a.mime_type || '—'}</td>
                <td>${a.uploaded_by || '—'}</td>
                <td>${new Date(a.created_at).toLocaleString('pt-BR')}</td>
            </tr>
        `;
    });
}

async function fetchPatientHistory(patientId) {
    if (!patientId) return null;
    const response = await apiFetch(`/patients/${patientId}/history`);
    if (!response || !response.ok) return null;
    return await response.json();
}

function renderConsultationSummary(data, patient, triage, anamnese) {
    const container = document.getElementById('consultationSummary');
    if (!container) return;

    container.innerHTML = `
        <div class="card-body">
            <div class="row g-4">
                <div class="col-md-6">
                    <dl class="row mb-0">
                        <dt class="col-5 text-muted">Paciente</dt>
                        <dd class="col-7">${patient?.full_name || data.patient_id}</dd>
                        <dt class="col-5 text-muted">Consulta</dt>
                        <dd class="col-7">${data.id}</dd>
                        <dt class="col-5 text-muted">Data</dt>
                        <dd class="col-7">${new Date(data.created_at).toLocaleString('pt-BR')}</dd>
                        <dt class="col-5 text-muted">Médico</dt>
                        <dd class="col-7">${data.doctor_name || '—'}</dd>
                    </dl>
                </div>
                <div class="col-md-6">
                    <dl class="row mb-0">
                        <dt class="col-5 text-muted">Triagem</dt>
                        <dd class="col-7">${triage ? `ID ${triage.id}` : data.triage_id || '—'}</dd>
                        <dt class="col-5 text-muted">Anamnese</dt>
                        <dd class="col-7">${anamnese ? `ID ${anamnese.id}` : data.anamnese_id || '—'}</dd>
                        <dt class="col-5 text-muted">Retorno</dt>
                        <dd class="col-7">${data.return_in_days || '—'} dias</dd>
                    </dl>
                </div>
                <div class="col-12">
                    <h5>Diagnóstico</h5>
                    <p>${data.diagnosis || 'Sem diagnóstico registrado'}</p>
                </div>
                <div class="col-12">
                    <h5>Conduta</h5>
                    <p>${data.medical_conduct || 'Sem conduta registrada'}</p>
                </div>
                <div class="col-12">
                    <h5>Encaminhamento</h5>
                    <p>${data.referral || 'Nenhum encaminhamento'}</p>
                </div>
                <div class="col-12">
                    <h5>Exames Solicitados</h5>
                    <p>${data.requested_exams || 'Nenhum exame solicitado'}</p>
                </div>
                <div class="col-12">
                    <h5>Atestado</h5>
                    <p>${data.medical_certificate || 'Nenhum atestado'}</p>
                </div>
                <div class="col-12">
                    <h5>Observações</h5>
                    <p>${data.notes || 'Sem observações'}</p>
                </div>
            </div>
        </div>
    `;

    const editLink = document.getElementById('editLink');
    if (editLink) {
        editLink.href = `/consultations/${consultationId}/edit`;
    }
}

async function populateConsultationForm(data) {
    const form = document.getElementById('consultationEditForm');
    if (!form) return;

    const values = {
        appointment_id: data.appointment_id,
        triage_id: data.triage_id,
        anamnese_id: data.anamnese_id,
        diagnosis: data.diagnosis,
        medical_conduct: data.medical_conduct,
        requested_exams: data.requested_exams,
        medical_certificate: data.medical_certificate,
        referral: data.referral,
        return_in_days: data.return_in_days,
        notes: data.notes
    };

    Object.keys(values).forEach(name => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input) {
            input.value = values[name] ?? '';
        }
    });

    const patientSelect = document.getElementById('patientSelect');
    if (patientSelect) {
        patientSelect.value = data.patient_id;
    }
}

if (document.getElementById('consultationSummary')) {
    fetchConsultation().then(async consultation => {
        if (!consultation) return;

        const [patient, triage, anamnese, history] = await Promise.all([
            fetchPatient(consultation.patient_id),
            fetchTriage(consultation.triage_id),
            fetchAnamnese(consultation.anamnese_id),
            fetchPatientHistory(consultation.patient_id)
        ]);

        renderConsultationSummary(consultation, patient, triage, anamnese);
        loadEvolutions(consultation.patient_id);

        // render prescriptions and attachments from patient history
        renderPrescriptionsTable(history?.prescriptions || []);
        renderAttachmentsTable(history?.attachments || []);

        // handle open query param to focus a section
        const params = new URLSearchParams(window.location.search);
        const open = params.get('open');
        if (open === 'prescription') {
            const el = document.getElementById('prescriptionForm');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        if (open === 'evolution') {
            const el = document.getElementById('evolutionForm');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

if (document.getElementById('prescriptionForm')) {
    document.getElementById('prescriptionForm').addEventListener('submit', async event => {
        event.preventDefault();
        const payload = Object.fromEntries(new FormData(event.target).entries());
        payload.consultation_id = consultationId;
        const response = await apiFetch('/prescriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const message = document.getElementById('prescriptionMessage');
        if (response?.ok) {
            message.textContent = 'Prescrição salva com sucesso.';
            event.target.reset();
            // refresh prescriptions list
            const consultation = await fetchConsultation();
            const hist = consultation ? await fetchPatientHistory(consultation.patient_id) : null;
            renderPrescriptionsTable(hist?.prescriptions || []);
            return;
        }

        const data = response ? await response.json() : null;
        message.textContent = data?.message || 'Erro ao salvar prescrição.';
        message.classList.add('text-danger');
    });
}

if (document.getElementById('evolutionForm')) {
    document.getElementById('evolutionForm').addEventListener('submit', async event => {
        event.preventDefault();
        const payload = Object.fromEntries(new FormData(event.target).entries());

        const consultation = await fetchConsultation();
        if (!consultation) return;

        payload.consultation_id = consultationId;
        payload.patient_id = consultation.patient_id;

        const response = await apiFetch('/evolutions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const message = document.getElementById('evolutionMessage');
        if (response?.ok) {
            message.textContent = 'Evolução registrada com sucesso.';
            event.target.reset();
            loadEvolutions(consultation.patient_id);
            return;
        }

        const data = response ? await response.json() : null;
        message.textContent = data?.message || 'Erro ao salvar evolução.';
        message.classList.add('text-danger');
    });
}

if (document.getElementById('consultationEditForm')) {
    loadPatients('patientSelect');

    fetchConsultation().then(async consultation => {
        if (!consultation) return;

        populateConsultationForm(consultation);
        loadTriagesForPatient(consultation.patient_id);
        loadAnamnesesForPatient(consultation.patient_id);
        const backLink = document.getElementById('backLink');
        if (backLink) {
            backLink.href = `/consultations/${consultationId}`;
        }
    });

    const patientSelect = document.getElementById('patientSelect');
    if (patientSelect) {
        patientSelect.addEventListener('change', event => {
            loadTriagesForPatient(event.target.value);
            loadAnamnesesForPatient(event.target.value);
        });
    }

    document.getElementById('consultationEditForm').addEventListener('submit', async event => {
        event.preventDefault();
        const payload = Object.fromEntries(new FormData(event.target).entries());

        const response = await apiFetch(`/consultations/${consultationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response?.ok) {
            window.location = `/consultations/${consultationId}`;
            return;
        }

        const data = response ? await response.json() : null;
        alert(data?.message || 'Erro ao atualizar a consulta.');
    });
}
