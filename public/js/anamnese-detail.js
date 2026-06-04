const anamneseId = window.location.pathname.split('/').pop();

async function fetchAnamnese() {
    const response = await apiFetch(`/anamneses/${anamneseId}`);
    if (!response || !response.ok) {
        return null;
    }
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

function renderAnamneseDetails(anamnese) {
    const container = document.getElementById('anamneseDetails');
    if (!container) return;

    container.innerHTML = `
        <div class="card-body">
            <div class="row g-4">
                <div class="col-md-6">
                    <dl class="row mb-0">
                        <dt class="col-5 text-muted">Paciente</dt>
                        <dd class="col-7">${anamnese.patient_id}</dd>
                        <dt class="col-5 text-muted">Consulta / Agendamento</dt>
                        <dd class="col-7">${anamnese.appointment_id || '—'}</dd>
                        <dt class="col-5 text-muted">Triagem</dt>
                        <dd class="col-7">${anamnese.triage_id || '—'}</dd>
                        <dt class="col-5 text-muted">Data</dt>
                        <dd class="col-7">${new Date(anamnese.created_at).toLocaleString('pt-BR')}</dd>
                        <dt class="col-5 text-muted">Médico</dt>
                        <dd class="col-7">${anamnese.doctor_name || '—'}</dd>
                    </dl>
                </div>
                <div class="col-md-6">
                    <dl class="row mb-0">
                        <dt class="col-5 text-muted">Queixa Principal</dt>
                        <dd class="col-7">${anamnese.chief_complaint || '—'}</dd>
                        <dt class="col-5 text-muted">Template</dt>
                        <dd class="col-7">${anamnese.template_name || '—'}</dd>
                        <dt class="col-5 text-muted">História Pessoal</dt>
                        <dd class="col-7">${anamnese.personal_history || '—'}</dd>
                    </dl>
                </div>
                <div class="col-12">
                    <h5>História da doença atual</h5>
                    <p>${anamnese.history_present_illness || 'Sem registro'}</p>
                </div>
                <div class="col-12">
                    <h5>Histórico familiar</h5>
                    <p>${anamnese.family_history || 'Sem registro'}</p>
                </div>
                <div class="col-12">
                    <h5>Medicações / Alergias</h5>
                    <p>${anamnese.medication_history || 'Sem registro'}<br>${anamnese.allergy_history || 'Sem registro'}</p>
                </div>
                <div class="col-12">
                    <h5>Revisão de sistemas</h5>
                    <p>${anamnese.review_of_systems || 'Sem registro'}</p>
                </div>
                <div class="col-12">
                    <h5>Observações</h5>
                    <p>${anamnese.observations || 'Sem observações'}</p>
                </div>
            </div>
        </div>
    `;

    const editLink = document.getElementById('editLink');
    if (editLink) {
        editLink.href = `/anamneses/${anamneseId}/edit`;
    }
}

function populateAnamneseForm(anamnese) {
    const form = document.getElementById('anamneseEditForm');
    if (!form) return;

    const values = {
        appointment_id: anamnese.appointment_id,
        triage_id: anamnese.triage_id,
        chief_complaint: anamnese.chief_complaint,
        history_present_illness: anamnese.history_present_illness,
        personal_history: anamnese.personal_history,
        family_history: anamnese.family_history,
        medication_history: anamnese.medication_history,
        allergy_history: anamnese.allergy_history,
        review_of_systems: anamnese.review_of_systems,
        observations: anamnese.observations
    };

    Object.keys(values).forEach(name => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input) {
            input.value = values[name] ?? '';
        }
    });

    const patientSelect = document.getElementById('patientSelect');
    if (patientSelect) {
        patientSelect.value = anamnese.patient_id;
    }

    const triageSelect = document.getElementById('triageSelect');
    if (triageSelect) {
        triageSelect.value = anamnese.triage_id || '';
    }
}

if (document.getElementById('anamneseDetails')) {
    fetchAnamnese().then(anamnese => {
        if (anamnese) {
            renderAnamneseDetails(anamnese);
        }
    });
}

if (document.getElementById('anamneseEditForm')) {
    loadPatients('patientSelect');

    fetchAnamnese().then(anamnese => {
        if (!anamnese) return;
        populateAnamneseForm(anamnese);
        loadTriagesForPatient(anamnese.patient_id);
    });

    const patientSelect = document.getElementById('patientSelect');
    if (patientSelect) {
        patientSelect.addEventListener('change', event => {
            loadTriagesForPatient(event.target.value);
        });
    }

    const backLink = document.getElementById('backLink');
    if (backLink) {
        backLink.href = `/anamneses/${anamneseId}`;
    }

    document.getElementById('anamneseEditForm').addEventListener('submit', async event => {
        event.preventDefault();
        const payload = Object.fromEntries(new FormData(event.target).entries());

        const response = await apiFetch(`/anamneses/${anamneseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response?.ok) {
            window.location = `/anamneses/${anamneseId}`;
            return;
        }

        const data = response ? await response.json() : null;
        alert(data?.message || 'Erro ao atualizar anamnese.');
    });
}
