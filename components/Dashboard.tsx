import React, { useState, useEffect } from 'react';
import { ClubEvent, Task, TaskStatus, User, UserRole, ActivityLog, Notification, ClubReport, Photo } from '../types';
import { generateEventDescription, generateTaskAnalysis } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plus, CheckCircle, Circle, Clock, Loader2, Sparkles, LogOut, Calendar, Layout, Search, BrainCircuit, X, Users, Activity, Filter, Bell, User as UserIcon, Settings, Save, Upload, Shield, Trash2, ChevronDown, FileText, Image as ImageIcon, PieChart as PieChartIcon, Download, Camera, Menu } from 'lucide-react';
import { MASCOT_URL, LOGO_URL } from '../constants';

interface DashboardProps {
  user: User;
  users: User[];
  events: ClubEvent[];
  tasks: Task[];
  reports: ClubReport[];
  photos: Photo[];
  
  // Create Handlers
  onCreateEvent: (event: Omit<ClubEvent, 'id'>) => void;
  onCreateTask: (task: Omit<Task, 'id'>) => void;
  onCreateReport: (report: Omit<ClubReport, 'id'>) => void;
  onCreatePhoto: (photo: Omit<Photo, 'id'>) => void;

  // Update Handlers
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;

  setEvents: React.Dispatch<React.SetStateAction<ClubEvent[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setReports: React.Dispatch<React.SetStateAction<ClubReport[]>>;
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  onUpdateUser: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  onDeleteEvent: (eventId: string) => void; 
  onDeleteTask: (taskId: string) => void; 
  activityLog: ActivityLog[];
  addActivity: (action: string, details?: string) => void;
  notifications: Notification[];
  removeNotification: (id: string) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, users, events, tasks, reports, photos, 
  onCreateEvent, onCreateTask, onCreateReport, onCreatePhoto, onUpdateTaskStatus,
  setEvents, setTasks, setReports, setPhotos, onUpdateUser, onDeleteUser, onDeleteEvent, onDeleteTask, activityLog, addActivity, notifications, removeNotification, onLogout, 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'tasks' | 'settings' | 'team' | 'reports' | 'gallery'>('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Modal states
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  
  // New Item States
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskEventId, setNewTaskEventId] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  
  // Report Upload States
  const [reportTitle, setReportTitle] = useState('');
  const [reportFile, setReportFile] = useState('');

  // Gallery Upload States
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoEventId, setPhotoEventId] = useState('');
  const [photoFile, setPhotoFile] = useState('');

  // Settings State
  const [settingsName, setSettingsName] = useState(user.name);
  const [settingsEmail, setSettingsEmail] = useState(user.email);
  const [settingsAvatar, setSettingsAvatar] = useState(user.avatar || '');

