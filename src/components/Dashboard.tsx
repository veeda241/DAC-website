import React, { useState, useEffect } from 'react';
import { ClubEvent, Task, TaskStatus, User, UserRole, ActivityLog, Notification, ClubReport, Photo } from '../types';
import { generateEventDescription, generateTaskAnalysis } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plus, CheckCircle, Circle, Clock, Loader2, Sparkles, LogOut, Calendar, Layout, Search, BrainCircuit, X, Users, Activity, Filter, Bell, User as UserIcon, Settings, Save, Upload, Shield, Trash2, ChevronDown, FileText, Image as ImageIcon, PieChart as PieChartIcon, Download, Camera, Menu, Link as LinkIcon } from 'lucide-react';
import { MASCOT_URL, LOGO_URL } from '../constants';
import { downloadAsPDF } from '../utils/pdfGenerator';
import Beams from './Beams';

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
  onUpdateEvent: (event: ClubEvent) => void;

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
  onCreateEvent, onCreateTask, onCreateReport, onCreatePhoto, onUpdateTaskStatus, onUpdateEvent,
  setEvents, setTasks, setReports, setPhotos, onUpdateUser, onDeleteUser, onDeleteEvent, onDeleteTask, activityLog, addActivity, notifications, removeNotification, onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'members' | 'settings' | 'reports' | 'gallery'>('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Modal states
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // New Item States
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventImage, setNewEventImage] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventTime, setNewEventTime] = useState('6:00 PM');
  const [newEventRegistrationLink, setNewEventRegistrationLink] = useState('');
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskEventId, setNewTaskEventId] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');

  // Report Upload States
  const [reportTitle, setReportTitle] = useState('');
  const [reportFile, setReportFile] = useState('');
  const [reportEventId, setReportEventId] = useState('');
  const [reportDescription, setReportDescription] = useState('');

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

  // Member Edit State
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [editMemberName, setEditMemberName] = useState('');
  const [editMemberEmail, setEditMemberEmail] = useState('');
  const [editMemberRole, setEditMemberRole] = useState<UserRole>(UserRole.MEMBER);
  const [editMemberAvatar, setEditMemberAvatar] = useState('');

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

    if (editingEventId) {
      const updatedEvent = {
        id: editingEventId,
        title: newEventTitle,
        date: newEventDate,
        description: newEventDesc,
        location: newEventLocation || 'TBD',
        registrationLink: newEventRegistrationLink,
        imageUrl: newEventImage || events.find(e => e.id === editingEventId)?.imageUrl || `https://picsum.photos/800/400?random=${Date.now()}`
      };
      onUpdateEvent(updatedEvent);
    } else {
      const newEvent = {
        title: newEventTitle,
        date: newEventDate,
        description: newEventDesc,
        location: newEventLocation || 'TBD',
        registrationLink: newEventRegistrationLink,
        imageUrl: newEventImage || `https://picsum.photos/800/400?random=${Date.now()}`
      };
      onCreateEvent(newEvent);
    }
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
    setNewEventImage('');
    setNewEventLocation('');
    setNewEventRegistrationLink('');
    setNewEventTime('6:00 PM');
    setEditingEventId(null);
  };

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEventImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    <div className="min-h-screen bg-[#02040a] text-slate-200 flex relative overflow-hidden selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Beams lightColor="#06b6d4" />
      </div>

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {notifications.map(n => (
          <div key={n.id} className={`animate-fade-in-up min-w-[300px] p-4 rounded-lg shadow-xl border flex items-center justify-between ${n.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100' : 'bg-slate-800 border-slate-600'}`}>
            <span className="text-sm font-medium">{n.message}</span>
            <button onClick={() => removeNotification(n.id)} className="ml-4 hover:opacity-70"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-t border-white/10 md:hidden pb-safe">
        <div className="flex justify-around items-center p-2">
          {[
            { id: 'overview', icon: PieChartIcon, label: 'Overview' },
            { id: 'events', icon: Calendar, label: 'Events' },
            { id: 'members', icon: Users, label: 'Members' },
            { id: 'reports', icon: FileText, label: 'Reports' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${activeTab === tab.id
                ? 'text-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <tab.icon className={`w-6 h-6 mb-1 ${activeTab === tab.id ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : ''}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center p-2 rounded-lg transition-all ${activeTab === 'settings' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <Settings className={`w-6 h-6 mb-1 ${activeTab === 'settings' ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : ''}`} />
            <span className="text-[10px] font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}


      {/* Sidebar */}
      <aside className={`w-64 bg-[#050505]/80 backdrop-blur-xl border-r border-white/5 hidden md:flex flex-col fixed h-full z-30 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Logo" className="w-8 h-8 object-contain" />
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
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
            { id: 'members', icon: Users, label: 'Member Profiles' },
            { id: 'reports', icon: FileText, label: 'Report Manager' },
            { id: 'gallery', icon: Camera, label: 'Gallery Manager' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${activeTab === tab.id
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
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
                {user.role === UserRole.ADMIN && <Shield className="w-3 h-3" />}
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
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen relative w-full pb-24 md:pb-20">
        <div className="max-w-7xl mx-auto space-y-8 pb-20">

          {/* Header & Search */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
            <div className="flex items-center gap-4">


              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {activeTab === 'overview' ? `Welcome back, ${user.name.split(' ')[0]}` :
                    activeTab === 'events' ? 'Events' :
                      activeTab === 'members' ? 'Member Profiles' :
                        activeTab === 'reports' ? 'Report Management' :
                          activeTab === 'gallery' ? 'Gallery Management' : 'Profile Settings'}
                </h1>
                <p className="text-slate-400 text-xs md:text-sm hidden sm:block">
                  {activeTab === 'overview' ? "Here's your daily briefing." :
                    activeTab === 'events' ? "Manage upcoming club activities." :
                      activeTab === 'members' ? "View club member profiles and information." :
                        activeTab === 'reports' ? "Upload and manage public reports." :
                          activeTab === 'gallery' ? "Upload photos from events." : "Update your account information."}
                </p>
              </div>
            </div>

            {activeTab !== 'overview' && activeTab !== 'settings' && activeTab !== 'members' && activeTab !== 'reports' && activeTab !== 'gallery' && (
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
                <div key={i} className={`${stat.bg} p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all`}>
                  <div className="relative z-10">
                    <h3 className="text-slate-400 mb-1 text-sm font-medium">{stat.label}</h3>
                    <p className={`text-4xl font-bold ${stat.color}`}>{stat.val}</p>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-cyan-500/20 transition-colors"></div>
                </div>
              ))}

              {/* Upcoming Events Timeline */}
              <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-[#0A0A0C] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 flex-shrink-0">
                  <Calendar className="w-5 h-5 text-cyan-500" /> Upcoming Events
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {events.filter(e => e.date >= new Date().toISOString().split('T')[0]).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <Calendar className="w-12 h-12 text-slate-700 mb-4" />
                      <p className="text-slate-500 text-sm">No upcoming events scheduled</p>
                      <p className="text-slate-600 text-xs mt-1">Create an event to get started</p>
                    </div>
                  ) : (
                    events
                      .filter(e => e.date >= new Date().toISOString().split('T')[0])
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .slice(0, 5)
                      .map((event, index) => (
                        <div key={event.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex flex-col items-center justify-center">
                              <span className="text-[10px] text-cyan-400 font-bold uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                              <span className="text-lg font-bold text-white leading-none">{new Date(event.date).getDate()}</span>
                            </div>
                            {index < 4 && <div className="w-0.5 h-full bg-gradient-to-b from-cyan-500/30 to-transparent mt-2"></div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">{event.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 6:00 PM
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Layout className="w-3 h-3" /> {event.location || 'TBD'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-yellow-500" /> Recent Activity</h3>
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
                    {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3 h-3" />}
                    {isAnalyzing ? 'Analyzing...' : 'Generate Report'}
                  </button>
                </div>
                <div className="text-slate-300 text-sm leading-relaxed min-h-[60px] bg-slate-950/50 p-4 rounded-xl border border-white/5 relative z-10">
                  {aiAnalysis ? (
                    <div className="whitespace-pre-line animate-fade-in-up pr-24 relative group">
                      {aiAnalysis}
                      <button
                        onClick={() => {
                          alert(`Preparing PDF download: DAC_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);
                          downloadAsPDF("GEMINI AI ANALYSIS", aiAnalysis, `DAC_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);
                        }}
                        className="absolute top-0 right-0 bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white p-2 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100 flex items-center gap-2 text-xs"
                      >
                        <Download className="w-4 h-4" /> Download PDF
                      </button>
                    </div>
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
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-900/20 transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4" /> Create Event
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map(event => (
                  <div key={event.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-cyan-500/30 transition-all duration-300">
                    <div className="h-48 overflow-hidden relative">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white shadow-sm">{event.title}</h3>
                        <p className="text-cyan-300 text-xs font-semibold flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date} • {event.location}</p>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-slate-400 text-sm mb-4 flex-1 leading-relaxed">{event.description}</p>
                      {canManageContent && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingEventId(event.id);
                              setNewEventTitle(event.title);
                              setNewEventDate(event.date);
                              setNewEventDesc(event.description);
                              setNewEventLocation(event.location || '');
                              setNewEventRegistrationLink(event.registrationLink || '');
                              setNewEventImage(event.imageUrl || '');
                              setEventModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                            title="Edit Event"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this event?')) {
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

          {/* TAB: MEMBERS */}
          {activeTab === 'members' && (
            <div className="animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(member => (
                  <div
                    key={member.id}
                    onClick={() => {
                      setEditingMember(member);
                      setEditMemberName(member.name);
                      setEditMemberEmail(member.email);
                      setEditMemberRole(member.role);
                      setEditMemberAvatar(member.avatar || '');
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-24 h-24 rounded-full mb-4 border-4 border-slate-800 group-hover:border-cyan-500/50 transition-all"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center mb-4">
                          <Settings className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-sm text-slate-400 mb-2">{member.email}</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${member.role === UserRole.ADMIN
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : member.role === UserRole.MEMBER
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                        {member.role === UserRole.ADMIN && <Shield className="w-3 h-3" />}
                        {member.role === UserRole.MEMBER && <UserIcon className="w-3 h-3" />}
                        {member.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Member Modal */}
              {editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Settings className="w-6 h-6 text-indigo-500" />
                        Edit Member Profile
                      </h2>
                      <button
                        onClick={() => setEditingMember(null)}
                        className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      onUpdateUser({
                        ...editingMember,
                        name: editMemberName,
                        email: editMemberEmail,
                        role: editMemberRole,
                        avatar: editMemberAvatar
                      });
                      setEditingMember(null);
                      addActivity('Updated member profile', editMemberName);
                    }} className="space-y-6">
                      {/* Avatar */}
                      <div className="flex items-center gap-6">
                        <img
                          src={editMemberAvatar || 'https://placehold.co/150'}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full border-4 border-slate-700"
                        />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-slate-400 mb-2">Avatar URL</label>
                          <input
                            type="text"
                            value={editMemberAvatar}
                            onChange={(e) => setEditMemberAvatar(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>
                      </div>

                      {/* Name & Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                          <input
                            type="text"
                            required
                            value={editMemberName}
                            onChange={(e) => setEditMemberName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                          <input
                            type="email"
                            required
                            value={editMemberEmail}
                            onChange={(e) => setEditMemberEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Role</label>
                        <select
                          value={editMemberRole}
                          onChange={(e) => setEditMemberRole(e.target.value as UserRole)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value={UserRole.MEMBER}>Member</option>
                          <option value={UserRole.ADMIN}>Admin</option>
                        </select>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingMember(null)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-lg font-semibold transition-all"
                        >
                          Cancel
                        </button>
                        {editingMember.id !== user.id && onDeleteUser && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete ${editingMember.name}?`)) {
                                onDeleteUser(editingMember.id);
                                setEditingMember(null);
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              )}
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
                      <Upload className="w-5 h-5 text-cyan-500" /> Upload New Report
                    </h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!reportTitle) {
                        alert("Please provide a title for the report.");
                        return;
                      }

                      // Get event thumbnail if event is selected
                      const selectedEvent = events.find(ev => ev.id === reportEventId);
                      const thumbnail = selectedEvent?.imageUrl || 'https://placehold.co/400x300/0f172a/22d3ee?text=Report';

                      const newReport = {
                        title: reportTitle,
                        date: new Date().toISOString().split('T')[0],
                        description: reportDescription || `Report for ${selectedEvent?.title || 'General'}`,
                        thumbnailUrl: thumbnail,
                        fileUrl: reportFile || '#',
                        eventId: reportEventId || undefined
                      };

                      onCreateReport(newReport);
                      setReportTitle('');
                      setReportDescription('');
                      setReportFile('');
                      setReportEventId('');
                    }} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Report Title</label>
                        <input required type="text" value={reportTitle} onChange={e => setReportTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500" placeholder="e.g. Monthly Activity Log" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Related Event (Optional)</label>
                        <select value={reportEventId} onChange={e => setReportEventId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500">
                          <option value="">Select Event (uses event thumbnail)</option>
                          {events.map(e => (
                            <option key={e.id} value={e.id}>{e.title}</option>
                          ))}
                        </select>
                      </div>

                      {/* Show event thumbnail preview */}
                      {reportEventId && (
                        <div className="w-full h-32 rounded-lg overflow-hidden border border-cyan-500/30">
                          <img
                            src={events.find(e => e.id === reportEventId)?.imageUrl}
                            alt="Event thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <p className="text-xs text-cyan-400 mt-1">This thumbnail will be used for the report</p>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                        <textarea
                          value={reportDescription}
                          onChange={e => setReportDescription(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 resize-none"
                          rows={3}
                          placeholder="Brief description of the report..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Select File (PDF)</label>
                        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer" required />
                      </div>

                      <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg transition-all hover:scale-[1.02] mt-2">
                        Publish Report
                      </button>
                    </form>
                  </div>
                )}

                {/* Published Reports List */}
                <div className={`${canManageContent ? 'md:col-span-2' : 'md:col-span-3'}`}>
                  <h3 className="text-lg font-bold text-white mb-6">Published Reports</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reports.length === 0 && <p className="col-span-full text-slate-500 italic border border-dashed border-slate-800 p-8 rounded-xl text-center">No reports uploaded yet.</p>}
                    {reports.map(report => (
                      <div key={report.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-colors group">
                        {/* Thumbnail */}
                        <div className="h-32 overflow-hidden relative">
                          <img
                            src={report.thumbnailUrl || 'https://placehold.co/400x300/0f172a/22d3ee?text=Report'}
                            alt={report.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-medium text-white text-sm group-hover:text-cyan-400 transition-colors">{report.title}</h4>
                              <p className="text-xs text-slate-500 mt-1">{report.date}</p>
                              {report.description && (
                                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{report.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  if (report.fileUrl && report.fileUrl !== '#') {
                                    window.open(report.fileUrl, '_blank');
                                  } else {
                                    downloadAsPDF(report.title, report.description, `${report.title}.pdf`);
                                  }
                                }}
                                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                title="Download PDF"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              {canManageContent && (
                                <button onClick={() => {
                                  if (confirm('Delete report?')) {
                                    setReports(prev => prev.filter(r => r.id !== report.id));
                                    addActivity('Deleted Report', report.title);
                                  }
                                }} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
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
                      <ImageIcon className="w-5 h-5 text-indigo-500" /> Add to Gallery
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
                              if (confirm('Delete photo?')) {
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

      {/* Create Event Modal - Enhanced UI */}
      {isEventModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-xl overflow-y-auto"
          onClick={() => { setEventModalOpen(false); resetEventForm(); }}
        >
          <div
            className="bg-[#0A0A0C] rounded-[2rem] w-full max-w-2xl border border-white/10 shadow-2xl shadow-cyan-500/10 relative overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Gradient */}
            <div className="relative h-24 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
              <div className="absolute bottom-4 left-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{editingEventId ? 'Edit Event' : 'Create New Event'}</h3>
                    <p className="text-white/70 text-sm">{editingEventId ? 'Update event details' : 'Add a new event to the calendar'}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setEventModalOpen(false); resetEventForm(); }}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleCreateEvent} className="p-6 space-y-5">
              {/* Event Title */}
              <div className="group">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <span className="w-5 h-5 rounded bg-cyan-500/10 flex items-center justify-center">
                    <FileText className="w-3 h-3 text-cyan-400" />
                  </span>
                  Event Title
                </label>
                <input
                  required
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
                  placeholder="e.g. SQL Bootcamp, DataVIZ Workshop"
                />
              </div>

              {/* Date, Time, Location Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center">
                      <Calendar className="w-3 h-3 text-blue-400" />
                    </span>
                    Date
                  </label>
                  <input
                    required
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span className="w-5 h-5 rounded bg-purple-500/10 flex items-center justify-center">
                      <Clock className="w-3 h-3 text-purple-400" />
                    </span>
                    Time
                  </label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
                    placeholder="6:00 PM"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center">
                      <Layout className="w-3 h-3 text-emerald-400" />
                    </span>
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
                    placeholder="AV Hall"
                  />
                </div>
              </div>

              {/* Registration Link (New) */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <span className="w-5 h-5 rounded bg-orange-500/10 flex items-center justify-center">
                    <LinkIcon className="w-3 h-3 text-orange-400" />
                  </span>
                  Registration Link
                </label>
                <input
                  type="url"
                  value={newEventRegistrationLink}
                  onChange={(e) => setNewEventRegistrationLink(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
                  placeholder="https://lu.ma/event-id"
                />
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <span className="w-5 h-5 rounded bg-pink-500/10 flex items-center justify-center">
                    <ImageIcon className="w-3 h-3 text-pink-400" />
                  </span>
                  Event Thumbnail
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="flex items-center justify-center gap-2 p-4 bg-slate-900/50 border-2 border-dashed border-white/10 hover:border-cyan-500/50 rounded-xl cursor-pointer transition-all group">
                      <Upload className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      <span className="text-sm text-slate-500 group-hover:text-cyan-400 transition-colors">
                        {newEventImage ? 'Change Image' : 'Upload Image'}
                      </span>
                      <input type="file" onChange={handleEventImageChange} accept="image/*" className="hidden" />
                    </label>
                  </div>
                  {newEventImage && (
                    <div className="w-24 h-16 rounded-xl overflow-hidden border border-white/10 relative group">
                      <img src={newEventImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span className="w-5 h-5 rounded bg-amber-500/10 flex items-center justify-center">
                      <FileText className="w-3 h-3 text-amber-400" />
                    </span>
                    Description
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDesc}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 border border-cyan-500/20 rounded-full text-xs text-cyan-400 font-medium transition-all disabled:opacity-50"
                  >
                    {isGeneratingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI Auto-Fill
                  </button>
                </div>
                <textarea
                  required
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white h-28 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600 resize-none"
                  placeholder="Describe your event in detail..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setEventModalOpen(false); resetEventForm(); }}
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-xl text-slate-300 font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white font-bold transition-all hover:shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2"
                >
                  {editingEventId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingEventId ? 'Update Event' : 'Create Event'}
                </button>
              </div>
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
  getAssigneeName: (id: string | null) => string;
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
              if (confirm('Are you sure you want to delete this task?')) {
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