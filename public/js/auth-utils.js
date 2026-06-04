function decodeToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Erro ao decodificar token:', error);
        return null;
    }
}

function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return decodeToken(token);
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role_name === 'ADMIN';
}

function requireAdmin() {
    if (!isAdmin()) {
        showToast('Acesso Restrito', 'Você não tem permissão para acessar esta página.', 'danger');
        setTimeout(() => {
            window.location = '/dashboard';
        }, 2000);
        return false;
    }
    return true;
}
