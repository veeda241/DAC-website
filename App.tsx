import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { User, ClubEvent, Task, ActivityLog, Notification, UserRole, ClubReport, Photo } from './types';
import { MOCK_EVENTS, MOCK_TASKS, MOCK_USERS, MOCK_REPORTS, MOCK_PHOTOS } from './constants';

const App: React.FC = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Data State (Lifted up so it persists between views)
  const [events, setEvents] = useState<ClubEvent[]>(MOCK_EVENTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  
  // Initialize users from localStorage if available, otherwise use MOCK_USERS
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('dac_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  // Persist users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dac_users', JSON.stringify(users));
  }, [users]);

  const [reports, setReports] = useState<ClubReport[]>(MOCK_REPORTS);
  const [photos, setPhotos] = useState<Photo[]>(MOCK_PHOTOS);
  
  // Dynamic State
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    addNotification(`Welcome back, ${user.name}!`, 'success');
  };

  const handleRegister = (name: string, email: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: UserRole.MEMBER, // Default to Member
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setShowAuthModal(false);
    addNotification(`Welcome to Data Analytics Club, ${name}!`, 'success');
    addActivity('New Member Joined', `${name} joined the club.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setNotifications([]); // Clear specific session notifications
  };

  const handleUpdateUser = (updatedUser: User) => {
    // If the currently logged in user is updating themselves, update current session
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
    // Update the user in the main users list as well so assignments reflect the new name/avatar
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    
    // Only show notification if it wasn't a role update performed by admin on someone else
    if (currentUser && currentUser.id === updatedUser.id) {
      addNotification('Profile updated successfully', 'success');
      addActivity('Updated Profile', 'Changed account details');
    }
  };

  const handleDeleteUser = (userId: string) => {
      setUsers(prev => prev.filter(u => u.id !== userId));
      // Also unassign their tasks
      setTasks(prev => prev.map(t => t.assigneeId === userId ? { ...t, assigneeId: null } : t));
      addNotification('User removed and tasks unassigned', 'info');
  };

  const addActivity = (action: string, details?: string) => {
    if (!currentUser) return;
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      userId: currentUser.id,
      action,
      details,
      timestamp: new Date()
    };
    setActivityLog(prev => [...prev, newLog]);
    
    // Auto-notify for success actions
    if (action.includes('Created') || action.includes('Completed') || action.includes('Assigned') || action.includes('Published') || action.includes('Uploaded')) {
       addNotification(`${action} successfully!`, 'success');
    }
  };

  const addNotification = (message: string, type: 'success' | 'info' | 'error') => {
    const id = `notif-${Date.now()}`;
    setNotifications(prev => [...prev, { id, message, type }]);
    // Auto remove after 3s
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    addActivity('Deleted Event', `Event with ID ${eventId} removed.`);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    addActivity('Deleted Task', `Task with ID ${taskId} removed.`);
  };

  return (
    <>
      {!currentUser ? (
        <>
          <LandingPage 
            events={events}
            reports={reports}
            photos={photos}
            onLoginClick={() => setShowAuthModal(true)} 
          />
          {showAuthModal && (
            <Auth 
              users={users}
              onLogin={handleLogin} 
              onRegister={handleRegister}
              onCancel={() => setShowAuthModal(false)} 
            />
          )}
        </>
      ) : (
        <Dashboard 
          user={currentUser}
          users={users}
          events={events}
          tasks={tasks}
          reports={reports}
          photos={photos}
          setEvents={setEvents}
          setTasks={setTasks}
          setReports={setReports}
          setPhotos={setPhotos}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          onDeleteEvent={handleDeleteEvent}
          onDeleteTask={handleDeleteTask}
          onLogout={handleLogout}
          activityLog={activityLog}
          addActivity={addActivity}
          notifications={notifications}
          removeNotification={removeNotification}
        />
      )}
    </>
  );
};

export default App;