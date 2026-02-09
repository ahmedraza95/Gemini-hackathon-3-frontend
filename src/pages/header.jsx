import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import {
    Brain, Home, BarChart3, CheckSquare, Settings, Menu, X,
    CheckCircle, Target, Award, Trophy, Star, Medal, Shield,
    Zap, Flame, Crown, Rocket, Gem, Sparkles, AlertTriangle,
    Clock, TrendingUp, TrendingDown, Calendar, Users, Zap as Lightning,
    Target as Bullseye, Coffee, Sunrise
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getStreak } from "../services/gemini";
// import { getTodayTaskStatus, getBadges } from "../services/tasks";

const Header = () => {
    const API_BASE_URL = "http://localhost:5000/api"; // Change to your backend URL
    // Mock data for when real API isn't available
    const mockStreak = { current: 7, best: 21 };
    const mockTaskProgress = { completed: 6, total: 60 };
    const mockBadges = [
        { id: 1, type: 'streak', name: '7-Day Streak', description: 'Maintained a 7-day streak', tier: 'bronze', unlocked: true, unlockedDate: '2023-10-15' },
        { id: 2, type: 'consistency', name: 'Consistency King', description: 'Complete tasks for 14 consecutive days', tier: 'silver', unlocked: false, requirements: '14 days' },
        { id: 3, type: 'perfectionist', name: 'Perfect Week', description: 'Complete all daily tasks for a week', tier: 'gold', unlocked: true, unlockedDate: '2023-10-10' },
        { id: 4, type: 'speed', name: 'Speed Demon', description: 'Complete tasks in record time', tier: 'bronze', unlocked: false, requirements: 'Complete in < 1h' },
        { id: 5, type: 'master', name: 'Problem Master', description: 'Solve 100 problems successfully', tier: 'diamond', unlocked: true, unlockedDate: '2023-09-30' },
        { id: 6, type: 'explorer', name: 'Feature Explorer', description: 'Use all platform features', tier: 'platinum', unlocked: false, requirements: 'Explore all features' },
        { id: 7, type: 'dedication', name: 'Early Bird', description: 'Complete tasks before 8 AM for a week', tier: 'gold', unlocked: true, unlockedDate: '2023-10-05' },
        { id: 8, type: 'excellence', name: 'Top Performer', description: 'Achieve 90%+ accuracy for a month', tier: 'diamond', unlocked: false, requirements: '90% accuracy' },
        { id: 9, type: 'spark', name: 'Quick Starter', description: 'Start task within 5 minutes of login', tier: 'bronze', unlocked: true, unlockedDate: '2023-10-12' },
    ];

    // State with mock data as fallback
    const [streak, setStreak] = useState(mockStreak);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [badges, setBadges] = useState(mockBadges);
    const [loading, setLoading] = useState(false);
    const [taskLoading, setTaskLoading] = useState(false);
    const [badgesLoading, setBadgesLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [badgesPopupOpen, setBadgesPopupOpen] = useState(false);
    const [unlockedBadgesCount, setUnlockedBadgesCount] = useState(5); // From mock data
    const [timeLeft, setTimeLeft] = useState('23:59:59');
    const [taskProgress, setTaskProgress] = useState(mockTaskProgress);
    const [streakWarning, setStreakWarning] = useState(true);
    const [usingMockData, setUsingMockData] = useState(true);
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
                console.log(response.data.tasks)
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


            } else {
                throw new Error("Failed to fetch tasks from backend");
            }
        } catch (err) {
            console.error("Error fetching task data:", err);
            createMockData();
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setUsingMockData(false);

                // Try to fetch real data first
                // Uncomment when APIs are ready:
                // const streakRes = await getStreak();
                // setStreak(streakRes.data || mockStreak);

                // const taskRes = await getTodayTaskStatus();
                // setTaskCompleted(taskRes.completed || false);

                // const badgesRes = await getBadges();
                // setBadges(badgesRes || mockBadges);

                // const unlocked = (badgesRes || mockBadges).filter(badge => badge.unlocked).length;
                // setUnlockedBadgesCount(unlocked);

                // Set initial progress (you can fetch this from API)
                // const progressRes = await fetch('/api/tasks/progress');
                // setTaskProgress(progressRes.data || mockTaskProgress);

                // Calculate streak warning
                // if ((streakRes.data?.current || 0) > 0 && !(taskRes.completed || false)) {
                //     setStreakWarning(true);
                // }

            } catch (err) {
                console.warn("Using mock data - API not available:", err);
                setUsingMockData(true);
                // Use mock data when API fails
                setUnlockedBadgesCount(mockBadges.filter(badge => badge.unlocked).length);
            } finally {
                setLoading(false);
                setTaskLoading(false);
                setBadgesLoading(false);
            }
        };

        fetchData();
        fetchTaskData()
    }, []);

    useEffect(() => {
        // Timer for daily reset (mock or real)
        const updateTimer = () => {
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/analyze', label: 'Analyze', icon: Brain },
        { path: '/tasks', label: 'Tasks', icon: CheckSquare },
        { path: '/strategy', label: 'Analysis', icon: BarChart3 },
    ];

    // Function to mark task as complete
    const handleCompleteTask = async () => {
        try {
            setTaskLoading(true);

            if (!usingMockData) {
                // Real API call
                const response = await fetch('/api/tasks/complete-today', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setTaskCompleted(true);
                    setStreakWarning(false);

                    // Update progress
                    const updatedProgress = {
                        completed: taskProgress.completed + 1,
                        total: taskProgress.total
                    };
                    setTaskProgress(updatedProgress);

                    // Refresh streak and badges
                    const streakRes = await getStreak();
                    setStreak(streakRes.data);

                    const badgesRes = await getBadges();
                    setBadges(badgesRes);
                    const unlocked = badgesRes.filter(badge => badge.unlocked).length;
                    setUnlockedBadgesCount(unlocked);
                }
            } else {
                // Mock completion
                setTaskCompleted(true);
                setStreakWarning(false);
                setTaskProgress(prev => ({
                    ...prev,
                    completed: prev.completed + 1
                }));

                // Update mock streak
                setStreak(prev => ({
                    ...prev,
                    current: prev.current + 1,
                    best: Math.max(prev.best, prev.current + 1)
                }));

                // Mock badge unlock if reaching milestones
                if (taskProgress.completed + 1 === 10) {
                    const newBadges = [...badges];
                    const speedBadge = newBadges.find(b => b.id === 4);
                    if (speedBadge) {
                        speedBadge.unlocked = true;
                        speedBadge.unlockedDate = new Date().toISOString().split('T')[0];
                        setBadges(newBadges);
                        setUnlockedBadgesCount(prev => prev + 1);
                    }
                }
            }
        } catch (error) {
            console.error("Error completing task:", error);
        } finally {
            setTaskLoading(false);
        }
    };

    // Function to get badge icon component
    const getBadgeIcon = (badgeType) => {
        const iconMap = {
            'streak': Flame,
            'achiever': Trophy,
            'perfectionist': Star,
            'consistency': Medal,
            'speed': Lightning,
            'master': Crown,
            'explorer': Rocket,
            'dedication': Shield,
            'excellence': Gem,
            'spark': Sparkles
        };
        return iconMap[badgeType] || Award;
    };

    // Function to get badge color
    const getBadgeColor = (badge) => {
        if (!badge.unlocked) return 'gray';

        const colorMap = {
            'bronze': 'from-amber-600 to-amber-800',
            'silver': 'from-gray-300 to-gray-500',
            'gold': 'from-yellow-500 to-yellow-600',
            'platinum': 'from-blue-300 to-blue-500',
            'diamond': 'from-cyan-300 to-indigo-400'
        };
        return colorMap[badge.tier] || 'from-indigo-500 to-purple-600';
    };

    return (
        <>
            {/* Main Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50"
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-14">
                        {/* Logo */}
                        <NavLink to="/" className="flex items-center gap-2">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg"
                            >
                                <Brain className="w-4 h-4 text-white" />
                                {usingMockData && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border border-white"
                                        title="Using mock data"
                                    />
                                )}
                            </motion.div>
                            <div className="hidden sm:block">
                                <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                    ExplainMyProblem.ai
                                </span>
                            </div>
                        </NavLink>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm ${isActive
                                            ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    <item.icon className="w-3.5 h-3.5" />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>

                        {/* Right Section - Streak, Badges & Controls */}
                        <div className="flex items-center gap-2">
                            {/* Badges Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setBadgesPopupOpen(true)}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow hover:shadow-md transition-all duration-200"
                            >
                                <Trophy className="w-4 h-4" />
                                <div className="text-xs font-bold">{unlockedBadgesCount}</div>
                                <span className="text-xs hidden lg:inline">Badges</span>
                            </motion.button>

                            {/* Streak Display - Desktop */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow"
                            >
                                <div className="flex items-center gap-1">
                                    <Flame className="w-3.5 h-3.5" />
                                    <div className="text-xs font-bold">{streak.current}</div>
                                </div>
                                <div className="h-4 w-px bg-white/30 mx-1"></div>
                                <div className="text-xs opacity-90">Best: {streak.best}</div>
                            </motion.div>

                            {/* Mobile Badge Indicator */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setBadgesPopupOpen(true)}
                                className="sm:hidden flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow"
                            >
                                <Trophy className="w-3 h-3" />
                                {unlockedBadgesCount > 0 && (
                                    <span className="text-xs font-bold">{unlockedBadgesCount}</span>
                                )}
                            </motion.button>

                            {/* Streak Display - Mobile */}
                            <div className="flex sm:hidden items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow">
                                <Flame className="w-3 h-3" />
                                <div className="text-xs font-bold">{streak.current}</div>
                            </div>

                            {/* Settings */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Settings className="w-4 h-4 text-gray-600" />
                            </motion.button>

                            {/* Mobile Menu Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-4 h-4 text-gray-600" />
                                ) : (
                                    <Menu className="w-4 h-4 text-gray-600" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
                        >
                            <div className="px-3 py-4">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${isActive
                                                ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`
                                        }
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span className="font-medium">{item.label}</span>
                                    </NavLink>
                                ))}

                                {/* Badges in Mobile Menu */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            setBadgesPopupOpen(true);
                                        }}
                                        className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Trophy className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm font-medium text-gray-700">My Badges</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-purple-700">{unlockedBadgesCount} unlocked</span>
                                            <Sparkles className="w-3 h-3 text-purple-500" />
                                        </div>
                                    </motion.button>
                                </div>

                                {/* Mobile Streak Info */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between px-4 py-2">
                                        <div className="text-sm font-medium text-gray-700">Current Streak</div>
                                        <div className="text-sm font-bold text-orange-600 flex items-center gap-1">
                                            <Flame className="w-3.5 h-3.5" />
                                            {streak.current} days
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-2">
                                        <div className="text-sm font-medium text-gray-700">Best Streak</div>
                                        <div className="text-sm font-bold text-gray-900">{streak.best} days</div>
                                    </div>
                                </div>

                                {usingMockData && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg">
                                            <Coffee className="w-4 h-4 text-amber-600" />
                                            <span className="text-xs text-amber-700">Using demo data</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Full Width Bottom Task Progress Bar - Quarter height of header */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 120,
                    damping: 20
                }}
                className={`fixed bottom-0 left-0 right-0 z-40 h-12 ${taskCompleted
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200'
                    : 'bg-gradient-to-r from-red-50 via-rose-50 to-red-100 border-t border-red-200'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-full">
                    <div className="flex items-center justify-between h-full py-1">
                        {/* Left: Task Progress */}
                        <div className="flex items-center gap-3">
                            <div className={`p-1 rounded-lg ${taskCompleted
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}>
                                {taskCompleted ? (
                                    <CheckCircle className="w-4 h-4" />
                                ) : (
                                    <AlertTriangle className="w-4 h-4" />
                                )}
                            </div>

                            <div className="hidden sm:flex items-center gap-3">
                                <div className="text-left">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold ${taskCompleted
                                            ? 'text-green-800'
                                            : 'text-red-800'
                                            }`}>
                                            {taskCompleted ? 'Task Completed' : 'Complete Today\'s Task!'}
                                        </span>
                                        {!taskCompleted && streakWarning && (
                                            <motion.div
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                className="px-1.5 py-0.5 bg-red-200 text-red-800 text-[10px] font-bold rounded-full"
                                            >
                                                Streak Risk!
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className={`text-[10px] ${taskCompleted
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                        }`}>
                                        {taskProgress.completed}/{taskProgress.total} completed
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-28">
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${(taskProgress.completed / taskProgress.total) * 100}%`
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                ease: "easeOut"
                                            }}
                                            className={`h-full rounded-full ${taskCompleted
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                : 'bg-gradient-to-r from-red-500 to-orange-500'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] mt-0.5">
                                        <span className={`font-medium ${taskCompleted
                                            ? 'text-green-700'
                                            : 'text-red-700'
                                            }`}>
                                            {Math.round((taskProgress.completed / taskProgress.total) * 100)}%
                                        </span>
                                        <span className="text-gray-500">
                                            {taskProgress.completed}/{taskProgress.total}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle: Timer (Desktop) */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${taskCompleted
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-xs font-mono font-bold">{timeLeft}</span>
                                <span className="text-[10px]">reset</span>
                            </div>
                        </div>

                        {/* Right: Action Button */}
                        <div className="flex items-center gap-2">
                            {taskCompleted ? (
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-1.5"
                                >
                                    <div className="hidden sm:block text-right">
                                        <div className="text-xs font-bold text-green-800">Streak Safe!</div>
                                        <div className="text-[10px] text-green-600 flex items-center gap-0.5">
                                            <TrendingUp className="w-2.5 h-2.5" />
                                            +{streak.current} days
                                        </div>
                                    </div>
                                    <div className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium rounded-lg shadow flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        <span className="hidden sm:inline">Completed</span>
                                        <span className="sm:hidden">✓</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="hidden sm:block text-right">
                                        <div className="text-xs font-bold text-red-800">
                                            Day {streak.current}
                                        </div>
                                        <div className="text-[10px] text-red-600 flex items-center gap-0.5">
                                            <Sunrise className="w-2.5 h-2.5" />
                                            Protect streak
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCompleteTask}
                                        disabled={taskLoading}
                                        className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold rounded-lg shadow hover:shadow-md transition-all duration-300 flex items-center gap-1.5"
                                    >
                                        {taskLoading ? (
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Target className="w-3 h-3" />
                                                <span className="hidden sm:inline">Mark Done</span>
                                                <span className="sm:hidden">Do Task</span>
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Timer */}
                <div className="md:hidden absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${taskCompleted
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                        <Clock className="w-2.5 h-2.5" />
                        <span className="text-[10px] font-mono font-bold">{timeLeft.split(':')[0]}:{timeLeft.split(':')[1]}</span>
                    </div>
                </div>
            </motion.div>

            {/* Mock Data Indicator */}
            {usingMockData && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-14 left-4 z-30"
                >
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500 text-white text-xs rounded-lg shadow">
                        <Coffee className="w-3 h-3" />
                        <span>Demo Mode</span>
                    </div>
                </motion.div>
            )}

            {/* Badges Popup Modal */}
            <AnimatePresence>
                {badgesPopupOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setBadgesPopupOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
                        >
                            {/* Popup Header */}
                            <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            <Trophy className="w-8 h-8" />
                                            Achievement Badges
                                        </h2>
                                        <p className="text-purple-100 mt-1">
                                            {unlockedBadgesCount} of {badges.length} badges unlocked
                                            {usingMockData && " (Demo Mode)"}
                                        </p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setBadgesPopupOpen(false)}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-white" />
                                    </motion.button>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-6 bg-white/20 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(unlockedBadgesCount / badges.length) * 100}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="bg-white h-full rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Badges Grid */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                                {badgesLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="text-center">
                                            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-gray-500">Loading badges...</p>
                                        </div>
                                    </div>
                                ) : badges.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No badges available yet</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {badges.map((badge) => {
                                            const IconComponent = getBadgeIcon(badge.type);
                                            const isUnlocked = badge.unlocked;
                                            const badgeColor = getBadgeColor(badge);

                                            return (
                                                <motion.div
                                                    key={badge.id}
                                                    whileHover={{ y: -8, scale: 1.03 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`relative p-4 rounded-xl border-2 ${isUnlocked
                                                        ? `bg-gradient-to-br ${badgeColor} border-transparent text-white shadow-lg`
                                                        : 'bg-gray-100 border-gray-200 text-gray-400'
                                                        } transition-all duration-300`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`p-3 rounded-lg ${isUnlocked
                                                            ? 'bg-white/20'
                                                            : 'bg-gray-200'
                                                            }`}>
                                                            <IconComponent className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="font-bold text-sm">{badge.name}</h3>
                                                                {badge.tier && (
                                                                    <span className={`text-xs px-2 py-1 rounded-full ${isUnlocked
                                                                        ? 'bg-white/30'
                                                                        : 'bg-gray-300'
                                                                        }`}>
                                                                        {badge.tier.charAt(0).toUpperCase() + badge.tier.slice(1)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs mt-1 opacity-90">
                                                                {badge.description}
                                                            </p>
                                                            <div className="flex items-center justify-between mt-3">
                                                                <span className="text-xs">
                                                                    {isUnlocked
                                                                        ? `Unlocked: ${badge.unlockedDate || 'Recently'}`
                                                                        : badge.requirements
                                                                    }
                                                                </span>
                                                                {!isUnlocked && (
                                                                    <motion.div
                                                                        animate={{ rotate: [0, 5, -5, 0] }}
                                                                        transition={{ repeat: Infinity, duration: 3 }}
                                                                        className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
                                                                    >
                                                                        <span className="text-xs">🔒</span>
                                                                    </motion.div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Unlocked indicator */}
                                                    {isUnlocked && (
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                                            className="absolute -top-2 -right-2"
                                                        >
                                                            <Sparkles className="w-5 h-5 text-yellow-400" />
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Popup Footer */}
                            <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">{unlockedBadgesCount}</div>
                                        <div className="text-xs text-gray-600">Unlocked</div>
                                    </div>
                                    <div className="h-8 w-px bg-gray-300"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">{streak.current}</div>
                                        <div className="text-xs text-gray-600">Day Streak</div>
                                    </div>
                                    <div className="h-8 w-px bg-gray-300"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{streak.best}</div>
                                        <div className="text-xs text-gray-600">Best Streak</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;