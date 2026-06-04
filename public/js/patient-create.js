const patientForm = document.getElementById('patientForm');

if (patientForm) {
    patientForm.addEventListener('submit', async e => {
        e.preventDefault();

        const payload = {
            full_name: patientForm.full_name.value,
            cpf: patientForm.cpf.value,
            birth_date: patientForm.birth_date.value,
            phone: patientForm.phone.value,
            email: patientForm.email.value,
            blood_type: patientForm.blood_type.value,
            allergies: patientForm.allergies.value
        };

        const response = await apiFetch('/patients', {
            method: 'POST',
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
        alert(data.message || 'Erro ao salvar o paciente');
    });
}
