async function loadPatients() {
    const name = document.getElementById('searchName').value.trim();
    const cpf = document.getElementById('searchCpf').value.trim();
    const query = new URLSearchParams();

    if (name) query.append('name', name);
    if (cpf) query.append('cpf', cpf);

    const response = await apiFetch(`/patients?${query.toString()}`);
    const result = await response.json();

    const tbody = document.getElementById('patientsTable');
    tbody.innerHTML = '';

    if (!result.data || result.data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    Nenhum paciente encontrado.
                </td>
            </tr>
        `;
        return;
    }

    result.data.forEach(patient => {
        tbody.innerHTML += `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.full_name}</td>
                <td>${patient.cpf || '-'}</td>
                <td>
                    <a href="/patients/${patient.id}/record" class="btn btn-sm btn-info me-2">Prontuário</a>
                    <a href="/patients/${patient.id}/edit" class="btn btn-sm btn-warning">Editar</a>
                </td>
            </tr>
        `;
    });
}

const patientsTable = document.getElementById('patientsTable');
if (patientsTable) {
    loadPatients();
}

const btnSearch = document.getElementById('btnSearch');
if (btnSearch) {
    btnSearch.addEventListener('click', () => {
        loadPatients();
    });
}
