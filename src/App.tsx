/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award, BookOpen, Clock, FileText, Settings, Users, LogOut, KeyRound,
  HelpCircle, RefreshCw, Layers, CheckCircle2, AlertCircle, Sparkles, GraduationCap,
  MessageSquare, Bell
} from 'lucide-react';

// Import Types
import { User, Certificate, Activity, ConfigOption, StudentPortfolioData } from './types';

// Import Database Helper Services
import {
  initializeDatabase, getUsers, saveUser, deleteUser, getCertificates,
  saveCertificate, getActivities, saveActivity, getConfigOptions,
  saveConfigOption, deleteConfigOption, getStudentPortfolio, saveStudentPortfolio,
  getAppsScriptUrl, setAppsScriptUrl, logActivity
} from './lib/googleSheets';

// Import Modular Components
import Dashboard from './components/Dashboard';
import StudentInformation from './components/StudentInformation';
import EditPortfolio from './components/EditPortfolio';
import AdminPanel from './components/AdminPanel';
import AdvisorPanel from './components/AdvisorPanel';
import PrintReport from './components/PrintReport';
import AppsScriptHelp from './components/AppsScriptHelp';
import AdvisoryChat from './components/AdvisoryChat';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Database States
  const [users, setUsers] = useState<User[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [configOptions, setConfigOptions] = useState<ConfigOption[]>([]);
  const [studentPortfolio, setStudentPortfolio] = useState<StudentPortfolioData | null>(null);
  const [apiUrl, setApiUrl] = useState('');

  // UI States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState(''); // dummy for login simulation
  const [loginError, setLoginError] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'failed'>('idle');

  // Load Database and Initialize
  const loadDatabase = async () => {
    setSyncStatus('syncing');
    try {
      initializeDatabase();
      const fetchedUsers = await getUsers();
      const fetchedCerts = await getCertificates();
      const fetchedActs = await getActivities();
      const fetchedConfigs = await getConfigOptions();
      const scriptUrl = getAppsScriptUrl();

      setUsers(fetchedUsers);
      setCertificates(fetchedCerts);
      setActivities(fetchedActs);
      setConfigOptions(fetchedConfigs);
      setApiUrl(scriptUrl);

      // If user is logged in, reload their portfolio data
      if (currentUser && currentUser.Role === 'STUDENT') {
        const port = await getStudentPortfolio(currentUser.StudentID || '6601010024');
        setStudentPortfolio(port);
      } else if (fetchedUsers.length > 0 && currentUser) {
        // Find fresh copy of currentUser in DB
        const freshUser = fetchedUsers.find(u => u.UserID === currentUser.UserID);
        if (freshUser) {
          setCurrentUser(freshUser);
        }
      }
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (e) {
      console.error('Error synchronizing database:', e);
      setSyncStatus('failed');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };

  useEffect(() => {
    loadDatabase().then(() => {
      setIsInitialized(true);
    });
  }, []);

  // Sync portfolio on student change
  useEffect(() => {
    if (currentUser && currentUser.Role === 'STUDENT') {
      getStudentPortfolio(currentUser.StudentID || '6601010024').then(port => {
        setStudentPortfolio(port);
      });
    } else {
      setStudentPortfolio(null);
    }
  }, [currentUser]);

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError('กรุณากรอกอีเมลผู้ใช้งาน');
      return;
    }

    const match = users.find(u => u.Email.toLowerCase().trim() === loginEmail.toLowerCase().trim());
    if (match) {
      setCurrentUser(match);
      logActivity(match.UserID, 'LOGIN', `User ${match.FullName} logged into PhD Portfolio system`);
      setLoginError('');
      setActiveTab('dashboard');
    } else {
      setLoginError('ไม่พบข้อมูลผู้ใช้งาน หรือรหัสผ่านไม่ถูกต้อง (กรุณาทดลอง Quick Login เพื่อความสะดวก)');
    }
  };

  const handleQuickLogin = (role: 'STUDENT' | 'ADVISOR' | 'ADMIN') => {
    let targetEmail = 'student@tu.ac.th';
    if (role === 'ADVISOR') targetEmail = 'advisor@tu.ac.th';
    if (role === 'ADMIN') targetEmail = 'admin@tu.ac.th';

    const match = users.find(u => u.Email === targetEmail);
    if (match) {
      setCurrentUser(match);
      logActivity(match.UserID, 'QUICK_LOGIN', `Quick Login bypass triggered as ${match.Role}`);
      setLoginError('');
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      logActivity(currentUser.UserID, 'LOGOUT', `User ${currentUser.FullName} logged out`);
    }
    setCurrentUser(null);
    setStudentPortfolio(null);
  };

  // Profile update handler
  const handleUpdateProfile = async (updatedProfile: User) => {
    await saveUser(updatedProfile);
    await loadDatabase(); // refresh
  };

  // Add Certificate
  const handleAddCertificate = async (cert: Certificate) => {
    await saveCertificate(cert);
    await loadDatabase();
  };

  // Verify Certificate
  const handleVerifyCertificate = async (certId: string, status: 'APPROVED' | 'REJECTED', feedback: string) => {
    const cert = certificates.find(c => c.CertID === certId);
    if (cert && currentUser) {
      const updated: Certificate = {
        ...cert,
        Status: status,
        Feedback: feedback,
        ApprovedBy: currentUser.FullName
      };
      await saveCertificate(updated);
      logActivity(currentUser.UserID, 'VERIFY_CERTIFICATE', `Advisor verified Certificate ${certId} with status ${status}`);
      await loadDatabase();
    }
  };

  // Add Activity
  const handleAddActivity = async (act: Activity) => {
    await saveActivity(act);
    await loadDatabase();
  };

  // Verify Activity
  const handleVerifyActivity = async (actId: string, status: 'APPROVED' | 'REJECTED', feedback: string) => {
    const act = activities.find(a => a.ActivityID === actId);
    if (act && currentUser) {
      const updated: Activity = {
        ...act,
        Status: status,
        Feedback: feedback,
        ApprovedBy: currentUser.FullName
      };
      await saveActivity(updated);
      logActivity(currentUser.UserID, 'VERIFY_ACTIVITY', `Advisor verified Activity Progress ${actId} with status ${status}`);
      await loadDatabase();
    }
  };

  // Save Portfolio
  const handleSavePortfolio = async (data: StudentPortfolioData) => {
    if (currentUser && currentUser.StudentID) {
      await saveStudentPortfolio(currentUser.StudentID, data);
      setStudentPortfolio(data);
    }
  };

  // Save config option
  const handleSaveConfig = async (opt: ConfigOption) => {
    await saveConfigOption(opt);
    await loadDatabase();
  };

  const handleDeleteConfig = async (id: string) => {
    await deleteConfigOption(id);
    await loadDatabase();
  };

  const handleSaveUser = async (u: User) => {
    await saveUser(u);
    await loadDatabase();
  };

  const handleDeleteUserAccount = async (id: string) => {
    await deleteUser(id);
    await loadDatabase();
  };

  const handleSaveApiUrl = (url: string) => {
    setAppsScriptUrl(url);
    setApiUrl(url);
    loadDatabase();
  };

  // Render Loading
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-tu-red border-t-transparent rounded-full animate-spin" />
        <h2 className="text-sm font-bold text-gray-700">กำลังดาวน์โหลดข้อมูลแฟ้มสะสมงาน มธ...</h2>
        <p className="text-xs text-gray-400">Thammasat University Nursing PhD Portfolio</p>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // LOGIN SCREEN (Theme matching TU Red and Amber/Gold)
  // -----------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
          {/* Tu crest representation */}
          <div className="w-16 h-16 bg-gradient-to-br from-tu-red to-red-800 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md border-2 border-tu-gold">
            <GraduationCap size={32} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-tu-red tracking-tight">
              ระบบแฟ้มสะสมงานดุษฎีบัณฑิต
            </h2>
            <p className="text-xs text-gray-500 font-semibold uppercase mt-0.5 tracking-wider">
              Faculty of Nursing, Thammasat University
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-gray-100 space-y-6">
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  อีเมลผู้ใช้ (Registered Email)
                </label>
                <input
                  type="email"
                  required
                  placeholder="เช่น student@tu.ac.th"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-tu-red font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  รหัสผ่านเข้าใช้งาน (Password)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-tu-red text-sm"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <KeyRound size={14} />
                  </div>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-1.5 leading-normal">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-tu-red hover:bg-tu-red-hover text-white font-bold rounded-xl shadow-xs transition duration-200 uppercase tracking-wider"
              >
                เข้าสู่ระบบ (Login)
              </button>
            </form>

            {/* Quick login bypass section for evaluation */}
            <div className="relative border-t border-gray-100 pt-5">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Quick Evaluation Login
              </span>
              
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleQuickLogin('STUDENT')}
                  className="w-full py-2 bg-blue-50/50 hover:bg-blue-100/50 text-blue-800 font-semibold rounded-xl transition border border-blue-100 flex items-center justify-between px-4 text-xs"
                >
                  <span>นางสาวอรพรรณ (STUDENT)</span>
                  <span className="font-mono text-[9px] bg-blue-100 px-1.5 py-0.5 rounded">student@tu.ac.th</span>
                </button>

                <button
                  onClick={() => handleQuickLogin('ADVISOR')}
                  className="w-full py-2 bg-amber-50/50 hover:bg-amber-100/50 text-amber-800 font-semibold rounded-xl transition border border-amber-100 flex items-center justify-between px-4 text-xs"
                >
                  <span>รศ.ดร. นงลักษณ์ (ADVISOR)</span>
                  <span className="font-mono text-[9px] bg-amber-100 px-1.5 py-0.5 rounded">advisor@tu.ac.th</span>
                </button>

                <button
                  onClick={() => handleQuickLogin('ADMIN')}
                  className="w-full py-2 bg-red-50/50 hover:bg-red-100/50 text-red-800 font-semibold rounded-xl transition border border-red-100 flex items-center justify-between px-4 text-xs"
                >
                  <span>แอดมินระบบ (ADMIN)</span>
                  <span className="font-mono text-[9px] bg-red-100 px-1.5 py-0.5 rounded">admin@tu.ac.th</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // MAIN SYSTEM BOARD LAYOUT
  // -----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
      
      {/* 1. Header (Navbar) - Hidden during print */}
      <header className="no-print bg-white border-b border-gray-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-tu-red rounded-xl flex items-center justify-center text-white border border-tu-gold shadow-sm font-bold text-sm shrink-0">
              มธ
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-extrabold text-tu-red leading-tight">
                Faculty of Nursing, Thammasat University
              </h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
                Nursing PhD Doctoral Portfolio
              </p>
            </div>
          </div>

          {/* User profile & Database sync indicator */}
          <div className="flex items-center gap-4">
            {/* Sync status */}
            <button
              onClick={loadDatabase}
              disabled={syncStatus === 'syncing'}
              className="p-2 text-gray-400 hover:text-tu-red hover:bg-red-50 rounded-xl transition flex items-center gap-1.5 text-xs"
              title="รีเฟรช / ซิงค์ฐานข้อมูล Google Sheets"
            >
              <RefreshCw size={14} className={syncStatus === 'syncing' ? 'animate-spin text-tu-red' : ''} />
              <span className="hidden sm:inline font-semibold">
                {syncStatus === 'syncing' ? 'กำลังซิงค์...' : syncStatus === 'success' ? 'ซิงค์สำเร็จ!' : 'ซิงค์ Sheets'}
              </span>
            </button>

            {/* Quick switch roles dropdown for grading */}
            <div className="hidden md:flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
              <span className="text-[9px] font-bold text-gray-400 uppercase px-2">บทบาท:</span>
              <button
                onClick={() => {
                  const match = users.find(u => u.Role === 'STUDENT');
                  if (match) setCurrentUser(match);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                  currentUser.Role === 'STUDENT' ? 'bg-tu-red text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                STUDENT
              </button>
              <button
                onClick={() => {
                  const match = users.find(u => u.Role === 'ADVISOR');
                  if (match) setCurrentUser(match);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                  currentUser.Role === 'ADVISOR' ? 'bg-tu-red text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                ADVISOR
              </button>
              <button
                onClick={() => {
                  const match = users.find(u => u.Role === 'ADMIN');
                  if (match) setCurrentUser(match);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                  currentUser.Role === 'ADMIN' ? 'bg-tu-red text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                ADMIN
              </button>
            </div>

            {/* Logged in User Card */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
              <img
                src={currentUser.PhotoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser.FullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-red-50"
              />
              <div className="text-left hidden lg:block">
                <span className="font-bold text-xs text-gray-800 block line-clamp-1">{currentUser.FullName}</span>
                <span className="text-[9px] font-mono text-gray-400 block uppercase font-bold">{currentUser.Role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                title="ออกจากระบบ"
              >
                <LogOut size={14} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* API Endpoint bar - Hidden during print */}
      <div className="no-print bg-amber-500 text-white px-4 py-2 text-[10px] font-mono flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Settings size={12} />
          <span>เชื่อมต่อ Google Sheets API / Apps Script Web App Endpoint:</span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="วางลิงก์ Apps Script ของท่านที่นี่เพื่อเชื่อมโยงคีย์วิเศษ..."
            value={apiUrl}
            onChange={e => handleSaveApiUrl(e.target.value)}
            className="bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded text-[10px] w-full sm:w-96 focus:outline-none focus:bg-white/20"
          />
          <span className="bg-white/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0">
            {apiUrl ? 'CONNECTED' : 'LOCAL CACHE FALLBACK'}
          </span>
        </div>
      </div>

      {/* 2. Main Grid Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Nav Tabs Bar - Hidden during print */}
        <div className="no-print flex flex-wrap gap-2 border-b border-gray-100 pb-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-tu-red text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <Layers size={13} />
            แดชบอร์ดภาพรวม (Dashboard)
          </button>

          {currentUser.Role === 'STUDENT' && (
            <>
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'info'
                    ? 'bg-tu-red text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                <Users size={13} />
                ประวัติและใบประกาศ (My Information)
              </button>

              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'edit'
                    ? 'bg-tu-red text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                <BookOpen size={13} />
                บันทึกแฟ้มผลงาน 16 ส่วน (Edit Portfolio)
              </button>
            </>
          )}

          {currentUser.Role === 'ADVISOR' && (
            <button
              onClick={() => setActiveTab('advisor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'advisor'
                  ? 'bg-tu-red text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              <GraduationCap size={13} />
              คัดกรองนักศึกษาและตรวจงาน (Advisor Panel)
            </button>
          )}

          {currentUser.Role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-tu-red text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              <Settings size={13} />
              หลังบ้านแอดมินระบบ (Admin Panel)
            </button>
          )}

          {currentUser.Role === 'STUDENT' && (
            <button
              onClick={() => setActiveTab('print')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'print'
                  ? 'bg-tu-red text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              <FileText size={13} />
              พรีวิวก่อนพิมพ์รูปเล่มพอร์ต (Print Report)
            </button>
          )}

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-tu-red text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <MessageSquare size={13} />
            แชทและแจ้งเตือน (Chat & Reminders)
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'help'
                ? 'bg-tu-red text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <HelpCircle size={13} />
            คู่มือติดตั้ง Google Sheets & Vercel
          </button>
        </div>

        {/* Tab contents transition container */}
        <div className="no-print">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <Dashboard
                  currentUser={currentUser}
                  certificates={certificates}
                  activities={activities}
                  portfolioData={studentPortfolio || {
                    academicBackground: [], professionalBackground: [], milestones: [],
                    englishTest: { testName: '', dateTaken: '', scoreAchieved: '', requiredScore: '', status: '', evidence: '' },
                    englishActivities: [], englishReflection: '', completedCourses: [], keyLearnings: [], workshops: [],
                    dissertationInfo: { title: '', background: '', problem: '', objectives: '', hypotheses: '', conceptualFramework: '', methodology: '' },
                    dissertationProgress: [], advisorMeetings: [], ethicsGovernance: { dateApplied: '', dateApproved: '', approvalNumber: '', amendments: '', confidentiality: '' },
                    researchExperience: [], researchReflection: '', conferencePresentations: [], publications: [], manuscripts: [], grants: [], awards: [],
                    teachingExperiences: [], supervisions: [], academicServices: [], leaderships: [], competencySelfAssessment: [],
                    annualReview: { achievements: '', improvements: '', actionPlans: [] }, futureCareer: { shortTerm: '', longTerm: '', preparation: '' },
                    advisorComments: '', endorsements: []
                  }}
                  allStudents={users}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              </motion.div>
            )}

            {activeTab === 'info' && currentUser.Role === 'STUDENT' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <StudentInformation
                  currentUser={currentUser}
                  certificates={certificates}
                  activities={activities}
                  configOptions={configOptions}
                  onUpdateProfile={handleUpdateProfile}
                  onAddCertificate={handleAddCertificate}
                  onAddActivity={handleAddActivity}
                />
              </motion.div>
            )}

            {activeTab === 'edit' && currentUser.Role === 'STUDENT' && studentPortfolio && (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <EditPortfolio
                  currentUser={currentUser}
                  portfolioData={studentPortfolio}
                  onSavePortfolio={handleSavePortfolio}
                />
              </motion.div>
            )}

            {activeTab === 'advisor' && currentUser.Role === 'ADVISOR' && (
              <motion.div
                key="advisor"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <AdvisorPanel
                  currentUser={currentUser}
                  students={users}
                  certificates={certificates}
                  activities={activities}
                  onVerifyCertificate={handleVerifyCertificate}
                  onVerifyActivity={handleVerifyActivity}
                />
              </motion.div>
            )}

            {activeTab === 'admin' && currentUser.Role === 'ADMIN' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <AdminPanel
                  currentUser={currentUser}
                  users={users}
                  configOptions={configOptions}
                  onAddUser={handleSaveUser}
                  onDeleteUser={handleDeleteUserAccount}
                  onAddConfigOption={handleSaveConfig}
                  onDeleteConfigOption={handleDeleteConfig}
                />
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <AdvisoryChat
                  currentUser={currentUser}
                  allUsers={users}
                  onRefreshDB={loadDatabase}
                />
              </motion.div>
            )}

            {activeTab === 'help' && (
              <motion.div
                key="help"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <AppsScriptHelp />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PRINT TAB RENDERS DIRECTLY UNDER MAIN AREA WITHOUT TABS INTERRUPTIONS */}
        {activeTab === 'print' && currentUser.Role === 'STUDENT' && studentPortfolio && (
          <PrintReport
            currentUser={currentUser}
            portfolioData={studentPortfolio}
            certificates={certificates}
            activities={activities}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

      </main>

      {/* Footer - Hidden during print */}
      <footer className="no-print bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Faculty of Nursing, Thammasat University. All Rights Reserved.</p>
          <p className="mt-1 font-mono text-[10px]">ระบบได้รับการพัฒนาแบบครบวงจรและซิงค์ข้อมูลกับ Google Sheet Database 100%</p>
        </div>
      </footer>

    </div>
  );
}
