const BASE_URL = "http://10.80.4.51/api/method";
const login = "http://10.80.4.51/api/method/login";


export async function fetchLeadsData() {
    const login_response = await fetch(login, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usr: 'bala@noveloffice.com',
            pwd: 'sreeja.s@2002'
        })
    });
    const login_data = await login_response.json();
    console.log(login_data);
    const token = login_data.message.token;

    try {
        const response = await fetch(`${BASE_URL}/internal.api.Departments.bdm.prospects.prospects_api.get_prospect_details`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        return data.message || [];
    } catch (error) {
        console.error('Error fetching leads:', error);
        throw error;
    }
}

// Helper to get CSRF token from cookies
function getCSRFToken() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : '';
}

export async function fetchProspectJourneyDetails(prospectId: string) {
    const csrfToken = getCSRFToken();

    const login_response = await fetch(login, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
            usr: 'bala@noveloffice.com',
            pwd: 'sreeja.s@2002'
        }),
        credentials: 'include',
    });
    const login_data = await login_response.json();
    console.log(login_data);

    try {
        const response = await fetch(`${BASE_URL}/internal.api.Departments.bdm.prospects.prospects_api.get_prospect_journey_details`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Frappe-CSRF-Token': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify({ prospectId }),
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        return data.message || [];
    } catch (error) {
        console.error('Error fetching journey details:', error);
        throw error;
    }
}
