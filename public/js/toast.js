function showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        const newContainer = document.createElement('div');
        newContainer.id = 'toastContainer';
        newContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            pointer-events: auto;
        `;
        document.body.appendChild(newContainer);
    }

    const typeStyles = {
        success: { bg: 'bg-success', icon: '✓' },
        danger: { bg: 'bg-danger', icon: '✕' },
        warning: { bg: 'bg-warning', icon: '⚠' },
        info: { bg: 'bg-info', icon: 'ℹ' }
    };

    const style = typeStyles[type] || typeStyles.info;

    const toast = document.createElement('div');
    toast.className = `alert alert-dismissible fade show ${style.bg} text-white`;
    toast.style.cssText = `
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: none;
        margin-bottom: 10px;
    `;
    toast.innerHTML = `
        <strong>${title}</strong>
        <div style="margin-top: 5px; font-size: 0.9rem;">${message}</div>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
    `;

    document.getElementById('toastContainer').appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}
