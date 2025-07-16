import { fetchLeadsData } from "../API/nagashree";


export const fetchProspects = async () => {
  const prospects = await fetchLeadsData();
  console.log("prospects=", prospects);
  return prospects;
};


// export const prospects = [
//   {
//     id: 'p1',
//     name: 'Sarah Johnson',
//     company: 'Acme Corp',
//     date: '2024-06-01',
//     status: 'Completed',
//     initials: 'SJ',
//   },
//   {
//     id: 'p2',
//     name: 'Michael Chen',
//     company: 'Globex Inc',
//     date: '2024-06-02',
//     status: 'In Progress',
//     initials: 'MC',
//   },
//   {
//     id: 'p3',
//     name: 'David Rodriguez',
//     company: 'Initech',
//     date: '2024-06-03',
//     status: 'To Do',
//     initials: 'DR',
//   },
//   {
//     id: 'p4',
//     name: 'Priya Patel',
//     company: 'Umbrella Corp',
//     date: '2024-06-04',
//     status: 'Completed',
//     initials: 'PP',
//   },
//   {
//     id: 'p5',
//     name: 'Aisha Khan',
//     company: 'Wayne Enterprises',
//     date: '2024-06-05',
//     status: 'In Progress',
//     initials: 'AK',
//   },
// ]; 