if (!requireAdmin()) {
    throw new Error('Acesso restrito');
}

const form = document.getElementById('userForm');
const btnDelete = document.getElementById('btnDelete');
const userId = new URLSearchParams(window.location.search).get('id') || window.location.pathname.split('/')[4];

async function loadUser() {
    try {
        const response = await apiFetch(`/users/${userId}`);
        const user = await response.json();
        
        if (!response.ok) {
            showToast('Erro', user.error || 'Erro ao carregar usuário', 'danger');
            setTimeout(() => {
                window.location = '/admin/users';
            }, 1500);
            return;
        }
        
        form.querySelector('[name="full_name"]').value = user.full_name || '';
        form.querySelector('[name="email"]').value = user.email || '';
        form.querySelector('[name="cpf"]').value = user.cpf || '';
        form.querySelector('[name="role_id"]').value = user.role_id || '';
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro', 'Erro ao carregar usuário', 'danger');
    }
}

if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();
        
        const full_name = form.querySelector('[name="full_name"]').value;
        const email = form.querySelector('[name="email"]').value;
        const cpf = form.querySelector('[name="cpf"]').value;
        const role_id = form.querySelector('[name="role_id"]').value;
        
        try {
            const response = await apiFetch(`/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name,
                    email,
                    cpf,
                    role_id: parseInt(role_id)
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                showToast('Erro', data.message || 'Erro ao atualizar usuário', 'danger');
                return;
            }
            
            showToast('Sucesso', 'Usuário atualizado com sucesso!', 'success');
            setTimeout(() => {
                window.location = '/admin/users';
            }, 1500);
        } catch (error) {
            console.error('Erro:', error);
            showToast('Erro', 'Erro ao atualizar usuário', 'danger');
        }
    });
}

if (btnDelete) {
    btnDelete.addEventListener('click', async () => {
        if (!confirm('Tem certeza que deseja remover este usuário?')) {
            return;
        }
        
        try {
            const response = await apiFetch(`/users/${userId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const data = await response.json();
                showToast('Erro', data.error || 'Erro ao remover usuário', 'danger');
                return;
            }
            
            showToast('Sucesso', 'Usuário removido com sucesso!', 'success');
            setTimeout(() => {
                window.location = '/admin/users';
            }, 1500);
        } catch (error) {
            console.error('Erro:', error);
            showToast('Erro', 'Erro ao remover usuário', 'danger');
        }
    });
}

loadUser();
