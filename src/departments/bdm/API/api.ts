// src/departments/bdm/API/api.ts
// Centralized API functions for BDM module

// Base URL for your backend API (update as needed)
const BASE_URL = "http://10.80.4.51/api/method";

const login = "http://10.80.4.51/api/method/login";



// Fetch the first 5 leads from the backend
export async function fetchLeadsData() {
  // const login_response = await fetch(login, {
  //   method: 'POST',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',
  // },
  //   body: JSON.stringify({
  //     usr: 'bala@noveloffice.com',
  //     pwd: 'sreeja.s@2002'
  //   })
  // });
  // const login_data = await login_response.json();
  // console.log(login_data);
  // const token = login_data.message.token;

  try {
    const response = await fetch(`${BASE_URL}/internal.api.Departments.bdm.leads.get_leads`, {
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
// export async function fetchLeadById(leadId: string) {
//   try {
//     const response = await fetch(`${BASE_URL}/get_leads_data_by_id?lead_id=${encodeURIComponent(leadId)}`, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//       },
//     });
//     if (!response.ok) {
//       throw new Error(`Server error: ${response.status}`);
//     }
//     const data = await response.json();
//     return data.message || null;
//   } catch (error) {
//     console.error('Error fetching lead by ID:', error);
//     throw error;
//   }
// }


// Add more API functions as needed...

