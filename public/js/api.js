const API_BASE =
    '/api';

async function apiFetch(

    endpoint,

    options = {}

) {

    const token =
        localStorage.getItem(
            'token'
        );

    options.headers = {

        ...options.headers,

        Authorization:
            token
                ? `Bearer ${token}`
                : ''

    };

    const response =
        await fetch(

            API_BASE + endpoint,

            options

        );

    if (
        response.status === 401
    ) {

        localStorage.removeItem(
            'token'
        );

        window.location =
            '/login';

        return;
    }

    return response;
}