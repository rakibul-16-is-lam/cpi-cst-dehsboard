export const DASHBOARD_DATA = {
  stats: {
    totalStudents: 320,
    activeStudents: 280,
    newAdmissions: 45,
    alumni: 150,
  },
  attendance: [
    { name: 'Jan', value: 65 },
    { name: 'Feb', value: 75 },
    { name: 'Mar', value: 85 },
    { name: 'Apr', value: 92 },
  ],
  performance: [
    { name: 'Week 1', open: 3.40, close: 3.55, low: 3.32, high: 3.68 },
    { name: 'Week 2', open: 3.55, close: 3.68, low: 3.45, high: 3.75 },
    { name: 'Week 3', open: 3.68, close: 3.72, low: 3.62, high: 3.82 },
    { name: 'Week 4', open: 3.72, close: 3.85, low: 3.70, high: 3.92 },
  ],
  notices: [
    { id: 1, text: 'Class Suspension on 25 April', type: 'warning' },
    { id: 2, text: 'Project Submission Deadline: 30 April', type: 'info' },
    { id: 3, text: 'CR Meeting at 1 PM Today', type: 'urgent' },
    { id: 4, text: 'Annual Tech Fest Registration Open', type: 'info' },
    { id: 5, text: 'Lab Renovation starting Monday', type: 'warning' },
  ],
  events: [
    { name: 'Tech Seminar on 28 April', icon: 'BookOpen' },
    { name: 'Workshop on IOT', icon: 'Cpu' },
    { name: 'Cultural Fest Next Week', icon: 'Music' },
  ],
  projects: [
    'AI Robotics Project',
    'Startup: GreenTech Solutions',
    'IOT Smart Campus',
    'Hackathon: 1st Prize',
  ],
  admissionsTrend: [
    { name: '2020', count: 40 },
    { name: '2021', count: 55 },
    { name: '2022', count: 48 },
    { name: '2023', count: 70 },
    { name: '2024', count: 45 },
  ],
  skillsRadar: [
    { subject: 'Coding', A: 120, fullMark: 150 },
    { subject: 'Math', A: 98, fullMark: 150 },
    { subject: 'IoT', A: 86, fullMark: 150 },
    { subject: 'Robotics', A: 99, fullMark: 150 },
    { subject: 'AI', A: 85, fullMark: 150 },
  ],
  studentDistribution: [
    { name: '1st Year', value: 80, color: '#3b82f6' },
    { name: '2nd Year', value: 70, color: '#10b981' },
    { name: '3rd Year', value: 90, color: '#f59e0b' },
    { name: '4th Year', value: 80, color: '#8b5cf6' },
  ],
  leaderboard: [
    { rank: 1, name: 'Sadia Islam', score: 3.98, id: 'CST-502', avatar: 'SI' },
    { rank: 2, name: 'Ali Hossain', score: 3.92, id: 'CST-505', avatar: 'AH' },
    { rank: 3, name: 'Nusrat Jahan', score: 3.88, id: 'CST-512', avatar: 'NJ' },
    { rank: 4, name: 'Tanvir Ahmed', score: 3.82, id: 'CST-520', avatar: 'TA' },
    { rank: 5, name: 'Fahim Faisal', score: 3.75, id: 'CST-525', avatar: 'FF' },
  ],
  faculty: {
    head: 'Prof. Kamal Uddin',
    email: 'cst@cpi.ac.bd',
    office: 'Room 203',
  }
};
