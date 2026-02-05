import React, { useState, useEffect } from 'react';
import { supabase, fetchEvents, createEvent, updateEvent, fetchTasks, createTask, fetchReports, createReport, fetchPhotos, createPhoto, updateTaskStatus } from './services/supabaseService';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { User, ClubEvent, Task, ActivityLog, Notification, UserRole, ClubReport, Photo, TaskStatus } from './types';
import { MOCK_USERS, MOCK_REPORTS } from './constants';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
    // Global State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    // Data State
    const [events, setEvents] = useState<ClubEvent[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [reports, setReports] = useState<ClubReport[]>(MOCK_REPORTS);
    const [photos, setPhotos] = useState<Photo[]>([]);

    // Dynamic State
    const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Loading State
    const [isLoading, setIsLoading] = useState(true);
    const [isAppReady, setIsAppReady] = useState(false); // New state to delay background rendering

    // Delay background rendering to allow video to start smoothly
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAppReady(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Fetch data from Supabase on component mount
    useEffect(() => {
        const loadData = async () => {
            // Users - Merge MOCK_USERS with Supabase users to ensure admin account is always available
            if (supabase) {
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*');
                if (!userError && userData) {
                    // Merge MOCK_USERS with fetched users, avoiding duplicates by email
                    const mergedUsers = [...MOCK_USERS];
                    (userData as User[]).forEach(dbUser => {
                        if (!mergedUsers.some(mockUser => mockUser.email.toLowerCase() === dbUser.email.toLowerCase())) {
                            mergedUsers.push(dbUser);
                        }
                    });
                    setUsers(mergedUsers);
                }
            }

            // Events - Load from Supabase only
            const eventsData = await fetchEvents();
            setEvents(eventsData);

            // Tasks
            const tasksData = await fetchTasks();
            setTasks(tasksData);

            // Reports - Fetch from Supabase and merge with Mocks
            const reportsData = await fetchReports();
            if (reportsData.length > 0) {
                const mergedReports = [...MOCK_REPORTS];
                reportsData.forEach(dbRep => {
                    if (!mergedReports.some(m => m.id === dbRep.id)) {
                        mergedReports.unshift(dbRep); // Add new DB uploads to the top
                    }
                });
                // Sort by date descending
                mergedReports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setReports(mergedReports);
            } else {
                setReports([...MOCK_REPORTS]);
            }

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
        if (!supabase) {
            addNotification('Database connection missing.', 'error');
            return;
        }

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
        if (!supabase) {
            addNotification('Database connection missing.', 'error');
            return;
        }

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
        if (!supabase) {
            addNotification('Database connection missing.', 'error');
            return;
        }

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

    const handleUpdateEvent = async (updatedEvent: ClubEvent) => {
        // Update in Supabase if connected
        if (supabase) {
            const updated = await updateEvent(updatedEvent);
            if (!updated) {
                addNotification('Failed to save event to database', 'error');
                return;
            } else {
                addNotification('Event updated and saved!', 'success');
                setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
                addActivity('Updated Event', updated.title);
            }
        } else {
            addNotification('Database disconnected. Update failed.', 'error');
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
        // Try to delete from Supabase if connected
        if (supabase) {
            const { error } = await supabase.from('events').delete().eq('id', eventId);
            if (error) {
                console.log('Supabase delete failed (may be a local event):', error.message);
            }
        }
        // Always remove from local state
        setEvents(prev => prev.filter(e => e.id !== eventId));
        addActivity('Deleted Event', `Event with ID ${eventId} removed.`);
        addNotification('Event deleted successfully', 'success');
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!supabase) return;
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
            {/* Main Content Rendered Always (behind loading screen) - Delayed to prevent lag */}
            {isAppReady && (
                !currentUser ? (
                    <>
                        <LandingPage
                            events={events}
                            reports={reports}
                            photos={photos}
                            onLoginClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                            onRegisterClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
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
                        onUpdateEvent={handleUpdateEvent}
                        setEvents={setEvents}
                        setTasks={setTasks}
                        setReports={setReports}
                        setPhotos={setPhotos}
                        onUpdateUser={handleUpdateUser}
                        onDeleteUser={handleDeleteUser}
                        onDeleteEvent={handleDeleteEvent}
                        onDeleteTask={handleDeleteTask}
                        activityLog={activityLog}
                        addActivity={addActivity}
                        notifications={notifications}
                        removeNotification={removeNotification}
                        onLogout={handleLogout}
                    />
                )
            )}

            {/* Loading Screen Overlay */}
            {isLoading && (
                <LoadingScreen onFinished={() => setIsLoading(false)} />
            )}
        </>
    );
};

export default App;
