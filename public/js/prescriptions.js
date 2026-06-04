async function fetchPatientsForPrescriptions() {
    const select = document.getElementById('patientSelect');
    if (!select) return;

    const response = await apiFetch('/patients?limit=200');
    const result = response ? await response.json() : null;
    const patients = result?.data || [];

    select.innerHTML = '<option value="">Selecione um paciente</option>';
    patients.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.full_name} (${p.cpf || 'sem CPF'})</option>`;
    });
}

async function loadPrescriptionsForPatient(patientId) {
    const tbody = document.getElementById('prescriptionsTable');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!patientId) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">Selecione um paciente para ver prescrições.</td></tr>`;
        return;
    }

    const response = await apiFetch(`/patients/${patientId}/history`);
    const data = response ? await response.json() : null;
    const prescriptions = data?.prescriptions || [];

    if (!prescriptions || prescriptions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">Nenhuma prescrição encontrada.</td></tr>`;
        return;
    }

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

const presPatientSelect = document.getElementById('patientSelect');
if (presPatientSelect) {
    fetchPatientsForPrescriptions();
}

const btnLoadPrescriptions = document.getElementById('btnLoadPrescriptions');
if (btnLoadPrescriptions) {
    btnLoadPrescriptions.addEventListener('click', () => {
        const patientId = presPatientSelect?.value;
        if (!patientId) {
            alert('Escolha um paciente para buscar prescrições.');
            return;
        }
        loadPrescriptionsForPatient(patientId);
    });
}
