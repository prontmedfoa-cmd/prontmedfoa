const triageId = window.location.pathname.split('/').pop();

async function fetchTriage() {
    const response = await apiFetch(`/triages/${triageId}`);
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

async function loadRiskClassifications() {
    const select = document.getElementById('riskClassificationSelect');
    if (!select) return;

    const response = await apiFetch('/risk-classifications');
    const items = response ? await response.json() : [];

    select.innerHTML = '<option value="">Selecione a classificação</option>';
    items.forEach(item => {
        select.innerHTML += `
            <option value="${item.id}">${item.name} (${item.code})</option>
        `;
    });
}

function renderTriageDetails(triage) {
    const container = document.getElementById('triageDetails');
    if (!container) return;

    container.innerHTML = `
        <div class="card-body">
            <div class="row g-4">
                <div class="col-md-6">
                    <dl class="row mb-0">
                        <dt class="col-5 text-muted">Paciente</dt>
                        <dd class="col-7">${triage.patient_id}</dd>
                        <dt class="col-5 text-muted">Agendamento</dt>
                        <dd class="col-7">${triage.appointment_id || '—'}</dd>
                        <dt class="col-5 text-muted">Data</dt>
                        <dd class="col-7">${new Date(triage.created_at).toLocaleString('pt-BR')}</dd>
                        <dt class="col-5 text-muted">Classificação</dt>
                        <dd class="col-7">${triage.name || '—'} ${triage.code ? `(${triage.code})` : ''}</dd>
                        <dt class="col-5 text-muted">Prioridade</dt>
                        <dd class="col-7">${triage.priority || '—'}</dd>
                    </dl>
                </div>
                <div class="col-md-6">
                    <dl class="row mb-0">
                        <dt class="col-5 text-muted">Pressão</dt>
                        <dd class="col-7">${triage.blood_pressure || '—'}</dd>
                        <dt class="col-5 text-muted">Peso</dt>
                        <dd class="col-7">${triage.weight || '—'} kg</dd>
                        <dt class="col-5 text-muted">Altura</dt>
                        <dd class="col-7">${triage.height || '—'} m</dd>
                        <dt class="col-5 text-muted">IMC</dt>
                        <dd class="col-7">${triage.bmi || '—'}</dd>
                        <dt class="col-5 text-muted">Dor</dt>
                        <dd class="col-7">${triage.pain_scale || '—'}</dd>
                    </dl>
                </div>
                <div class="col-12">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <strong>Temperatura</strong>
                            <p>${triage.temperature || '—'} °C</p>
                        </div>
                        <div class="col-md-4">
                            <strong>FC</strong>
                            <p>${triage.heart_rate || '—'} BPM</p>
                        </div>
                        <div class="col-md-4">
                            <strong>FR</strong>
                            <p>${triage.respiratory_rate || '—'} rpm</p>
                        </div>
                        <div class="col-md-4">
                            <strong>Sat. O₂</strong>
                            <p>${triage.oxygen_saturation || '—'}%</p>
                        </div>
                        <div class="col-md-8">
                            <strong>Glicemia</strong>
                            <p>${triage.glucose_level || '—'} mg/dL</p>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <h5>Observações</h5>
                    <p class="mb-0">${triage.observations || 'Sem observações'}</p>
                </div>
                <div class="col-12">
                    <h5>Queixa Principal</h5>
                    <p class="mb-0">${triage.chief_complaint || 'Sem descrição'}</p>
                </div>
            </div>
        </div>
    `;

    const editLink = document.getElementById('editLink');
    if (editLink) {
        editLink.href = `/triages/${triageId}/edit`;
    }
}

async function populateTriageForm(triage) {
    const form = document.getElementById('triageEditForm');
    if (!form) return;

    const values = {
        patient_id: triage.patient_id,
        appointment_id: triage.appointment_id,
        risk_classification_id: triage.risk_classification_id,
        blood_pressure: triage.blood_pressure,
        glucose_level: triage.glucose_level,
        weight: triage.weight,
        height: triage.height,
        pain_scale: triage.pain_scale,
        temperature: triage.temperature,
        heart_rate: triage.heart_rate,
        respiratory_rate: triage.respiratory_rate,
        oxygen_saturation: triage.oxygen_saturation,
        chief_complaint: triage.chief_complaint,
        observations: triage.observations
    };

    Object.keys(values).forEach(name => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input) {
            input.value = values[name] ?? '';
        }
    });

    const patientSelect = document.getElementById('patientSelect');
    if (patientSelect) {
        patientSelect.value = triage.patient_id;
    }

    const riskSelect = document.getElementById('riskClassificationSelect');
    if (riskSelect) {
        riskSelect.value = triage.risk_classification_id;
    }
}

if (document.getElementById('triageDetails')) {
    fetchTriage().then(triage => {
        if (triage) {
            renderTriageDetails(triage);
        }
    });
}

if (document.getElementById('triageEditForm')) {
    loadPatients('patientSelect');
    loadRiskClassifications();

    fetchTriage().then(triage => {
        if (!triage) return;
        populateTriageForm(triage);
    });

    const backLink = document.getElementById('backLink');
    if (backLink) {
        backLink.href = `/triages/${triageId}`;
    }

    document.getElementById('triageEditForm').addEventListener('submit', async event => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const payload = Object.fromEntries(formData.entries());

        const response = await apiFetch(`/triages/${triageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response?.ok) {
            window.location = `/triages/${triageId}`;
            return;
        }

        const data = response ? await response.json() : null;
        alert(data?.message || 'Erro ao atualizar triagem.');
    });
}
