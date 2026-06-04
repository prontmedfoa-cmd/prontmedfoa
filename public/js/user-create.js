if (!requireAdmin()) {
    throw new Error('Acesso restrito');
}

const form = document.getElementById('userForm');

if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();
        
        const full_name = form.querySelector('[name="full_name"]').value;
        const email = form.querySelector('[name="email"]').value;
        const cpf = form.querySelector('[name="cpf"]').value;
        const role_id = form.querySelector('[name="role_id"]').value;
        const password = form.querySelector('[name="password"]').value;
        const password_confirm = form.querySelector('[name="password_confirm"]').value;
        
        if (password !== password_confirm) {
            showToast('Validação', 'As senhas não correspondem', 'warning');
            return;
        }
        
        try {
            const response = await apiFetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name,
                    email,
                    cpf,
                    role_id: parseInt(role_id),
                    password
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                showToast('Erro', data.message || 'Erro ao criar usuário', 'danger');
                return;
            }
            
            showToast('Sucesso', 'Usuário criado com sucesso!', 'success');
            setTimeout(() => {
                window.location = '/admin/users';
            }, 1500);
        } catch (error) {
            console.error('Erro:', error);
            showToast('Erro', 'Erro ao criar usuário', 'danger');
        }
    });
}
