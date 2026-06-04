const usersTable = document.getElementById('usersTable');
const searchNameInput = document.getElementById('searchName');
const filterRoleSelect = document.getElementById('filterRole');
const btnSearch = document.getElementById('btnSearch');

let users = [];

if (!requireAdmin()) {
    throw new Error('Acesso restrito');
}

async function loadUsers() {
    try {
        const response = await apiFetch('/users');
        const data = await response.json();
        
        if (!response.ok) {
            showToast('Erro', data.error || 'Erro ao carregar usuários', 'danger');
            return;
        }
        
        users = data;
        renderTable();
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro', 'Erro ao carregar usuários', 'danger');
    }
}

function renderTable() {
    const searchName = searchNameInput.value.toLowerCase();
    const filterRole = filterRoleSelect.value;
    
    const filtered = users.filter(user => {
        const matchName = user.full_name.toLowerCase().includes(searchName);
        const matchRole = !filterRole || user.role_name === filterRole;
        return matchName && matchRole;
    });
    
    usersTable.innerHTML = filtered.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.full_name}</td>
            <td>${user.email}</td>
            <td>
                <span class="badge bg-info">${user.role_name}</span>
            </td>
            <td>
                <a href="/admin/users/${user.id}" class="btn btn-sm btn-info">Ver</a>
                <a href="/admin/users/${user.id}/edit" class="btn btn-sm btn-warning">Editar</a>
            </td>
        </tr>
    `).join('');
}

btnSearch.addEventListener('click', renderTable);
searchNameInput.addEventListener('keyup', renderTable);
filterRoleSelect.addEventListener('change', renderTable);

loadUsers();
