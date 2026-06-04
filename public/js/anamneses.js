async function loadPatientsForAnamnese() {
    const select = document.getElementById('patientSelect');
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
    const tbody = document.getElementById('anamnesesTable');
    if (!tbody) return;

    if (!patientId) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">Selecione um paciente para ver as anamneses.</td>
            </tr>
        `;
        return;
    }

    const response = await apiFetch(`/anamneses/patient/${patientId}`);
    const anamneses = response ? await response.json() : [];
    tbody.innerHTML = '';

    if (!anamneses || anamneses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">Nenhuma anamnese encontrada.</td>
            </tr>
        `;
        return;
    }

    anamneses.forEach(anamnese => {
        tbody.innerHTML += `
            <tr>
                <td>${anamnese.id}</td>
                <td>${anamnese.patient_id}</td>
                <td>${new Date(anamnese.created_at).toLocaleDateString('pt-BR')}</td>
                <td>${anamnese.chief_complaint || '—'}</td>
                <td>${anamnese.history_present_illness || '—'}</td>
            </tr>
        `;
    });
}

const patientSelect = document.getElementById('patientSelect');
if (patientSelect) {
    loadPatientsForAnamnese();
    patientSelect.addEventListener('change', event => {
        const patientId = event.target.value;
        loadTriagesForPatient(patientId);
    });
}

const btnLoadAnamneses = document.getElementById('btnLoadAnamneses');
if (btnLoadAnamneses) {
    btnLoadAnamneses.addEventListener('click', () => {
        const patientId = patientSelect?.value;
        if (!patientId) {
            alert('Escolha um paciente para buscar anamneses.');
            return;
        }
        loadAnamnesesForPatient(patientId);
    });
}

const anamneseForm = document.getElementById('anamneseForm');
if (anamneseForm) {
    loadPatientsForAnamnese();
    anamneseForm.patient_id?.addEventListener('change', event => {
        loadTriagesForPatient(event.target.value);
    });

    anamneseForm.addEventListener('submit', async event => {
        event.preventDefault();
        const formData = new FormData(anamneseForm);
        const payload = Object.fromEntries(formData.entries());

        const response = await apiFetch('/anamneses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response?.ok) {
            alert('Anamnese registrada com sucesso.');
            window.location = '/anamneses';
            return;
        }

        const data = response ? await response.json() : null;
        alert(data?.message || 'Erro ao salvar a anamnese.');
    });
}
