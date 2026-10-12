const RAW_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = RAW_URL 
  ? (RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`) 
  : '/api';


// Initial Demo Seed Data for instant testing
export const INITIAL_DEPARTMENTS = [
  { id: 1, name: 'Electrical Maintenance', contactPerson: 'Mr. R. Kumar' },
  { id: 2, name: 'Plumbing & Civil', contactPerson: 'Mr. S. Iyer' },
  { id: 3, name: 'IT / Network Support', contactPerson: 'Ms. A. Rao' },
  { id: 4, name: 'Housekeeping', contactPerson: 'Mrs. P. Nair' },
  { id: 5, name: 'Carpentry & Furniture', contactPerson: 'Mr. D. Singh' },
  { id: 6, name: 'Laboratory Services', contactPerson: 'Dr. M. Verma' },
];

export const CATEGORIES = [
  'ELECTRICAL',
  'PLUMBING',
  'WIFI_NETWORK',
  'FURNITURE',
  'CLEANLINESS',
  'CLASSROOM_LAB_EQUIPMENT',
  'OTHER'
];

export const STATUSES = [
  'SUBMITTED',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED'
];

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

// In-Memory fallback store
let localComplaints = [
  {
    id: 101,
    studentId: 2,
    studentName: 'Aarav Sharma',
    studentRollNo: 'CS21B1042',
    studentEmail: 'aarav.sharma@fixmycampus.edu',
    category: 'ELECTRICAL',
    location: 'Block B, 3rd Floor, Room 304',
    description: 'Ceiling projector flickers continuously and power outlet sparking during lectures.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    imagePath: null,
    departmentId: 1,
    departmentName: 'Electrical Maintenance',
    dateReported: new Date(Date.now() - 3600000 * 24).toISOString(),
    history: [
      { id: 1, status: 'SUBMITTED', changedByName: 'Aarav Sharma', changedByRole: 'STUDENT', remarks: 'Issue filed with photo evidence.', updatedOn: new Date(Date.now() - 3600000 * 24).toISOString() },
      { id: 2, status: 'ASSIGNED', changedByName: 'Campus Admin', changedByRole: 'ADMIN', remarks: 'Assigned to Electrical Maintenance team.', updatedOn: new Date(Date.now() - 3600000 * 18).toISOString() },
      { id: 3, status: 'IN_PROGRESS', changedByName: 'Electrical Maintenance Staff', changedByRole: 'DEPARTMENT_STAFF', remarks: 'Technician Mr. Kumar dispatched with replacement ballast and wiring check.', updatedOn: new Date(Date.now() - 3600000 * 6).toISOString() }
    ]
  },
  {
    id: 102,
    studentId: 2,
    studentName: 'Aarav Sharma',
    studentRollNo: 'CS21B1042',
    studentEmail: 'aarav.sharma@fixmycampus.edu',
    category: 'PLUMBING',
    location: 'Central Library Restroom - 2nd Floor',
    description: 'Severe pipe leakage under washbasin causing water accumulation on floor.',
    priority: 'URGENT',
    status: 'ASSIGNED',
    imagePath: null,
    departmentId: 2,
    departmentName: 'Plumbing & Civil',
    dateReported: new Date(Date.now() - 3600000 * 12).toISOString(),
    history: [
      { id: 4, status: 'SUBMITTED', changedByName: 'Aarav Sharma', changedByRole: 'STUDENT', remarks: 'Reported water leakage hazard.', updatedOn: new Date(Date.now() - 3600000 * 12).toISOString() },
      { id: 5, status: 'ASSIGNED', changedByName: 'Campus Admin', changedByRole: 'ADMIN', remarks: 'Priority elevated to URGENT. Assigned to Plumbing team.', updatedOn: new Date(Date.now() - 3600000 * 8).toISOString() }
    ]
  },
  {
    id: 103,
    studentId: 3,
    studentName: 'Priya Patel',
    studentRollNo: 'EC22B0089',
    studentEmail: 'priya.patel@fixmycampus.edu',
    category: 'WIFI_NETWORK',
    location: 'Girls Hostel 4 - Common Study Hall',
    description: 'Hostel Wi-Fi AP-04 is completely offline; authentication timeout for all residents.',
    priority: 'HIGH',
    status: 'RESOLVED',
    imagePath: null,
    departmentId: 3,
    departmentName: 'IT / Network Support',
    dateReported: new Date(Date.now() - 3600000 * 48).toISOString(),
    history: [
      { id: 6, status: 'SUBMITTED', changedByName: 'Priya Patel', changedByRole: 'STUDENT', remarks: 'Wi-Fi AP dead.', updatedOn: new Date(Date.now() - 3600000 * 48).toISOString() },
      { id: 7, status: 'ASSIGNED', changedByName: 'Campus Admin', changedByRole: 'ADMIN', remarks: 'Assigned to IT Network team.', updatedOn: new Date(Date.now() - 3600000 * 36).toISOString() },
      { id: 8, status: 'IN_PROGRESS', changedByName: 'IT Support Staff', changedByRole: 'DEPARTMENT_STAFF', remarks: 'Switch port rebooted, PoE injector replaced.', updatedOn: new Date(Date.now() - 3600000 * 20).toISOString() },
      { id: 9, status: 'RESOLVED', changedByName: 'IT Support Staff', changedByRole: 'DEPARTMENT_STAFF', remarks: 'Access point restored and 100Mbps uplink verified.', updatedOn: new Date(Date.now() - 3600000 * 8).toISOString() }
    ]
  },
  {
    id: 104,
    studentId: 4,
    studentName: 'Rohan Mehra',
    studentRollNo: 'ME21B0512',
    studentEmail: 'rohan.mehra@fixmycampus.edu',
    category: 'FURNITURE',
    location: 'Mechanical Eng Workshop Room 102',
    description: 'Three drafting tables have broken height adjustment knobs and loose metal legs.',
    priority: 'MEDIUM',
    status: 'SUBMITTED',
    imagePath: null,
    departmentId: null,
    departmentName: 'Unassigned',
    dateReported: new Date(Date.now() - 3600000 * 4).toISOString(),
    history: [
      { id: 10, status: 'SUBMITTED', changedByName: 'Rohan Mehra', changedByRole: 'STUDENT', remarks: 'Tables need repair before next drafting lab.', updatedOn: new Date(Date.now() - 3600000 * 4).toISOString() }
    ]
  }
];

let nextComplaintId = 105;
let nextLogId = 20;

export const apiService = {
  // Test connection to backend
  async checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE}/meta`, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getMetadata() {
    try {
      const res = await fetch(`${API_BASE}/meta`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend unavailable, using fallback metadata');
    }
    return {
      categories: CATEGORIES,
      statuses: STATUSES,
      priorities: PRIORITIES,
      departments: INITIAL_DEPARTMENTS
    };
  },

  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend login fallback');
    }

    // Fallback Mock Users
    const lowerEmail = email.toLowerCase().trim();
    if (lowerEmail === 'admin@fixmycampus.edu' && password === 'admin123') {
      return {
        success: true,
        user: { id: 1, name: 'Campus Admin', email: 'admin@fixmycampus.edu', role: 'ADMIN', departmentId: null }
      };
    }
    if (lowerEmail === 'electrical@fixmycampus.edu' && password === 'dept123') {
      return {
        success: true,
        user: { id: 10, name: 'Electrical Maintenance Staff', email: 'electrical@fixmycampus.edu', role: 'DEPARTMENT_STAFF', departmentId: 1, departmentName: 'Electrical Maintenance' }
      };
    }
    if (lowerEmail.includes('student') || password === 'student123' || lowerEmail.includes('@')) {
      return {
        success: true,
        user: { id: 2, name: email.split('@')[0], rollNo: 'CS21B1042', email: email, role: 'STUDENT', departmentId: null }
      };
    }

    return { success: false, message: 'Invalid credentials. Try admin@fixmycampus.edu / admin123 or electrical@fixmycampus.edu / dept123' };
  },

  async register(data) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend register fallback');
    }

    return {
      success: true,
      message: 'Student account registered.',
      user: {
        id: Math.floor(Math.random() * 900) + 100,
        name: data.name,
        rollNo: data.rollNo,
        email: data.email,
        phone: data.phone,
        role: 'STUDENT'
      }
    };
  },

  async getComplaints(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.studentId) params.append('studentId', filters.studentId);
      if (filters.deptId) params.append('deptId', filters.deptId);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.keyword) params.append('keyword', filters.keyword);

      const res = await fetch(`${API_BASE}/complaints?${params.toString()}`, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend complaints fetch fallback');
    }

    // Filter local fallback list
    let list = [...localComplaints];
    if (filters.studentId) {
      list = list.filter(c => c.studentId === Number(filters.studentId));
    }
    if (filters.deptId) {
      list = list.filter(c => c.departmentId === Number(filters.deptId));
    }
    if (filters.category) {
      list = list.filter(c => c.category === filters.category);
    }
    if (filters.status) {
      list = list.filter(c => c.status === filters.status);
    }
    if (filters.priority) {
      list = list.filter(c => c.priority === filters.priority);
    }
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      list = list.filter(c => 
        (c.location && c.location.toLowerCase().includes(kw)) ||
        (c.description && c.description.toLowerCase().includes(kw)) ||
        (c.studentName && c.studentName.toLowerCase().includes(kw))
      );
    }
    return list;
  },

  async getComplaintDetails(id) {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}`, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend complaint detail fallback');
    }

    const complaint = localComplaints.find(c => c.id === Number(id));
    if (!complaint) return null;
    return {
      complaint,
      history: complaint.history || []
    };
  },

  async createComplaint({ studentId, studentName, studentRollNo, studentEmail, category, location, description, priority, file }) {
    try {
      if (file) {
        const formData = new FormData();
        formData.append('studentId', studentId);
        formData.append('category', category);
        formData.append('location', location);
        formData.append('description', description);
        formData.append('priority', priority || 'MEDIUM');
        formData.append('evidence', file);

        const res = await fetch(`${API_BASE}/complaints`, {
          method: 'POST',
          body: formData,
          signal: AbortSignal.timeout(5000)
        });
        if (res.ok) return await res.json();
      } else {
        const res = await fetch(`${API_BASE}/complaints/json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, category, location, description, priority }),
          signal: AbortSignal.timeout(4000)
        });
        if (res.ok) return await res.json();
      }
    } catch (e) {
      console.warn('Backend complaint create fallback');
    }

    // Local in-memory creation
    const newId = nextComplaintId++;
    const now = new Date().toISOString();
    const newComplaint = {
      id: newId,
      studentId: studentId || 2,
      studentName: studentName || 'Demo Student',
      studentRollNo: studentRollNo || 'CS21B1042',
      studentEmail: studentEmail || 'student@fixmycampus.edu',
      category,
      location,
      description,
      priority: priority || 'MEDIUM',
      status: 'SUBMITTED',
      imagePath: file ? URL.createObjectURL(file) : null,
      departmentId: null,
      departmentName: 'Unassigned',
      dateReported: now,
      history: [
        {
          id: nextLogId++,
          status: 'SUBMITTED',
          changedByName: studentName || 'Student',
          changedByRole: 'STUDENT',
          remarks: 'Complaint reported with initial details.',
          updatedOn: now
        }
      ]
    };

    localComplaints.unshift(newComplaint);
    return { success: true, complaint: newComplaint };
  },

  async assignDepartment(complaintId, departmentId, adminUser) {
    try {
      const res = await fetch(`${API_BASE}/complaints/${complaintId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departmentId, adminId: adminUser?.id }),
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend assign fallback');
    }

    const complaint = localComplaints.find(c => c.id === Number(complaintId));
    const dept = INITIAL_DEPARTMENTS.find(d => d.id === Number(departmentId));
    if (complaint && dept) {
      complaint.departmentId = dept.id;
      complaint.departmentName = dept.name;
      if (complaint.status === 'SUBMITTED') {
        complaint.status = 'ASSIGNED';
      }
      complaint.history = complaint.history || [];
      complaint.history.push({
        id: nextLogId++,
        status: complaint.status,
        changedByName: adminUser?.name || 'Campus Admin',
        changedByRole: 'ADMIN',
        remarks: `Assigned to ${dept.name}.`,
        updatedOn: new Date().toISOString()
      });
    }
    return { success: true, complaint };
  },

  async updatePriority(complaintId, priority, adminUser) {
    try {
      const res = await fetch(`${API_BASE}/complaints/${complaintId}/priority`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority, adminId: adminUser?.id }),
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend priority fallback');
    }

    const complaint = localComplaints.find(c => c.id === Number(complaintId));
    if (complaint) {
      complaint.priority = priority;
      complaint.history = complaint.history || [];
      complaint.history.push({
        id: nextLogId++,
        status: complaint.status,
        changedByName: adminUser?.name || 'Campus Admin',
        changedByRole: 'ADMIN',
        remarks: `Priority updated to ${priority}.`,
        updatedOn: new Date().toISOString()
      });
    }
    return { success: true, complaint };
  },

  async updateStatus(complaintId, status, remarks, user) {
    try {
      const res = await fetch(`${API_BASE}/complaints/${complaintId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks, userId: user?.id }),
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend status update fallback');
    }

    const complaint = localComplaints.find(c => c.id === Number(complaintId));
    if (complaint) {
      complaint.status = status;
      complaint.history = complaint.history || [];
      complaint.history.push({
        id: nextLogId++,
        status,
        changedByName: user?.name || 'Staff User',
        changedByRole: user?.role || 'DEPARTMENT_STAFF',
        remarks: remarks || `Status transitioned to ${status}.`,
        updatedOn: new Date().toISOString()
      });
    }
    return { success: true, complaint };
  },

  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, { signal: AbortSignal.timeout(3500) });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend admin stats fallback');
    }

    const submittedCount = localComplaints.filter(c => c.status === 'SUBMITTED').length;
    const assignedCount = localComplaints.filter(c => c.status === 'ASSIGNED').length;
    const inProgressCount = localComplaints.filter(c => c.status === 'IN_PROGRESS').length;
    const resolvedCount = localComplaints.filter(c => c.status === 'RESOLVED').length;
    const closedCount = localComplaints.filter(c => c.status === 'CLOSED').length;

    const departmentStats = INITIAL_DEPARTMENTS.map(dept => {
      const deptComplaints = localComplaints.filter(c => c.departmentId === dept.id);
      return {
        department: dept,
        assignedCount: deptComplaints.filter(c => c.status === 'ASSIGNED').length,
        inProgressCount: deptComplaints.filter(c => c.status === 'IN_PROGRESS').length,
        resolvedCount: deptComplaints.filter(c => c.status === 'RESOLVED').length
      };
    });

    return {
      submittedCount,
      assignedCount,
      inProgressCount,
      resolvedCount,
      closedCount,
      totalCount: localComplaints.length,
      departmentStats
    };
  }
};
