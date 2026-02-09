import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
const API_BASE = "https://gemini-hackathon-3-backend.onrender.com/api";

// Create axios instance with credentials for cookie persistence
const apiClient = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // This allows cookies to be sent/received
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add device ID from localStorage if available
apiClient.interceptors.request.use(
    (config) => {
        // Try to get device ID from localStorage
        if (typeof window !== 'undefined') {
            const deviceId = localStorage.getItem('deviceId');
            if (deviceId) {
                config.headers['x-device-id'] = deviceId;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle device ID from response
apiClient.interceptors.response.use(
    (response) => {
        // Check if response has device ID in headers or data
        if (response.headers['set-device-id']) {
            localStorage.setItem('deviceId', response.headers['set-device-id']);
        } else if (response.data?.deviceId) {
            localStorage.setItem('deviceId', response.data.deviceId);
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Dashboard API
export const getDashboardData = async () => {
    try {
        const response = await apiClient.get('/dashboard');
        return response.data;
    } catch (error) {
        console.error('Dashboard API Error:', error);
        throw error;
    }
};

// Tasks API
export const getTasks = async (params = {}) => {
    try {
        // 🔹 Step 1: deviceId check / generate
        let deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
            deviceId = uuidv4();
            localStorage.setItem("deviceId", deviceId);
            console.log("🆕 New deviceId generated:", deviceId);
        } else {
            console.log("✅ Using existing deviceId:", deviceId);
        }
console.log("Fetching tasks with deviceId:", deviceId, "and params:", params);
        // 🔹 Step 2: Axios GET with deviceId header
        const response = await axios.get(`${API_BASE}/tasks`, {
            params, // { status, priority, etc. }
            headers: {
                "x-device-id": deviceId
            },
            withCredentials: true // optional, in case backend uses cookies too
        });

        console.log("✅ Tasks fetched:", response.data);

        return response.data;

    } catch (error) {
        console.error("Tasks API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await apiClient.post('/tasks', taskData);
        return response.data;
    } catch (error) {
        console.error('Create Task Error:', error);
        throw error;
    }
};

export const updateTask = async (id, updates) => {
    try {
        const response = await apiClient.put(`/tasks/${id}`, updates);
        return response.data;
    } catch (error) {
        console.error('Update Task Error:', error);
        throw error;
    }
};

export const deleteTask = async (id) => {
    try {
        const response = await apiClient.delete(`/tasks/${id}`);
        return response.data;
    } catch (error) {
        console.error('Delete Task Error:', error);
        throw error;
    }
};

// Strategy API
export const getStrategyData = async () => {
    try {
        const response = await apiClient.get('/strategy');
        return response.data;
    } catch (error) {
        console.error('Strategy API Error:', error);
        throw error;
    }
};

export const getStrategyInsights = async () => {
    try {
        const response = await apiClient.get('/strategy/insights');
        return response.data;
    } catch (error) {
        console.error('Strategy Insights Error:', error);
        throw error;
    }
};

export const activateStrategy = async (strategyId) => {
    try {
        const response = await apiClient.post('/strategy/activate', { strategyId });
        return response.data;
    } catch (error) {
        console.error('Activate Strategy Error:', error);
        throw error;
    }
};

export const deactivateStrategy = async (strategyId) => {
    try {
        const response = await apiClient.post('/strategy/deactivate', { strategyId });
        return response.data;
    } catch (error) {
        console.error('Deactivate Strategy Error:', error);
        throw error;
    }
};

// User initialization API (call this once when app loads)
export const initializeUserSession = async () => {
    try {
        const response = await apiClient.get('/user/init');
        if (response.data.deviceId && typeof window !== 'undefined') {
            localStorage.setItem('deviceId', response.data.deviceId);
        }
        return response.data;
    } catch (error) {
        console.error('Initialize User Session Error:', error);
        throw error;
    }
};

// User Stats
export const getUserStats = async () => {
    try {
        const [dashboard, tasks, strategy] = await Promise.all([
            getDashboardData(),
            getTasks(),
            getStrategyData()
        ]);

        return {
            dashboard,
            tasks: tasks.stats,
            strategy: strategy.performanceMetrics,
            overallScore: calculateOverallScore(dashboard, tasks.stats, strategy.performanceMetrics)
        };
    } catch (error) {
        console.error('User Stats Error:', error);
        throw error;
    }
};

const calculateOverallScore = (dashboard, tasks, strategy) => {
    const clarityScore = dashboard.stats.avgClarity * 0.4;
    const completionScore = tasks.completionRate * 0.3;
    const strategyScore = strategy.averageEffectiveness * 0.3;
    return Math.round(clarityScore + completionScore + strategyScore);
};

// Utility function to generate/retrieve device ID
export const getOrCreateDeviceId = () => {
    if (typeof window === 'undefined') return null;

    let deviceId = localStorage.getItem('deviceId');

    if (!deviceId) {
        // Generate a simple device ID (you can use UUID if needed)
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
    }

    return deviceId;
};






export const transformProblem = async ({ problemText, results }) => {
    try {
        // 🔹 Step 1: deviceId check / generate
        let deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
            deviceId = uuidv4();
            localStorage.setItem("deviceId", deviceId);
            console.log("🆕 New deviceId generated:", deviceId);
        } else {
            console.log("✅ Using existing deviceId:", deviceId);
        }

        // 🔹 Step 2: Axios POST with deviceId header
        const response = await axios.post(
            `${API_BASE}/generate-strategy`,
            { problemText, results },
            {
                headers: {
                    "x-device-id": deviceId
                },
                withCredentials: true // optional, in case backend uses cookies too
            }
        );

        console.log("✅ Strategy generated:", response.data);

        return response.data; // { tasks, strategy, currentStreak, longestStreak, planStartDate }

    } catch (error) {
        console.error("Transform Problem Error:", error.response?.data || error.message);
        throw error;
    }
};

export const initializeApp = async () => {
    // Get or create device ID
    const deviceId = getOrCreateDeviceId();

    // Initialize user session with backend
    try {
        await initializeUserSession();
    } catch (error) {
        console.warn('User session initialization failed, continuing with local device ID');
    }

    return deviceId;
};