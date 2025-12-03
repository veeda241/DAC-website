import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseService';
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
  
  // State for users, initially empty or MOCK_USERS until fetched from Supabase
  const [users, setUsers] = useState<User[]>(MOCK_USERS); // Use MOCK_USERS as fallback/initial while loading

  const [reports, setReports] = useState<ClubReport[]>(MOCK_REPORTS);
  const [photos, setPhotos] = useState<Photo[]>(MOCK_PHOTOS);
  
  // Dynamic State
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch users from Supabase on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users') // Assuming 'users' is the table name
        .select('*');

      if (error) {
        console.error('Error fetching users:', error);
        // Fallback to MOCK_USERS if Supabase fetch fails
        setUsers(MOCK_USERS);
      } else if (data) {
        setUsers(data as User[]);
      } else {
        // If no data and no error, means table is empty, use MOCK_USERS
        setUsers(MOCK_USERS);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this runs once on mount

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    addNotification(`Welcome back, ${user.name}!`, 'success');
  };

  const handleRegister = async (name: string, email: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`, // Supabase can generate UUIDs, but we'll keep this for now.
      name,
      email,
      role: UserRole.MEMBER, // Default to Member
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('users') // Assuming 'users' table
      .insert([newUser])
      .select(); // Select the inserted data to get any generated fields (like default IDs)

    if (error) {
      console.error('Error registering user:', error);
      addNotification('Failed to register user.', 'error');
      return;
    }

    if (data && data.length > 0) {
      const registeredUser = data[0] as User;
      setUsers(prev => [...prev, registeredUser]);
      setCurrentUser(registeredUser);
      setShowAuthModal(false);
      addNotification(`Welcome to Data Analytics Club, ${name}!`, 'success');
      addActivity('New Member Joined', `${name} joined the club.`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setNotifications([]); // Clear specific session notifications
  };

  const handleUpdateUser = async (updatedUser: User) => {
    // Update in Supabase
    const { error } = await supabase
      .from('users')
      .update(updatedUser)
      .eq('id', updatedUser.id);

    if (error) {
      console.error('Error updating user:', error);
      addNotification('Failed to update user.', 'error');
      return;
    }

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
    } else {
        // If an admin updated someone else's role, notify admin
        addNotification(`User ${updatedUser.name}'s profile updated.`, 'info');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Delete from Supabase
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      addNotification('Failed to delete user.', 'error');
      return;
    }

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