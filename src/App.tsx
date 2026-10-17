import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { IncidentsView } from './components/IncidentsView';
import { EarlyAlertsView } from './components/EarlyAlertsView';
import { TasksView } from './components/TasksView';
import { AttendanceView } from './components/AttendanceView';
import { BoardingView } from './components/BoardingView';
import { LearningView } from './components/LearningView';
import { CoordinationView } from './components/CoordinationView';
import { ProgressAwardsView } from './components/ProgressAwardsView';
import { ReportsView } from './components/ReportsView';
import { StudentImportModal } from './components/StudentImportModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LoginView } from './components/LoginView';
import { StudentPortalView } from './components/StudentPortalView';
import { db, TEACHER_ACCOUNTS } from './services/db';
import { Role, Student, IncidentReport, EarlyAlert, TaskItem, AttendanceRecord, BoardingRecord, ProgressRecord, AuthSession, User } from './types';

const AUTH_STORAGE_KEY = 'classcare_auth_session_v1';

export default function App() {
  // Authentication session (2-stream: TEACHER or STUDENT)
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>('GVCN');
  const [selectedClass, setSelectedClass] = useState('10A1');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  // Modals
  const [isGlobalImportOpen, setIsGlobalImportOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Real data state from database
  const [students, setStudents] = useState<Student[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [alerts, setAlerts] = useState<EarlyAlert[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [boarding, setBoarding] = useState<BoardingRecord[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);

  const refreshAllData = useCallback(() => {
    setStudents(db.getStudents());
    setIncidents(db.getIncidents());
    setAlerts(db.getAlerts());
    setTasks(db.getTasks());
    setAttendance(db.getAttendance());
    setBoarding(db.getBoarding());
    setProgress(db.getProgress());
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // When teacher session changes role
  useEffect(() => {
    if (authSession?.type === 'TEACHER' && authSession.teacher) {
      setCurrentRole(authSession.teacher.role);
    }
  }, [authSession]);

  const handleLogin = (session: AuthSession) => {
    setAuthSession(session);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch (err) {
      console.warn('Storage save error:', err);
    }
    refreshAllData();
  };

  const handleLogout = () => {
    setAuthSession(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.warn('Storage remove error:', err);
    }
  };

  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    if (authSession?.teacher) {
      const updatedTeacher = { ...authSession.teacher, role: newRole };
      const updatedSession: AuthSession = { ...authSession, teacher: updatedTeacher };
      setAuthSession(updatedSession);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedSession));
      } catch (err) {
        console.warn('Storage error:', err);
      }
    }
  };

  const handleUpdateTeacherName = (newName: string) => {
    if (!authSession?.teacher) return;
    const updatedTeacher = { ...authSession.teacher, name: newName };
    const updatedSession: AuthSession = { ...authSession, teacher: updatedTeacher };
    setAuthSession(updatedSession);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedSession));
      localStorage.setItem('classcare_teacher_name', newName);
    } catch (err) {
      console.warn('Storage error:', err);
    }
  };

  const activeAlertCount = alerts.filter((a) => a.status === 'DANG_CHO' || a.status === 'DANG_XU_LY').length;
  const activeTaskCount = tasks.filter((t) => t.status !== 'DA_HOAN_THANH' && t.status !== 'DA_HUY').length;

  // Stream 0: Not Logged In -> Show 2-Stream Login Portal
  if (!authSession) {
    return (
      <LoginView
        onLogin={handleLogin}
        availableStudents={students}
        onDataReset={refreshAllData}
      />
    );
  }

  // Stream 1: Student Portal (Học sinh nội trú)
  if (authSession.type === 'STUDENT' && authSession.student) {
    // Look up latest student data in case updated
    const liveStudent = students.find((s) => s.id === authSession.student?.id) || authSession.student;

    return (
      <StudentPortalView
        student={liveStudent}
        attendance={attendance}
        boarding={boarding}
        progress={progress}
        incidents={incidents}
        onLogout={handleLogout}
      />
    );
  }

  // Stream 2: Teacher Portal (Cán bộ & Giáo viên)
  const currentTeacher: User = authSession.teacher || TEACHER_ACCOUNTS[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentTeacher}
        currentRole={currentRole}
        onChangeRole={handleRoleChange}
        selectedClass={selectedClass}
        onChangeClass={setSelectedClass}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onToggleSidebar={() => setIsSidebarMobileOpen(!isSidebarMobileOpen)}
        alertCount={activeAlertCount}
        onOpenAlerts={() => setActiveTab('alerts')}
        onLogout={handleLogout}
        onResetData={refreshAllData}
        onUpdateTeacherName={handleUpdateTeacherName}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentRole={currentRole}
          isOpenMobile={isSidebarMobileOpen}
          onCloseMobile={() => setIsSidebarMobileOpen(false)}
          alertCount={activeAlertCount}
          taskCount={activeTaskCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              incidents={incidents}
              alerts={alerts}
              tasks={tasks}
              attendance={attendance}
              progress={progress}
              onNavigate={setActiveTab}
              onOpenImport={() => setIsGlobalImportOpen(true)}
              currentTeacher={currentTeacher}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              students={students}
              onRefresh={refreshAllData}
              incidents={incidents}
              attendance={attendance}
              progress={progress}
            />
          )}

          {activeTab === 'incidents' && (
            <IncidentsView
              incidents={incidents}
              students={students}
              onRefresh={refreshAllData}
              currentTeacher={currentTeacher}
            />
          )}

          {activeTab === 'alerts' && (
            <EarlyAlertsView
              alerts={alerts}
              onRefresh={refreshAllData}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              students={students}
              onRefresh={refreshAllData}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              students={students}
              attendance={attendance}
              onRefresh={refreshAllData}
            />
          )}

          {activeTab === 'boarding' && (
            <BoardingView
              students={students}
              boarding={boarding}
            />
          )}

          {activeTab === 'learning' && (
            <LearningView
              students={students}
            />
          )}

          {activeTab === 'coordination' && (
            <CoordinationView
              students={students}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressAwardsView
              students={students}
              progress={progress}
              onRefresh={refreshAllData}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              students={students}
              incidents={incidents}
              alerts={alerts}
              tasks={tasks}
              attendance={attendance}
              progress={progress}
              currentTeacher={currentTeacher}
            />
          )}
        </main>
      </div>

      {/* Global Student Import Modal (can be opened from Dashboard or Navbar) */}
      <StudentImportModal
        isOpen={isGlobalImportOpen}
        onClose={() => setIsGlobalImportOpen(false)}
        existingStudentIds={new Set(students.map((s) => s.id.toUpperCase()))}
        onImportSuccess={() => {
          refreshAllData();
        }}
      />

      {/* Gemini AI Pedagogical Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        students={students}
      />
    </div>
  );
}
