async function loadDashboard() {
    const response = await apiFetch('/patients');
    const result = await response.json();

    const totalPatients = document.getElementById('dashboardPatients');
    if (totalPatients && result.pagination) {
        totalPatients.textContent = result.pagination.total || 0;
    }
}

if (document.getElementById('dashboardPatients')) {
    loadDashboard();
}
