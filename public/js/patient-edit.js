const patientId = window.location.pathname.split('/')[2];
const patientEditForm = document.getElementById('patientEditForm');

async function loadPatient() {
    const response = await apiFetch(`/patients/${patientId}`);
    const patient = await response.json();

    if (!patient) {
        alert('Paciente não encontrado');
        return;
    }

    patientEditForm.full_name.value = patient.full_name || '';
    patientEditForm.cpf.value = patient.cpf || '';
    patientEditForm.phone.value = patient.phone || '';
    patientEditForm.email.value = patient.email || '';
    patientEditForm.blood_type.value = patient.blood_type || '';
    patientEditForm.allergies.value = patient.allergies || '';
    patientEditForm.address_street.value = patient.address_street || '';
    patientEditForm.address_number.value = patient.address_number || '';
    patientEditForm.address_complement.value = patient.address_complement || '';
    patientEditForm.address_district.value = patient.address_district || '';
    patientEditForm.address_zipcode.value = patient.address_zipcode || '';
}

if (patientEditForm) {
    loadPatient();

    patientEditForm.addEventListener('submit', async e => {
        e.preventDefault();

        const payload = {
            full_name: patientEditForm.full_name.value,
            phone: patientEditForm.phone.value,
            email: patientEditForm.email.value,
            blood_type: patientEditForm.blood_type.value,
            allergies: patientEditForm.allergies.value,
            address_street: patientEditForm.address_street.value,
            address_number: patientEditForm.address_number.value,
            address_complement: patientEditForm.address_complement.value,
            address_district: patientEditForm.address_district.value,
            address_zipcode: patientEditForm.address_zipcode.value
        };

        const response = await apiFetch(`/patients/${patientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            window.location = '/patients';
            return;
        }

        const data = await response.json();
        alert(data.message || 'Erro ao atualizar o paciente');
    });
}
