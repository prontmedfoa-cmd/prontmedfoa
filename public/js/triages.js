async function fetchPatients() {
    const response = await apiFetch('/patients?limit=100');
    const result = response ? await response.json() : null;
    return result?.data || [];
}

async function fetchRiskClassifications() {
    const response = await apiFetch('/risk-classifications');
    return response ? await response.json() : [];
}

function renderTriages(triages) {
    const tbody = document.getElementById('triagesTable');
    tbody.innerHTML = '';

    if (!triages || triages.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">Nenhuma triagem encontrada.</td>
            </tr>
        `;
        return;
    }

    triages.forEach(triage => {
        tbody.innerHTML += `
            <tr>
                <td>${triage.id}</td>
                <td>${triage.patient_id}</td>
                <td>${new Date(triage.created_at).toLocaleDateString('pt-BR')}</td>
                <td>${triage.code || '—'}</td>
                <td>${triage.blood_pressure || '—'}</td>
                <td>${triage.weight || '—'}</td>
                <td>${triage.height || '—'}</td>
            </tr>
        `;
    });
}

async function loadPatients(selectElementId) {
    const select = document.getElementById(selectElementId);
    if (!select) return;

    const patients = await fetchPatients();
    select.innerHTML = '<option value="">Selecione um paciente</option>';

    patients.forEach(patient => {
        select.innerHTML += `
            <option value="${patient.id}">${patient.full_name} (${patient.cpf || 'sem CPF'})</option>
        `;
    });
}

async function loadRiskClassifications() {
    const classificationSelect = document.getElementById('riskClassificationSelect');
    if (!classificationSelect) return;

    const classifications = await fetchRiskClassifications();
    classificationSelect.innerHTML = '<option value="">Selecione a classificação</option>';

    classifications.forEach(item => {
        classificationSelect.innerHTML += `
            <option value="${item.id}">${item.name} (${item.code})</option>
        `;
    });
}

async function loadTriagesForPatient(patientId) {
    if (!patientId) return renderTriages([]);
    const response = await apiFetch(`/triages/patient/${patientId}`);
    const data = response ? await response.json() : [];
    renderTriages(data);
}

const patientSelect = document.getElementById('patientSelect');
if (patientSelect) {
    loadPatients('patientSelect');
}

const btnLoadTriages = document.getElementById('btnLoadTriages');
if (btnLoadTriages) {
    btnLoadTriages.addEventListener('click', () => {
        const patientId = patientSelect.value;
        if (!patientId) {
            alert('Escolha um paciente para buscar triagens.');
            return;
        }
        loadTriagesForPatient(patientId);
    });
}

if (document.getElementById('triageForm')) {
    loadPatients('patientSelect');
    loadRiskClassifications();

    document.getElementById('triageForm').addEventListener('submit', async event => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        const response = await apiFetch('/triages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response?.ok) {
            alert('Triagem registrada com sucesso.');
            window.location = '/triages';
            return;
        }

        const data = response ? await response.json() : null;
        alert(data?.message || 'Erro ao registrar triagem.');
    });
}
