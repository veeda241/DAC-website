import React, { useState, useEffect } from 'react';
import { supabase, fetchEvents, createEvent, fetchTasks, createTask, fetchReports, createReport, fetchPhotos, createPhoto, updateTaskStatus } from './services/supabaseService';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { User, ClubEvent, Task, ActivityLog, Notification, UserRole, ClubReport, Photo, TaskStatus } from './types';
import { MOCK_USERS } from './constants';

const App: React.FC = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Data State
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [reports, setReports] = useState<ClubReport[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  
  // Dynamic State
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch data from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      // Users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*');
      if (!userError && userData) setUsers(userData as User[]);

      // Events
      const eventsData = await fetchEvents();
      setEvents(eventsData);

      // Tasks
      const tasksData = await fetchTasks();
      setTasks(tasksData);

      // Reports
      const reportsData = await fetchReports();
      setReports(reportsData);

      // Photos
      const photosData = await fetchPhotos();
      setPhotos(photosData);
    };

    loadData();
  }, []);

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
      role: UserRole.MEMBER,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };

    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select();

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
    setNotifications([]);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    const { error } = await supabase
      .from('users')
      .update(updatedUser)
      .eq('id', updatedUser.id);

    if (error) {
      console.error('Error updating user:', error);
      addNotification('Failed to update user.', 'error');
      return;
    }

    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    
    if (currentUser && currentUser.id === updatedUser.id) {
      addNotification('Profile updated successfully', 'success');
      addActivity('Updated Profile', 'Changed account details');
    } else {
        addNotification(`User ${updatedUser.name}'s profile updated.`, 'info');
    }
  };

  const handleDeleteUser = async (userId: string) => {
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
    setTasks(prev => prev.map(t => t.assigneeId === userId ? { ...t, assigneeId: null } : t));
    addNotification('User removed and tasks unassigned', 'info');
  };

  // --- New Create Handlers ---

  const handleCreateEvent = async (eventData: Omit<ClubEvent, 'id'>) => {
    const newEvent = await createEvent(eventData);
    if (newEvent) {
      setEvents(prev => [...prev, newEvent]);
      addActivity('Created Event', newEvent.title);
      addNotification('Event created successfully!', 'success');
    } else {
      addNotification('Failed to create event.', 'error');
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id'>) => {
    const newTask = await createTask(taskData);
    if (newTask) {
      setTasks(prev => [...prev, newTask]);
      // Use assignee name if available
      const assignee = users.find(u => u.id === taskData.assigneeId);
      addActivity('Assigned Task', `${newTask.title} to ${assignee ? assignee.name : 'Unassigned'}`);
      addNotification('Task created successfully!', 'success');
    } else {
      addNotification('Failed to create task.', 'error');
    }
  };

  const handleCreateReport = async (reportData: Omit<ClubReport, 'id'>) => {
    const newReport = await createReport(reportData);
    if (newReport) {
      setReports(prev => [newReport, ...prev]); // Add to top
      addActivity('Published Report', newReport.title);
      addNotification('Report published successfully!', 'success');
    } else {
      addNotification('Failed to publish report.', 'error');
    }
  };

  const handleCreatePhoto = async (photoData: Omit<Photo, 'id'>) => {
    const newPhoto = await createPhoto(photoData);
    if (newPhoto) {
      setPhotos(prev => [newPhoto, ...prev]);
      addActivity('Uploaded Photo', `Added to Gallery: ${newPhoto.caption}`);
      addNotification('Photo uploaded successfully!', 'success');
    } else {
      addNotification('Failed to upload photo.', 'error');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: TaskStatus) => {
      const updatedTask = await updateTaskStatus(taskId, status);
      if (updatedTask) {
          setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
          
          let action = 'Updated Task';
          if (status === TaskStatus.IN_PROGRESS) action = 'Started Task';
          if (status === TaskStatus.COMPLETED) action = 'Completed Task';
          addActivity(action, updatedTask.title);
      } else {
          addNotification('Failed to update task status', 'error');
      }
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
  };

  const addNotification = (message: string, type: 'success' | 'info' | 'error') => {
    const id = `notif-${Date.now()}`;
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleDeleteEvent = async (eventId: string) => {
    // In a real app, delete from Supabase
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) {
        addNotification('Failed to delete event', 'error');
        return;
    }
    setEvents(prev => prev.filter(e => e.id !== eventId));
    addActivity('Deleted Event', `Event with ID ${eventId} removed.`);
  };

  const handleDeleteTask = async (taskId: string) => {
     // In a real app, delete from Supabase
     const { error } = await supabase.from('tasks').delete().eq('id', taskId);
     if (error) {
         addNotification('Failed to delete task', 'error');
         return;
     }
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
          onCreateEvent={handleCreateEvent}
          onCreateTask={handleCreateTask}
          onCreateReport={handleCreateReport}
          onCreatePhoto={handleCreatePhoto}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          setEvents={setEvents} // Still needed for updates? Or should we add onUpdateEvent?
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