  // AI Insights
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);

  // Sync settings state when user prop updates
  useEffect(() => {
    setSettingsName(user.name);
    setSettingsEmail(user.email);
    setSettingsAvatar(user.avatar || '');
  }, [user]);

  // Close sidebar when changing tabs on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);

  // --- Permissions Logic ---
  const canManageContent = [
    UserRole.ADMIN, 
    UserRole.FOUNDER, 
    UserRole.PRESIDENT, 
    UserRole.VICE_PRESIDENT, 
    UserRole.EVENT_COORDINATOR,
    UserRole.TECHNICAL_LEAD,
    UserRole.CONTENT_WRITER,
    UserRole.SOCIAL_MEDIA_LEAD,
    UserRole.DESIGNING_TEAM,
    UserRole.DATASET_MANAGER
  ].includes(user.role);

  // --- Handlers ---

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = {
      title: newEventTitle,
      date: newEventDate,
      description: newEventDesc,
      location: 'TBD',
      imageUrl: `https://picsum.photos/800/400?random=${Date.now()}`
    };
    onCreateEvent(newEvent);
    setEventModalOpen(false);
    resetEventForm();
  };

  const handleGenerateDescription = async () => {
    if (!newEventTitle || !newEventDate) {
      alert("Please enter a title and date first.");
      return;
    }
    setIsGeneratingDesc(true);
    const desc = await generateEventDescription(newEventTitle, newEventDate);
    setNewEventDesc(desc);
    setIsGeneratingDesc(false);
  };

  const resetEventForm = () => {
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventDesc('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const assignee = users.find(u => u.id === newTaskAssigneeId);
    const newTask = {
      eventId: newTaskEventId,
      title: newTaskTitle,
      description: 'Assigned via dashboard',
      assigneeId: newTaskAssigneeId || null,
      status: TaskStatus.PENDING,
      deadline: newTaskDeadline || '2025-12-31'
    };
    onCreateTask(newTask);
    setTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskAssigneeId('');
    setNewTaskDeadline('');
  };

  // --- Report Upload Logic ---
  const handleUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle) {
      alert("Please provide a title for the report.");
      return;
    }

    const newReport = {
      title: reportTitle,
      date: new Date().toISOString().split('T')[0], // Auto-set today's date
      description: 'PDF Report', // Default description
      thumbnailUrl: 'https://placehold.co/400x300/1e293b/a5b4fc?text=PDF+Report', // Default PDF placeholder
      fileUrl: reportFile || '#' 
    };

    onCreateReport(newReport);
    
    // Reset Form
    setReportTitle('');
    setReportFile('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Gallery Upload Logic ---
  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoCaption || !photoEventId) {
      alert("Please provide a caption and select an event.");
      return;
    }

    // In a real app, we'd use the file URL. Here we pick a random image if simulation fails or use the uploaded one
    const newPhoto = {
      url: photoFile || `https://picsum.photos/seed/${Date.now()}/800/600`,
      caption: photoCaption,
      eventId: photoEventId
    };

    onCreatePhoto(newPhoto);
    
    // Reset
    setPhotoCaption('');
    setPhotoEventId('');
    setPhotoFile('');
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a fake local URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    onUpdateTaskStatus(taskId, newStatus);
  };

  const handleGetAnalysis = async () => {
    setIsAnalyzing(true);
    const analysis = await generateTaskAnalysis(tasks, events);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: settingsName,
      email: settingsEmail,
      avatar: settingsAvatar
    });
  };

  const handleRoleChange = (targetUser: User, newRole: UserRole) => {
    onUpdateUser({ ...targetUser, role: newRole });
    addActivity('Updated Role', `Changed ${targetUser.name}'s role to ${formatRole(newRole)}`);
  };

  const handleDeleteUserWrapper = (targetUserId: string) => {
    if (window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) {
      if (onDeleteUser) {
        onDeleteUser(targetUserId);
        addActivity('Removed User', 'Deleted user account');
      }
    }
  };

  const formatRole = (role: string) => {
    return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // --- Filtering & Derived Data ---
  
  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = showMyTasksOnly ? t.assigneeId === user.id : true;
    return matchesSearch && matchesUser;
  });

  const taskStatusData = [
    { name: 'Pending', value: tasks.filter(t => t.status === TaskStatus.PENDING).length, color: '#94a3b8' },
    { name: 'In Progress', value: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length, color: '#fbbf24' },
    { name: 'Completed', value: tasks.filter(t => t.status === TaskStatus.COMPLETED).length, color: '#4ade80' },
  ];

  const getAssigneeName = (id: string | null) => {
    if (!id) return 'Unassigned';
    return users.find(u => u.id === id)?.name || 'Unknown';
  };

  const getEventName = (id: string) => events.find(e => e.id === id)?.title || 'Unknown Event';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex relative overflow-hidden">
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {notifications.map(n => (
          <div key={n.id} className={`animate-fade-in-up min-w-[300px] p-4 rounded-lg shadow-xl border flex items-center justify-between ${n.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100' : 'bg-slate-800 border-slate-600'}`}>
            <span className="text-sm font-medium">{n.message}</span>
            <button onClick={() => removeNotification(n.id)} className="ml-4 hover:opacity-70"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col fixed h-full z-30 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <img src={LOGO_URL} alt="Logo" className="w-8 h-8 object-contain" />
             <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
               Portal
             </h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'overview', icon: PieChartIcon, label: 'Overview' },
            { id: 'events', icon: Calendar, label: 'Event Manager' },
            { id: 'tasks', icon: CheckCircle, label: 'Task Board' },
            ...(user.role === UserRole.ADMIN ? [{ id: 'team', icon: Users, label: 'Team Management' }] : []),
            { id: 'reports', icon: FileText, label: 'Report Manager' },
            { id: 'gallery', icon: Camera, label: 'Gallery Manager' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((tab) => (
             <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800/50 bg-slate-900/30">
          <div className="flex items-center gap-3 mb-4">
            <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-slate-700" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-white">{user.name}</p>
              <p className="text-xs text-indigo-400 flex items-center gap-1">
                {user.role === UserRole.ADMIN && <Shield className="w-3 h-3"/>}
                {formatRole(user.role)}
              </p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-white hover:bg-red-500/20 p-2 rounded-lg transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen relative w-full">
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          
          {/* Header & Search */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
            <div className="flex items-center gap-4">
               {/* Mobile Menu Toggle */}
               <button 
                 onClick={() => setSidebarOpen(true)}
                 className="md:hidden p-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700 transition-colors"
               >
                 <Menu className="w-6 h-6" />
               </button>

               <div>
                 <h1 className="text-xl md:text-2xl font-bold text-white">
                   {activeTab === 'overview' ? `Welcome back, ${user.name.split(' ')[0]}` : 
                    activeTab === 'events' ? 'Events' : 
                    activeTab === 'tasks' ? 'Tasks' : 
                    activeTab === 'reports' ? 'Report Management' :
                    activeTab === 'gallery' ? 'Gallery Management' :
                    activeTab === 'team' ? 'Team Management' : 'Profile Settings'}
                 </h1>
                 <p className="text-slate-400 text-xs md:text-sm hidden sm:block">
                   {activeTab === 'overview' ? "Here's your daily briefing." : 
                    activeTab === 'events' ? "Manage upcoming club activities." : 
                    activeTab === 'tasks' ? "Track and complete assignments." : 
                    activeTab === 'reports' ? "Upload and manage public reports." :
                    activeTab === 'gallery' ? "Upload photos from events." :
                    activeTab === 'team' ? "Manage user roles and permissions." : "Update your account information."}
                 </p>
               </div>
            </div>
            
            {activeTab !== 'overview' && activeTab !== 'settings' && activeTab !== 'team' && activeTab !== 'reports' && activeTab !== 'gallery' && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                 <div className="relative flex-1">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 sm:w-64 transition-all"
                   />
                 </div>
                 {activeTab === 'tasks' && (
                   <button 
                    onClick={() => setShowMyTasksOnly(!showMyTasksOnly)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${showMyTasksOnly ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`}
                   >
                     <UserIcon className="w-4 h-4" /> <span className="sm:hidden md:inline">My Tasks</span>
                   </button>
                 )}
              </div>
            )}
          </header>

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">
              {/* Stats Cards */}
              {[
                { label: 'Total Events', val: events.length, color: 'text-white', bg: 'bg-gradient-to-br from-slate-800 to-slate-900' },
                { label: 'Active Tasks', val: tasks.filter(t => t.status !== TaskStatus.COMPLETED).length, color: 'text-indigo-400', bg: 'bg-gradient-to-br from-slate-800 to-slate-900' },
                { label: 'Published Reports', val: reports.length, color: 'text-emerald-400', bg: 'bg-gradient-to-br from-slate-800 to-slate-900' }
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group`}>
                   <div className="relative z-10">
                     <h3 className="text-slate-400 mb-1 text-sm font-medium">{stat.label}</h3>
                     <p className={`text-4xl font-bold ${stat.color}`}>{stat.val}</p>
                   </div>
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/10 transition-colors"></div>
                </div>
              ))}

              {/* Chart */}
              <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl h-96 flex flex-col">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 flex-shrink-0"><Activity className="w-5 h-5 text-indigo-500"/> Task Velocity</h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} className="stroke-slate-900 stroke-2" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }} itemStyle={{color: '#fff'}} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-yellow-500"/> Recent Activity</h3>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {activityLog.length === 0 ? (
                    <p className="text-slate-500 text-sm italic">No recent activity logged.</p>
                  ) : (
                    activityLog.slice().reverse().map(log => (
                       <div key={log.id} className="flex gap-3 items-start p-3 rounded-lg bg-slate-800/50 border border-slate-800 text-sm">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                          <div>
                            <p className="text-slate-300">
                              <span className="font-semibold text-white">{users.find(u => u.id === log.userId)?.name || 'Someone'}</span> {log.action}
                            </p>
                            {log.details && <p className="text-slate-500 text-xs mt-1">{log.details}</p>}
                            <p className="text-slate-600 text-[10px] mt-2">{log.timestamp.toLocaleTimeString()}</p>
                          </div>
                       </div>
                    ))
                  )}
                </div>
              </div>

              {/* AI Insights */}
              <div className="lg:col-span-3 bg-gradient-to-r from-indigo-900/40 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-80 animate-float pointer-events-none hidden md:block">
                    <img src={MASCOT_URL} alt="AI Assistant" className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-300">
                    <Sparkles className="w-5 h-5" /> Gemini Insights
                  </h3>
                  <button 
                    onClick={handleGetAnalysis} 
                    disabled={isAnalyzing}
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-indigo-900/20"
                  >
                    {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin"/> : <BrainCircuit className="w-3 h-3"/>}
                    {isAnalyzing ? 'Analyzing...' : 'Generate Report'}
                  </button>
                </div>
                <div className="text-slate-300 text-sm leading-relaxed min-h-[60px] bg-slate-950/50 p-4 rounded-xl border border-white/5 relative z-10">
                  {aiAnalysis ? (
                    <div className="whitespace-pre-line animate-fade-in-up pr-24">{aiAnalysis}</div>
                  ) : (
                    <p className="italic text-slate-500 flex items-center justify-center h-full">Click report to analyze team efficiency and task distribution.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: EVENTS */}
          {activeTab === 'events' && (
            <div className="animate-fade-in-up">
              <div className="flex justify-end mb-6">
                {canManageContent && (
                  <button 
                    onClick={() => setEventModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-900/20 transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4" /> Create Event
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map(event => (
                  <div key={event.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-indigo-500/30 transition-all duration-300">
                    <div className="h-48 overflow-hidden relative">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white shadow-sm">{event.title}</h3>
                        <p className="text-indigo-300 text-xs font-semibold flex items-center gap-1"><Calendar className="w-3 h-3"/> {event.date} • {event.location}</p>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-slate-400 text-sm mb-4 flex-1 leading-relaxed">{event.description}</p>
                      {canManageContent && (
                        <div className="flex justify-end">
                          <button 
                            onClick={() => {
                              if(confirm('Are you sure you want to delete this event?')) {
                                onDeleteEvent(event.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredEvents.length === 0 && <div className="col-span-2 text-center text-slate-500 py-10">No events found.</div>}
              </div>
            </div>
          )}

          {/* TAB: TASKS */}
          {activeTab === 'tasks' && (
            <div className="animate-fade-in-up">
              {canManageContent && (
                <div className="flex justify-end mb-6">
                  <button 
                    onClick={() => setTaskModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-900/20 transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4" /> Assign New Task
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
                {/* Columns */}
                {[
                  { id: TaskStatus.PENDING, title: 'Pending', icon: Circle, color: 'text-slate-400', border: 'border-slate-800' },
                  { id: TaskStatus.IN_PROGRESS, title: 'In Progress', icon: Clock, color: 'text-yellow-400', border: 'border-yellow-500/20' },
                  { id: TaskStatus.COMPLETED, title: 'Completed', icon: CheckCircle, color: 'text-emerald-400', border: 'border-emerald-500/20' }
                ].map(col => (
                  <div key={col.id} className={`bg-slate-900/50 p-4 rounded-2xl border ${col.border} flex flex-col h-full`}>
                    <h3 className={`font-bold mb-4 flex items-center gap-2 ${col.color}`}>
                      <col.icon className="w-5 h-5" /> {col.title} 
                      <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full ml-auto">
                        {filteredTasks.filter(t => t.status === col.id).length}
                      </span>
                    </h3>
                    <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                      {filteredTasks.filter(t => t.status === col.id).map(task => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          getAssigneeName={getAssigneeName} 
                          getEventName={getEventName} 
                          onStatusChange={handleTaskStatusChange} 
                          currentUserId={user.id}
                          canManageContent={canManageContent}
                          onDeleteTask={onDeleteTask}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: REPORT MANAGER */}
          {activeTab === 'reports' && (
            <div className="animate-fade-in-up">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Create Report Form */}
                {canManageContent && (
                  <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                       <Upload className="w-5 h-5 text-indigo-500"/> Upload New Report
                    </h3>
                    <form onSubmit={handleUploadReport} className="space-y-4">
                       <div>
                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Report Title</label>
                         <input required type="text" value={reportTitle} onChange={e => setReportTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Monthly Activity Log" />
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Select File (PDF)</label>
                         <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 cursor-pointer" required />
                       </div>
                       
                       <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all hover:scale-[1.02] mt-2">
                         Publish Report
                       </button>
                    </form>
                  </div>
                )}

                {/* Published Reports List */}
                <div className={`${canManageContent ? 'md:col-span-2' : 'md:col-span-3'}`}>
                  <h3 className="text-lg font-bold text-white mb-6">Published Reports</h3>
                  <div className="space-y-3">
                     {reports.length === 0 && <p className="text-slate-500 italic border border-dashed border-slate-800 p-8 rounded-xl text-center">No reports uploaded yet.</p>}
                     {reports.map(report => (
                        <div key={report.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-indigo-500/30 transition-colors group">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                               <FileText className="w-5 h-5" />
                             </div>
                             <div>
                                <h4 className="font-medium text-white text-sm">{report.title}</h4>
                                <p className="text-xs text-slate-500">{report.date}</p>
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-2">
                              <a href={report.fileUrl} download={`${report.title}.pdf`} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors" title="Download">
                                <Download className="w-4 h-4" />
                              </a>
                              {canManageContent && (
                                <button onClick={() => {
                                  if(confirm('Delete report?')) {
                                    setReports(prev => prev.filter(r => r.id !== report.id));
                                    addActivity('Deleted Report', report.title);
                                  }
                                }} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                  <Trash2 className="w-4 h-4"/>
                                </button>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: GALLERY MANAGER */}
          {activeTab === 'gallery' && (
            <div className="animate-fade-in-up">
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Upload Photo Form */}
                {canManageContent && (
                  <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                       <ImageIcon className="w-5 h-5 text-indigo-500"/> Add to Gallery
                    </h3>
                    <form onSubmit={handleUploadPhoto} className="space-y-4">
                       <div>
                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Caption</label>
                         <input required type="text" value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Winners of Hackathon" />
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Related Event</label>
                         <select required value={photoEventId} onChange={e => setPhotoEventId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500">
                           <option value="">Select Event</option>
                           {events.map(e => (
                             <option key={e.id} value={e.id}>{e.title}</option>
                           ))}
                         </select>
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Upload Image</label>
                         <input type="file" onChange={handlePhotoFileChange} accept="image/*" className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 cursor-pointer" required />
                       </div>
                       
                       {photoFile && (
                         <div className="w-full h-32 rounded-lg overflow-hidden border border-slate-800">
                            <img src={photoFile} alt="Preview" className="w-full h-full object-cover" />
                         </div>
                       )}

                       <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all hover:scale-[1.02] mt-2">
                         Upload Photo
                       </button>
                    </form>
                  </div>
                )}

                {/* Photo Grid */}
                <div className={`${canManageContent ? 'md:col-span-2' : 'md:col-span-3'}`}>
                  <h3 className="text-lg font-bold text-white mb-6">Gallery Images</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                     {photos.length === 0 && <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">No photos in gallery.</div>}
                     {photos.map(photo => (
                        <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-800">
                           <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                              <p className="text-white font-medium text-sm line-clamp-1">{photo.caption}</p>
                              <span className="text-[10px] text-indigo-300">{getEventName(photo.eventId)}</span>
                           </div>
                           {canManageContent && (
                              <button 
                                onClick={() => {
                                  if(confirm('Delete photo?')) {
                                    setPhotos(prev => prev.filter(p => p.id !== photo.id));
                                    addActivity('Deleted Photo', photo.caption);
                                  }
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                           )}
                        </div>
                     ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: TEAM MANAGEMENT (ADMIN ONLY) */}
          {activeTab === 'team' && user.role === UserRole.ADMIN && (
             <div className="animate-fade-in-up">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-6 border-b border-slate-800">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-indigo-500"/> User Management</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage roles and remove members from the portal.</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold">
                        <tr>
                          <th className="p-4">User</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img src={u.avatar} alt="" className="w-10 h-10 rounded-full bg-slate-800" />
                                <div>
                                  <div className="font-medium text-white">{u.name}</div>
                                  <div className="text-xs text-slate-500">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              {u.id === user.id ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  Current Admin
                                </span>
                              ) : (
                                <div className="relative inline-block w-48">
                                  <select 
                                    value={u.role} 
                                    onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                                    className="w-full appearance-none bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer hover:bg-slate-900 truncate"
                                  >
                                    <option value={UserRole.MEMBER}>Member</option>
                                    <option value={UserRole.ADMIN}>Admin</option>
                                    <option value={UserRole.FOUNDER}>Founder</option>
                                    <option value={UserRole.PRESIDENT}>President</option>
                                    <option value={UserRole.VICE_PRESIDENT}>Vice President</option>
                                    <option value={UserRole.EVENT_COORDINATOR}>Event Coordinator</option>
                                    <option value={UserRole.CO_EVENT_COORDINATOR}>Co-Event Coordinator</option>
                                    <option value={UserRole.TECHNICAL_LEAD}>Technical Lead</option>
                                    <option value={UserRole.CONTENT_WRITER}>Content Writer</option>
                                    <option value={UserRole.SOCIAL_MEDIA_LEAD}>Social Media Lead</option>
                                    <option value={UserRole.DESIGNING_TEAM}>Designing Team</option>
                                    <option value={UserRole.DATASET_MANAGER}>Dataset Manager</option>
                                  </select>
                                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400">
                                Active
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {u.id !== user.id && (
                                <button 
                                  onClick={() => handleDeleteUserWrapper(u.id)}
                                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
             </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in-up max-w-2xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
                 <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <Settings className="w-5 h-5 text-indigo-500" /> Account Settings
                 </h2>
                 
                 <form onSubmit={handleSaveSettings} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
                       <div className="relative group">
                          <img src={settingsAvatar || 'https://i.pravatar.cc/150'} alt="Avatar Preview" className="w-24 h-24 rounded-full border-4 border-slate-700 object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                             <Upload className="w-6 h-6 text-white" />
                          </div>
                       </div>
                       <div className="flex-1">
                          <label className="block text-sm font-medium text-slate-400 mb-2">Avatar URL</label>
                          <input 
                            type="text" 
                            value={settingsAvatar}
                            onChange={(e) => setSettingsAvatar(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 text-sm"
                            placeholder="https://example.com/my-photo.jpg"
                          />
                          <p className="text-xs text-slate-500 mt-2">Paste a URL to update your profile picture.</p>
                       </div>
                    </div>

                    {/* Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                          <input 
                            type="text" 
                            value={settingsName}
                            onChange={(e) => setSettingsName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                          <input 
                            type="email" 
                            value={settingsEmail}
                            onChange={(e) => setSettingsEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                          />
                       </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                       <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-900/20 transition-all hover:scale-105">
                          <Save className="w-4 h-4" /> Save Changes
                       </button>
                    </div>
                 </form>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- MODALS --- */}

      {/* Create Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl relative">
            <button onClick={() => setEventModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X /></button>
            <h3 className="text-xl font-bold text-white mb-6">Create New Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Event Title</label>
                <input required type="text" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. SQL Bootcamp" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                <input required type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                  <button type="button" onClick={handleGenerateDescription} disabled={isGeneratingDesc} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    {isGeneratingDesc ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
                    AI Auto-Fill
                  </button>
                </div>
                <textarea required value={newEventDesc} onChange={(e) => setNewEventDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white h-24 focus:outline-none focus:border-indigo-500" placeholder="Brief event details..." />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all hover:scale-[1.02]">Publish Event</button>
            </form>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl relative">
            <button onClick={() => setTaskModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X /></button>
            <h3 className="text-xl font-bold text-white mb-6">Assign New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Task Title</label>
                <input required type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Design Poster" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Related Event</label>
                <select required value={newTaskEventId} onChange={(e) => setNewTaskEventId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500">
                  <option value="">Select an Event</option>
                  {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Assign To</label>
                <select value={newTaskAssigneeId} onChange={(e) => setNewTaskAssigneeId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500">
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              
              {/* New Deadline Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Deadline</label>
                <input 
                  required 
                  type="date" 
                  value={newTaskDeadline} 
                  onChange={(e) => setNewTaskDeadline(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all hover:scale-[1.02]">Create Task</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Helper Component for Task Card
const TaskCard: React.FC<{
  task: Task; 
  getAssigneeName: (id: string|null) => string; 
  getEventName: (id: string) => string;
  onStatusChange: (id: string, status: TaskStatus) => void;
  currentUserId: string;
  canManageContent: boolean; // Add this prop
  onDeleteTask: (taskId: string) => void; // Add this prop
}> = ({ task, getAssigneeName, getEventName, onStatusChange, currentUserId, canManageContent, onDeleteTask }) => {
  const isAssignedToMe = task.assigneeId === currentUserId;

  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 group relative ${isAssignedToMe ? 'bg-indigo-900/10 border-indigo-500/30 hover:border-indigo-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}>
      <div className="flex justify-between items-start mb-2">
         <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50 truncate max-w-[120px]">
           {getEventName(task.eventId)}
         </span>
         {isAssignedToMe && <span className="text-[10px] text-indigo-400 font-bold bg-indigo-900/30 px-2 py-1 rounded">YOU</span>}
         {canManageContent && ( // Conditionally render delete button
             <button 
                onClick={() => {
                   if(confirm('Are you sure you want to delete this task?')) {
                      onDeleteTask(task.id);
                   }
                }}
                className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete Task"
             >
                <Trash2 className="w-4 h-4" />
             </button>
         )}
      </div>
      
      <h4 className="font-semibold text-white mb-3 leading-tight">{task.title}</h4>
      
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${task.assigneeId ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
          {task.assigneeId ? getAssigneeName(task.assigneeId).charAt(0) : '?'}
        </div>
        <span className="text-xs text-slate-400">{getAssigneeName(task.assigneeId)}</span>
      </div>

      <div className="flex gap-2 opacity-100 transition-opacity">
        {task.status !== TaskStatus.PENDING && (
          <button onClick={() => onStatusChange(task.id, TaskStatus.PENDING)} className="text-xs flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors">Reset</button>
        )}
        {task.status === TaskStatus.PENDING && (
          <button onClick={() => onStatusChange(task.id, TaskStatus.IN_PROGRESS)} className="text-xs flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium shadow-lg shadow-indigo-900/20 transition-all hover:scale-105">Start Task</button>
        )}
        {task.status === TaskStatus.IN_PROGRESS && (
          <button onClick={() => onStatusChange(task.id, TaskStatus.COMPLETED)} className="text-xs flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow-lg shadow-emerald-900/20 transition-all hover:scale-105">Complete</button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;