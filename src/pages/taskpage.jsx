import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from "uuid";
import { getStreak } from "../services/gemini";
import axios from 'axios';
import {
    CheckCircle, Target, Calendar, Clock, Award, Flame,
    Trophy, Star, Zap, TrendingUp, ChevronRight, ChevronDown,
    CalendarDays, Filter, Search, Bell, Settings, RefreshCw,
    BookOpen, Users, BarChart3, Download, Share2, Edit3,
    PlayCircle, PauseCircle, SkipForward, RotateCcw, Sparkles,
    AlertTriangle, AlertCircle, ChevronUp, X, Timer, Hourglass,
    TrendingDown
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const TaskPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [taskData, setTaskData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [activePhase, setActivePhase] = useState(0);
    const [todaysTasks, setTodaysTasks] = useState([]);
    const [showBadgePopup, setShowBadgePopup] = useState(false);
    const [earnedBadges, setEarnedBadges] = useState([]);
    const [userProblem, setUserProblem] = useState('');
    const [streakAnimation, setStreakAnimation] = useState(false);
    const [streakTimer, setStreakTimer] = useState(0);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [showStreakWarning, setShowStreakWarning] = useState(false);
    const [taskFilter, setTaskFilter] = useState('current'); // 'current', 'all', 'completed', 'pending'
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const filterRef = useRef(null);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        currentStreak: 0,
        longestStreak: 0
    });

    // API endpoint configuration
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const [streak, setStreak] = useState(null);

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Streak timer countdown
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const diff = endOfDay - now;
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            return { hours, minutes, seconds };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const newTime = calculateTimeLeft();
            setTimeLeft(newTime);

            // Show warning if less than 2 hours left
            if (newTime.hours <= 2 && newTime.hours >= 0) {
                setShowStreakWarning(true);
            }

            // Check if streak should be broken (past midnight)
            if (newTime.hours < 0) {
                handleStreakBreak();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const res = await getStreak();
                setStreak(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStreak();
    }, []);

    const getDeviceId = () => {
        let deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
            deviceId = uuidv4();
            localStorage.setItem("deviceId", deviceId);
        }
        return deviceId;
    };

    const fetchTaskData = async () => {
        setLoading(true);
        try {
            const deviceId = getDeviceId();
            const response = await axios.get(`${API_BASE_URL}/tasks`, {
                headers: {
                    "x-device-id": deviceId
                },
                withCredentials: true
            });

            if (response.data.success) {
                const backendData = response.data;
                const processedData = {
                    tasks: backendData.tasks || [],
                    strategy: backendData.strategy || {
                        overview: "Personalized transformation journey based on your problem",
                        estimatedTime: "60 days",
                        phases: [
                            {
                                name: "Foundation",
                                duration: "Days 1-15",
                                description: "Build core foundation",
                                color: "from-blue-500 to-cyan-500"
                            },
                            {
                                name: "Development",
                                duration: "Days 16-30",
                                description: "Develop new skills",
                                color: "from-purple-500 to-pink-500"
                            },
                            {
                                name: "Application",
                                duration: "Days 31-45",
                                description: "Apply what you learned",
                                color: "from-amber-500 to-orange-500"
                            },
                            {
                                name: "Mastery",
                                duration: "Days 46-60",
                                description: "Achieve mastery and results",
                                color: "from-emerald-500 to-green-500"
                            }
                        ]
                    },
                    totalDays: backendData.stats?.totalDays || 60,
                    currentStreak: backendData.stats?.currentStreak || 0,
                    longestStreak: backendData.stats?.longestStreak || 0,
                    planStartDate: backendData.stats?.planStartDate || new Date().toISOString(),
                    _id: "backend-task-data"
                };

                setTaskData(processedData);
                setStats(backendData.stats || {});
                processTaskData(processedData, backendData.stats);

                const storedProblem = localStorage.getItem("userProblem") ||
                    location.state?.problemText ||
                    "Transforming my career and achieving professional growth";
                setUserProblem(storedProblem);

                checkBadges(backendData.stats?.completed || 0);
            } else {
                throw new Error("Failed to fetch tasks from backend");
            }
        } catch (err) {
            console.error("Error fetching task data:", err);
            setError("Failed to load your tasks. Please try again.");
            createMockData();
        } finally {
            setLoading(false);
        }
    };

    const createMockData = () => {
        const mockData = {
            tasks: Array.from({ length: 60 }, (_, i) => ({
                id: `mock-${i + 1}`,
                day: i + 1,
                title: `Day ${i + 1}: Develop ${['Communication', 'Technical', 'Leadership', 'Problem-solving'][i % 4]} Skills`,
                description: `Complete the daily challenge for day ${i + 1} to build your professional capabilities.`,
                priority: i % 5 === 0 ? 'high' : (i % 3 === 0 ? 'medium' : 'low'),
                completed: i < 3,
                notes: i < 3 ? "Completed on " + new Date().toLocaleDateString() : ""
            })),
            strategy: {
                overview: 'A comprehensive journey to transform your career by building skills, networking, and creating opportunities.',
                estimatedTime: '60 days',
                phases: [
                    {
                        name: 'Foundation Building',
                        duration: 'Days 1-15',
                        description: 'Establish core skills and mindset',
                        color: 'from-blue-500 to-cyan-500'
                    },
                    {
                        name: 'Skill Development',
                        duration: 'Days 16-30',
                        description: 'Learn and practice new abilities',
                        color: 'from-purple-500 to-pink-500'
                    },
                    {
                        name: 'Application',
                        duration: 'Days 31-45',
                        description: 'Apply skills to real projects',
                        color: 'from-amber-500 to-orange-500'
                    },
                    {
                        name: 'Career Launch',
                        duration: 'Days 46-60',
                        description: 'Secure opportunities and network',
                        color: 'from-emerald-500 to-green-500'
                    }
                ]
            },
            totalDays: 60,
            currentStreak: 3,
            longestStreak: 3,
            planStartDate: new Date().toISOString(),
            _id: 'mock-id-' + Date.now()
        };

        const mockStats = {
            total: 60,
            completed: 3,
            pending: 57,
            highPriority: 12,
            mediumPriority: 20,
            lowPriority: 28,
            currentStreak: 3,
            longestStreak: 3,
            totalDays: 60,
            planStartDate: mockData.planStartDate
        };

        setTaskData(mockData);
        setStats(mockStats);
        processTaskData(mockData, mockStats);

        const storedProblem = localStorage.getItem('userProblem') ||
            "I want to transform my career and achieve professional growth";
        setUserProblem(storedProblem);
    };

    const processTaskData = (data, statsData) => {
        if (!data) return;

        const startDate = new Date(data.planStartDate);
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const currentDay = Math.min(diffDays, data.totalDays || 60);

        const todayTasks = data.tasks?.filter(task => task.day === currentDay) ||
            data.tasks?.slice(0, 3) || [];
        setTodaysTasks(todayTasks);

        const completed = data.tasks?.filter(task => task.completed) || [];
        setCompletedTasks(completed);
    };

    const checkBadges = (completedCount) => {
        const badges = [];
        if (completedCount > 0) badges.push('first_task');
        if (stats.currentStreak >= 3) badges.push('three_day_streak');
        if (completedCount >= 7) badges.push('first_week');
        setEarnedBadges(badges);

        if (badges.includes('first_task') && !localStorage.getItem('firstBadgeShown')) {
            setTimeout(() => {
                setShowBadgePopup(true);
                localStorage.setItem('firstBadgeShown', 'true');
            }, 1000);
        }
    };

    const handleStreakBreak = () => {
        if (streakTimer > 0) {
            setStreakTimer(0);
            setStreak(prev => ({ ...prev, current: 0 }));
            showNotification('Streak broken! Start a new one tomorrow.', 'error');
        }
    };

    const markTaskAsComplete = async (taskId) => {
        if (!taskData) return;
        const deviceId = getDeviceId();
        try {
            const response = await axios.put(
                `${API_BASE_URL}/tasks/${taskId}/complete`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        "x-device-id": deviceId
                    },
                }
            );

            if (response.data.success) {
                const updatedTasks = taskData.tasks.map(task =>
                    task.id === taskId ? { ...task, completed: true } : task
                );

                const updatedData = {
                    ...taskData,
                    tasks: updatedTasks
                };

                setTaskData(updatedData);
                const newCompleted = updatedTasks.filter(t => t.id === taskId && t.completed);
                setCompletedTasks(prev => [...prev, ...newCompleted]);

                setStats(prev => ({
                    ...prev,
                    completed: (prev.completed || 0) + 1,
                    pending: (prev.pending || 0) - 1,
                    currentStreak: (prev.currentStreak || 0) + 1,
                    longestStreak: Math.max(prev.longestStreak || 0, (prev.currentStreak || 0) + 1)
                }));

                setStreakAnimation(true);
                setTimeout(() => setStreakAnimation(false), 2000);

                checkBadges((stats.completed || 0) + 1);
                showNotification('Task completed successfully! 🎉', 'success');
            }
        } catch (err) {
            console.error('Error updating task:', err);
            showNotification('Failed to update task. Please try again.', 'error');
        }
    };

    const showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 animate-slide-in-right`;
        notification.innerHTML = `
            <div class="bg-gradient-to-r ${type === 'success' ? 'from-emerald-500 to-green-600' : 'from-rose-500 to-pink-600'} 
                 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm">
                ${type === 'success' ? '<div class="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg></div>' :
                '<div class="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>'}
                <div>
                    <p class="font-bold text-xs">${message}</p>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    const getBadgeInfo = (badgeName) => {
        const badges = {
            first_task: {
                name: 'First Step',
                description: 'Completed your first task',
                icon: Award,
                color: 'from-yellow-500 to-amber-500'
            },
            three_day_streak: {
                name: 'Consistency Champion',
                description: 'Maintained a 3-day streak',
                icon: Flame,
                color: 'from-orange-500 to-red-500'
            },
            first_week: {
                name: 'Weekly Warrior',
                description: 'Completed tasks for 7 days',
                icon: Trophy,
                color: 'from-purple-500 to-indigo-500'
            }
        };
        return badges[badgeName] || badges.first_task;
    };

    const getPhaseTasks = (phaseIndex) => {
        if (!taskData) return [];
        const startDay = phaseIndex * 15 + 1;
        const endDay = (phaseIndex + 1) * 15;
        return taskData.tasks.filter(task => task.day >= startDay && task.day <= endDay);
    };

    const getCompletedPhaseTasks = (phaseIndex) => {
        return getPhaseTasks(phaseIndex).filter(task => task.completed).length;
    };

    const getPhaseProgress = (phaseIndex) => {
        const phaseTasks = getPhaseTasks(phaseIndex);
        if (phaseTasks.length === 0) return 0;
        const completed = phaseTasks.filter(task => task.completed).length;
        return (completed / phaseTasks.length) * 100;
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-rose-100 text-rose-700';
            case 'medium': return 'bg-amber-100 text-amber-700';
            case 'low': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'High Priority';
            case 'medium': return 'Medium Priority';
            case 'low': return 'Low Priority';
            default: return 'Normal Priority';
        }
    };

    // Filter tasks based on selected filter
    const getFilteredTasks = () => {
        if (!taskData?.tasks) return [];

        switch (taskFilter) {
            case 'current':
                return todaysTasks.filter(task => !task.completed);
            case 'completed':
                return todaysTasks.filter(task => task.completed);
            case 'pending':
                return todaysTasks.filter(task => !task.completed);
            case 'all':
            default:
                return todaysTasks;
        }
    };

    const getFilterLabel = () => {
        switch (taskFilter) {
            case 'current': return 'Current Task';
            case 'all': return 'All Tasks';
            case 'completed': return 'Completed';
            case 'pending': return 'Pending';
            default: return 'Filter Tasks';
        }
    };

    useEffect(() => {
        fetchTaskData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-sm">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-gray-800">Loading Your Journey...</h2>
                    <p className="text-gray-600 mt-1 text-xs">Preparing your personalized tasks</p>
                </motion.div>
            </div>
        );
    }

    if (error && !taskData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 text-sm">
                <div className="bg-white rounded-2xl p-6 max-w-md text-center shadow-xl">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-rose-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
                    <p className="text-gray-600 mb-4 text-xs">{error}</p>
                    <button onClick={fetchTaskData} className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-xs">
                        <RefreshCw className="w-4 h-4" /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    const filteredTasks = getFilteredTasks();
    const currentTask = todaysTasks.find(task => !task.completed);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-sm">
            {/* Badge Popup */}
            <AnimatePresence>
                {showBadgePopup && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.5, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.5, opacity: 0, y: 50 }}
                            className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-yellow-200">
                            <div className="text-center">
                                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }} transition={{ duration: 1.5 }}
                                    className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="w-12 h-12 text-white" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">🎉 Badge Unlocked!</h3>
                                <h4 className="text-lg font-bold text-amber-700 mb-2">First Step</h4>
                                <p className="text-gray-700 mb-4 text-xs">You've completed your first task!</p>
                                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowBadgePopup(false)}
                                        className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg text-xs">
                                        Awesome!
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowBadgePopup(false)}
                                        className="px-5 py-2 bg-white border-2 border-amber-300 text-amber-700 rounded-lg font-semibold hover:bg-amber-50 text-xs">
                                        View All Badges
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <button onClick={() => navigate('/')} className="flex items-center gap-1 text-white/80 hover:text-white transition-colors text-xs">
                                    <ChevronRight className="w-4 h-4 rotate-180" /> Back
                                </button>
                                <div className="h-4 w-px bg-white/30" />
                                <h1 className="text-lg font-bold">Transformation Journey</h1>
                            </div>
                            <h2 className="text-sm font-semibold opacity-90">Your Challenge:</h2>
                            <p className="text-white/80 text-xs mt-1 line-clamp-2">{userProblem}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Streak Counter with Timer */}
                            <motion.div initial={{ scale: 1 }} animate={streakAnimation ? { scale: [1, 1.2, 1] } : {}}
                                className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                                <div className="flex items-center gap-2">
                                    <Flame className="w-4 h-4 text-amber-300" />
                                    <div>
                                        <div className="text-lg font-bold">{streak?.current || 0}</div>
                                        <div className="text-xs text-white/70">Day Streak</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Streak Timer */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                                <div className="flex items-center gap-2">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                        <Clock className="w-4 h-4 text-emerald-300" />
                                    </motion.div>
                                    <div>
                                        <div className="text-lg font-bold">
                                            {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}
                                        </div>
                                        <div className="text-xs text-white/70">Streak Time Left</div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                                <div className="text-lg font-bold">
                                    {stats.completed || 0}/{stats.total || 60}
                                </div>
                                <div className="text-xs text-white/70">Tasks</div>
                            </div>
                        </div>
                    </div>

                    {/* Streak Warning */}
                    {showStreakWarning && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                            <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-amber-300/30">
                                <AlertTriangle className="w-4 h-4 text-amber-300" />
                                <span className="text-xs text-amber-100">
                                    Complete current task within <span className="font-bold">{timeLeft.hours}h {timeLeft.minutes}m</span> to maintain streak!
                                </span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Strategy Overview */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Your Transformation Strategy</h3>
                                <p className="text-gray-600 text-xs">{taskData?.strategy?.overview}</p>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {taskData?.strategy?.estimatedTime || '60 days'} journey
                            </div>
                        </div>

                        {/* Phases */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {taskData?.strategy?.phases?.map((phase, index) => (
                                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -3 }} className={`bg-gradient-to-br ${phase.color} rounded-xl p-4 text-white relative overflow-hidden cursor-pointer ${activePhase === index ? 'ring-2 ring-white/30' : ''}`}
                                    onClick={() => setActivePhase(index)}>
                                    <div className="absolute top-2 right-2">
                                        <div className="bg-white/20 rounded-full px-2 py-1 text-xs font-semibold">
                                            {getCompletedPhaseTasks(index)}/{getPhaseTasks(index).length}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="text-xs opacity-80">{phase.duration}</div>
                                        <h4 className="text-sm font-bold mt-1">{phase.name}</h4>
                                    </div>
                                    <p className="text-xs opacity-90 mb-3">{phase.description}</p>
                                    <div className="mt-2">
                                        <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                                            <motion.div className="h-full bg-white" initial={{ width: 0 }}
                                                animate={{ width: `${getPhaseProgress(index)}%` }} transition={{ duration: 1, delay: 0.5 }} />
                                        </div>
                                        <div className="text-xs mt-1 opacity-80">{Math.round(getPhaseProgress(index))}%</div>
                                    </div>
                                    {activePhase === index && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-1 right-1">
                                            <Sparkles className="w-3 h-3" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Tasks */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-900">Today's Tasks</h3>
                                        {/* Filter Dropdown */}
                                        <div className="relative" ref={filterRef}>
                                            <button onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-xs font-medium transition-colors">
                                                <Filter className="w-3 h-3" />
                                                {getFilterLabel()}
                                                <ChevronDown className="w-3 h-3" />
                                            </button>

                                            {showFilterDropdown && (
                                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                                    className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                                                    <div className="py-1">
                                                        <button onClick={() => { setTaskFilter('current'); setShowFilterDropdown(false); }}
                                                            className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 ${taskFilter === 'current' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'}`}>
                                                            Current Task
                                                        </button>
                                                        <button onClick={() => { setTaskFilter('all'); setShowFilterDropdown(false); }}
                                                            className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 ${taskFilter === 'all' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'}`}>
                                                            All Tasks
                                                        </button>
                                                        <button onClick={() => { setTaskFilter('completed'); setShowFilterDropdown(false); }}
                                                            className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 ${taskFilter === 'completed' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'}`}>
                                                            Completed
                                                        </button>
                                                        <button onClick={() => { setTaskFilter('pending'); setShowFilterDropdown(false); }}
                                                            className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 ${taskFilter === 'pending' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'}`}>
                                                            Pending
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-xs mt-1">Complete these to continue your streak</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <CalendarDays className="w-3 h-3" />
                                    Day {todaysTasks[0]?.day || 1} of {taskData?.totalDays || 60}
                                </div>
                            </div>

                            {filteredTasks.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredTasks.map((task, index) => (
                                        <motion.div key={task.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                                            whileHover={{ x: 3 }} className={`p-4 rounded-xl border-2 ${task.completed
                                                ? 'border-emerald-200 bg-emerald-50'
                                                : 'border-gray-200 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50'
                                                } transition-all`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className={`p-1.5 rounded-full ${task.completed
                                                            ? 'bg-emerald-100 text-emerald-600'
                                                            : 'bg-indigo-100 text-indigo-600'
                                                            }`}>
                                                            {task.completed ? (
                                                                <CheckCircle className="w-4 h-4" />
                                                            ) : (
                                                                <Target className="w-4 h-4" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="font-bold text-gray-900 text-sm">{task.title}</h4>
                                                                {/* Small Clock for Current Task */}
                                                                {taskFilter === 'current' && !task.completed && (
                                                                    <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                                                            <Timer className="w-3 h-3" />
                                                                        </motion.div>
                                                                        <span>
                                                                            {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    15-30 min
                                                                </span>
                                                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                                                    {getPriorityLabel(task.priority)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-700 text-xs mb-3">{task.description}</p>

                                                    {task.notes && (
                                                        <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                                                            <p className="text-xs text-blue-700">{task.notes}</p>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span>Day {task.day}</span>
                                                            {taskFilter === 'current' && !task.completed && (
                                                                <span className="text-amber-600 font-medium">Streak Active</span>
                                                            )}
                                                        </div>

                                                        {!task.completed ? (
                                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                                onClick={() => markTaskAsComplete(task._id)}
                                                                className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg text-xs">
                                                                <CheckCircle className="w-3 h-3" />
                                                                Mark Complete
                                                            </motion.button>
                                                        ) : (
                                                            <div className="flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                                                                <CheckCircle className="w-3 h-3" />
                                                                Completed
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : taskFilter === 'current' && currentTask ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                                            <Target className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Current Task: {currentTask.title}</h4>
                                            <p className="text-gray-700 text-xs mt-1">{currentTask.description}</p>
                                        </div>
                                        <div className="ml-auto flex items-center gap-2">
                                            <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1">
                                                <Timer className="w-3 h-3" />
                                                {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}
                                            </div>
                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                onClick={() => markTaskAsComplete(currentTask._id)}
                                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-xs">
                                                Complete
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-1">All tasks completed for today!</h4>
                                    <p className="text-gray-600 text-xs mb-4">Great job! Come back tomorrow for new tasks.</p>
                                    <button onClick={() => navigate('/analysis')}
                                        className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg text-xs">
                                        <Trophy className="w-3 h-3" />
                                        View Progress
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* All Tasks Grid */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">All Tasks ({stats.total || 60} Days)</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                                {taskData?.tasks?.slice(0, 60).map((task) => (
                                    <motion.button key={task.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={() => document.querySelector('#todays-tasks')?.scrollIntoView({ behavior: 'smooth' })}
                                        className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all text-xs ${task.completed
                                            ? 'bg-gradient-to-br from-emerald-100 to-green-100 border-2 border-emerald-300'
                                            : 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-indigo-300'
                                            }`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${task.completed
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-gray-300 text-gray-700'
                                            }`}>
                                            {task.completed ? (
                                                <CheckCircle className="w-3 h-3" />
                                            ) : (
                                                <div className="text-xs font-bold">{task.day}</div>
                                            )}
                                        </div>
                                        <div className="font-medium">
                                            {task.completed ? '✓' : `Day ${task.day}`}
                                        </div>
                                        {task.priority === 'high' && !task.completed && (
                                            <div className="mt-0.5">
                                                <Zap className="w-2.5 h-2.5 text-amber-500" />
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Stats & Badges */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 text-xs">Overall Progress</span>
                                        <span className="font-bold text-gray-900 text-xs">
                                            {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" initial={{ width: 0 }}
                                            animate={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }} transition={{ duration: 1 }} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
                                        <div className="text-xl font-bold text-blue-700 mb-1">{streak?.current || 0}</div>
                                        <div className="text-xs text-blue-600">Current Streak</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
                                        <div className="text-xl font-bold text-purple-700 mb-1">{streak?.best || 0}</div>
                                        <div className="text-xs text-purple-600">Longest Streak</div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-emerald-700 font-semibold text-xs">Tasks Completed</span>
                                        <span className="text-lg font-bold text-emerald-800">{stats.completed || 0}</span>
                                    </div>
                                    <div className="text-xs text-emerald-600">
                                        {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}% of total
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Badges Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Your Badges</h3>
                                <button className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center gap-1">
                                    View All
                                    <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {earnedBadges.length > 0 ? (
                                    earnedBadges.map((badgeName, index) => {
                                        const badge = getBadgeInfo(badgeName);
                                        const BadgeIcon = badge.icon;
                                        return (
                                            <motion.div key={badgeName} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                                                className={`bg-gradient-to-br ${badge.color} rounded-xl p-3 text-white`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                                        <BadgeIcon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm">{badge.name}</h4>
                                                        <p className="text-xs opacity-90">{badge.description}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Award className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <h4 className="font-bold text-gray-700 text-sm mb-1">No badges yet</h4>
                                        <p className="text-gray-600 text-xs mb-3">Complete your first task to earn a badge!</p>
                                        {taskData?.tasks?.[0] && !taskData.tasks[0].completed && (
                                            <button onClick={() => markTaskAsComplete(taskData.tasks[0]._id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-xs">
                                                <Zap className="w-3 h-3" />
                                                Complete First Task
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-200">
                            <h4 className="font-bold text-gray-900 text-sm mb-3">Quick Actions</h4>
                            <div className="space-y-2">
                                <button onClick={() => navigate('/analysis')}
                                    className="w-full flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-md bg-blue-100 text-blue-600">
                                            <BarChart3 className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium text-gray-700 text-xs">View Analysis</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </button>
                                <button onClick={() => navigator.clipboard.writeText(window.location.href) && showNotification('Link copied!', 'success')}
                                    className="w-full flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-md bg-purple-100 text-purple-600">
                                            <Share2 className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium text-gray-700 text-xs">Share Progress</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daily Motivation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold mb-2">Keep Going! You're Making Progress 🚀</h3>
                                <p className="opacity-90 text-xs">Consistency is key to your transformation goals.</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => navigate('/')}
                                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/30 transition-colors text-xs">
                                    New Challenge
                                </button>
                                <button onClick={fetchTaskData}
                                    className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-1 text-xs">
                                    <RefreshCw className="w-4 h-4" />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="mt-8 border-t border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                        <div className="text-gray-600 text-xs">
                            <span className="font-semibold">Transformation Journey</span> • Started on {new Date(taskData?.planStartDate || new Date()).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <button className="hover:text-indigo-600 transition-colors">Privacy</button>
                            <button className="hover:text-indigo-600 transition-colors">Terms</button>
                            <button className="hover:text-indigo-600 transition-colors">Help</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TaskPage;