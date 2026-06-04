if (!requireAdmin()) {
    throw new Error('Acesso restrito');
}

const userSummary = document.getElementById('userSummary');
const editLink = document.getElementById('editLink');
const userId = window.location.pathname.split('/')[4];

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
        
        renderUserDetails(user);
        editLink.href = `/admin/users/${user.id}/edit`;
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro', 'Erro ao carregar usuário', 'danger');
    }
}

function renderUserDetails(user) {
    userSummary.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <h5 class="mb-3">Informações Pessoais</h5>
                <p><strong>Nome:</strong> ${user.full_name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>CPF:</strong> ${user.cpf || 'N/A'}</p>
                <p><strong>Role:</strong> <span class="badge bg-info">${user.role_name}</span></p>
                <p><strong>Status:</strong> ${user.active ? '<span class="badge bg-success">Ativo</span>' : '<span class="badge bg-danger">Inativo</span>'}</p>
            </div>
        </div>
    `;
}

loadUser();
