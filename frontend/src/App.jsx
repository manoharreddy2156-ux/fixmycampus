import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StudentPortal from './components/StudentPortal';
import AdminDashboard from './components/AdminDashboard';
import DepartmentPortal from './components/DepartmentPortal';
import ComplaintDetailModal from './components/ComplaintDetailModal';
import NewComplaintModal from './components/NewComplaintModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { apiService, INITIAL_DEPARTMENTS, CATEGORIES, STATUSES, PRIORITIES } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('student');
  const [currentUser, setCurrentUser] = useState({
    id: 2,
    name: 'Aarav Sharma',
    rollNo: 'CS21B1042',
    email: 'aarav.sharma@fixmycampus.edu',
    role: 'STUDENT'
  });

  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [adminStats, setAdminStats] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Modals & Popups
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintHistory, setComplaintHistory] = useState([]);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Check backend health and load data
  const loadData = async () => {
    const isHealthy = await apiService.checkBackendHealth();
    setIsBackendConnected(isHealthy);

    const meta = await apiService.getMetadata();
    if (meta?.departments) {
      setDepartments(meta.departments);
    }

    const fetchedComplaints = await apiService.getComplaints();
    setComplaints(fetchedComplaints);

    const stats = await apiService.getAdminStats();
    setAdminStats(stats);
  };

  useEffect(() => {
    loadData();
  }, []);

  // When complaint is selected, load full history
  const handleSelectComplaint = async (complaint) => {
    setSelectedComplaint(complaint);
    const details = await apiService.getComplaintDetails(complaint.id);
    if (details) {
      setSelectedComplaint(details.complaint);
      setComplaintHistory(details.history || []);
    } else {
      setComplaintHistory(complaint.history || []);
    }
  };

  // Auth Handlers
  const handleLogin = async (email, password) => {
    const res = await apiService.login(email, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      if (res.user.role === 'ADMIN') setActiveTab('admin');
      else if (res.user.role === 'DEPARTMENT_STAFF') setActiveTab('department');
      else setActiveTab('student');
      showToast(`Welcome back, ${res.user.name}!`);
    }
    return res;
  };

  const handleRegister = async (formData) => {
    const res = await apiService.register(formData);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setActiveTab('student');
      showToast('Registration successful! Welcome to FixMyCampus.');
    }
    return res;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Signed out of FixMyCampus.');
  };

  // Ticket Operations
  const handleCreateComplaint = async (data) => {
    const res = await apiService.createComplaint(data);
    if (res.success) {
      showToast('Issue ticket submitted successfully!');
      await loadData();
    }
  };

  const handleAssignDepartment = async (complaintId, deptId) => {
    const res = await apiService.assignDepartment(complaintId, deptId, currentUser);
    if (res.success) {
      showToast('Complaint assigned to department.');
      await loadData();
      if (selectedComplaint && selectedComplaint.id === complaintId) {
        handleSelectComplaint(res.complaint);
      }
    }
  };

  const handleUpdatePriority = async (complaintId, priority) => {
    const res = await apiService.updatePriority(complaintId, priority, currentUser);
    if (res.success) {
      showToast(`Priority updated to ${priority}.`);
      await loadData();
      if (selectedComplaint && selectedComplaint.id === complaintId) {
        handleSelectComplaint(res.complaint);
      }
    }
  };

  const handleUpdateStatus = async (complaintId, status, remarks) => {
    const res = await apiService.updateStatus(complaintId, status, remarks, currentUser);
    if (res.success) {
      showToast(`Ticket status updated to ${status}.`);
      await loadData();
      if (selectedComplaint && selectedComplaint.id === complaintId) {
        handleSelectComplaint(res.complaint);
      }
    }
  };

  const handleCreateDepartmentUser = async (formData) => {
    return await apiService.createDepartmentUser(formData);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
        isBackendConnected={isBackendConnected}
        onCheckBackend={async () => {
          showToast('Testing connection to Spring Boot backend...');
          await loadData();
        }}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'student' && (
          <StudentPortal
            complaints={complaints}
            currentUser={currentUser}
            onSelectComplaint={handleSelectComplaint}
            onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
            categories={CATEGORIES}
            statuses={STATUSES}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            complaints={complaints}
            adminStats={adminStats}
            departments={departments}
            currentUser={currentUser}
            onSelectComplaint={handleSelectComplaint}
            onAssignDepartment={handleAssignDepartment}
            onUpdatePriority={handleUpdatePriority}
            onUpdateStatus={handleUpdateStatus}
            onCreateDepartmentUser={handleCreateDepartmentUser}
            categories={CATEGORIES}
            statuses={STATUSES}
          />
        )}

        {activeTab === 'department' && (
          <DepartmentPortal
            complaints={complaints}
            departments={departments}
            currentUser={currentUser}
            onSelectComplaint={handleSelectComplaint}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '60px',
        padding: '24px 32px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(11, 15, 25, 0.95)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div>
          <strong style={{ color: '#fff' }}>FixMyCampus</strong> — Campus Issue Reporting & Fast Resolution System
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Frontend: React + Vite</span>
          <span>•</span>
          <span>Backend: Spring Boot + MySQL (folder: <code>backend/</code>)</span>
          <span>•</span>
          <span style={{ color: isBackendConnected ? '#34d399' : '#fbbf24' }}>
            {isBackendConnected ? 'Backend API Active' : 'Offline / Demo Simulation Active'}
          </span>
        </div>
      </footer>

      {/* Modals */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          history={complaintHistory}
          departments={departments}
          currentUser={currentUser}
          onClose={() => setSelectedComplaint(null)}
          onAssignDepartment={handleAssignDepartment}
          onUpdatePriority={handleUpdatePriority}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {isNewComplaintOpen && (
        <NewComplaintModal
          currentUser={currentUser}
          onClose={() => setIsNewComplaintOpen(false)}
          onSubmit={handleCreateComplaint}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
