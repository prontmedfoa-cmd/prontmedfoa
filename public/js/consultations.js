async function loadPatientsForConsultation() {
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

async function loadConsultationsForPatient(patientId) {
    const tbody = document.getElementById('consultationsTable');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!patientId) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">Selecione um paciente para visualizar consultas.</td>
            </tr>
        `;
        return;
    }

    const response = await apiFetch(`/consultations/patient/${patientId}`);
    const consultations = response ? await response.json() : [];

    if (!consultations || consultations.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">Nenhuma consulta encontrada.</td>
            </tr>
        `;
        return;
    }

    consultations.forEach(consultation => {
        tbody.innerHTML += `
            <tr>
                <td>${consultation.id}</td>
                <td>${consultation.patient_id}</td>
                <td>${new Date(consultation.created_at).toLocaleDateString('pt-BR')}</td>
                <td>${consultation.diagnosis || '—'}</td>
                <td>${consultation.doctor_name || '—'}</td>
                <td>${consultation.consultation_status || '—'}</td>
            </tr>
        `;
    });
}

const patientSelect = document.getElementById('patientSelect');
if (patientSelect) {
    loadPatientsForConsultation();
    patientSelect.addEventListener('change', event => {
        const patientId = event.target.value;
        loadTriagesForPatient(patientId);
        loadAnamnesesForPatient(patientId);
    });
}

const btnLoadConsultations = document.getElementById('btnLoadConsultations');
if (btnLoadConsultations) {
    btnLoadConsultations.addEventListener('click', () => {
        const patientId = patientSelect?.value;
        if (!patientId) {
            alert('Escolha um paciente para buscar consultas.');
            return;
        }
        loadConsultationsForPatient(patientId);
    });
}

const consultationForm = document.getElementById('consultationForm');
if (consultationForm) {
    loadPatientsForConsultation();
    consultationForm.patient_id?.addEventListener('change', event => {
        const patientId = event.target.value;
        loadTriagesForPatient(patientId);
        loadAnamnesesForPatient(patientId);
    });

    const btnSaveAndPrescribe = document.getElementById('btnSaveAndPrescribe');
    const btnSaveAndEvolve = document.getElementById('btnSaveAndEvolve');

    if (btnSaveAndPrescribe) {
        btnSaveAndPrescribe.addEventListener('click', () => {
            document.getElementById('quickFlowInput').value = 'prescription';
            consultationForm.requestSubmit();
        });
    }

    if (btnSaveAndEvolve) {
        btnSaveAndEvolve.addEventListener('click', () => {
            document.getElementById('quickFlowInput').value = 'evolution';
            consultationForm.requestSubmit();
        });
    }

    consultationForm.addEventListener('submit', async event => {
        event.preventDefault();
        const formData = new FormData(consultationForm);
        const payload = Object.fromEntries(formData.entries());

        const quick = payload.quick_flow || '';
        delete payload.quick_flow;

        const response = await apiFetch('/consultations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response?.ok) {
            const data = await response.json();
            const id = data.id || data.ID || '';
            if (quick && id) {
                const open = quick === 'prescription' ? 'prescription' : 'evolution';
                window.location = `/consultations/${id}?open=${open}`;
                return;
            }

            alert('Consulta registrada com sucesso.');
            window.location = '/consultations';
            return;
        }

        const data = response ? await response.json() : null;
        alert(data?.message || 'Erro ao salvar a consulta.');
    });
}
