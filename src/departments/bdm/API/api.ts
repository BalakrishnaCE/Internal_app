// src/departments/bdm/API/api.ts
// Centralized API functions for BDM module

const BASE_URL = "http://10.80.4.51/api/method";
const login = `${BASE_URL}/login`;

// Helper to get CSRF token from cookies
function getCSRFToken() {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : '';
}

// Login and fetch initial leads
export async function fetchLeadsData() {
  const login_response = await fetch(login, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include', // ✅ Required for CSRF cookie
    body: JSON.stringify({
      usr: 'bala@noveloffice.com',
      pwd: 'sreeja.s@2002',
    })
  });

  const login_data = await login_response.json();
  // console.log("Login data:", login_data);

  try {
    const response = await fetch(`${BASE_URL}/internal.api.Departments.bdm.visiting_leads.get_leads`, {
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

// Fetch a single lead by ID
export async function fetchLeadById(leadId: string) {
  try {
    const response = await fetch(`${BASE_URL}/internal.api.Departments.bdm.visiting_leads.get_leads_by_id?lead_id=${encodeURIComponent(leadId)}`, {
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
    return data.message || null;
  } catch (error) {
    console.error('Error fetching lead by ID:', error);
    throw error;
  }
}

// Claim a lead
export async function claimLeadAPI({
  leadId,
  visit_location1,
  pre_sales_assigned,
  officeType,
  date_and_time_of_visit,
  claimed_by,
}: {
  leadId: string;
  visit_location1: string;
  pre_sales_assigned: string;
  officeType: string;
  date_and_time_of_visit: string;
  claimed_by: string;
}) {
  const visitDate = new Date(date_and_time_of_visit);
  const formattedVisitDate = visitDate.toISOString().split('T')[0];

  const childFieldsDict = JSON.stringify({
    location: visit_location1 || '',
    date: formattedVisitDate || '',
    sm_name1: pre_sales_assigned || '',
    visit_taken_by: claimed_by,
  });

  try {
    const response = await fetch(
      `${BASE_URL}/internal.api.Departments.bdm.visiting_leads.claim_lead`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Frappe-CSRF-Token': getCSRFToken(), // ✅ CSRF Header
        },
        credentials: 'include',
        body: new URLSearchParams({
          lead_id: leadId,
          pre_sales: pre_sales_assigned,
          claimed_by,
          child_fields_dict: childFieldsDict,
          officeType: officeType,
        }).toString(),
      }
    );

    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  } catch (error) {
    console.error('Error claiming lead:', error);
    throw error;
  }
}

// Remove a lead
export async function removeLeadAPI(leadId: string, removed_by: string) {
  try {
    const response = await fetch(`${BASE_URL}/internal.api.Departments.bdm.visiting_leads.remove_lead`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Frappe-CSRF-Token': getCSRFToken(), 
      },
      credentials: 'include',
      body: new URLSearchParams({
        lead_id: leadId,
        removed_by: removed_by,
      }).toString(),
    });

    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  } catch (error) {
    console.error('Error removing lead:', error);
    throw error;
  }
}
