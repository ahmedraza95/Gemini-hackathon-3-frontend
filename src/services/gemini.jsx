import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
const API_BASE = "https://gemini-hackathon-3-backend.onrender.com/api";

export const analyzeProblem = async (problemText) => {
    try {
        const response = await axios.post(
            `${API_BASE}/analyze`,
            { problem: problemText },
            { withCredentials: true }   // 👈 THIS IS THE FIX
        );

        console.log('called analyze');
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};


export const saveAnalysis = async (analysisData) => {
    try {
        const response = await axios.post(`${API_BASE}/save`, analysisData);
        return response.data;
    } catch (error) {
        console.error('Save Error:', error);
        throw error;
    }
};
// Add this to your gemini service file



export const askFollowupQuestions = async (problemText) => {
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
            `${API_BASE}/ask-questions`,
            { problem: problemText },
            {
                headers: {
                    "x-device-id": deviceId
                },
                withCredentials: true // optional, in case you also use cookies
            }
        );

        console.log("✅ AI questions fetched:", response.data);

        return response.data?.questions || [];
    } catch (error) {
        console.error(
            "Error fetching AI questions:",
            error.response?.data || error.message
        );
        return [];
    }
};

export const getStreak = async () => {
    try {
        const deviceId = localStorage.getItem("deviceId");

        if (!deviceId) {
            throw new Error("Device ID not found");
        }

        const response = await axios.get(`${API_BASE}/streak`, {
            headers: {
                "x-device-id": deviceId
            }
        });

        return response.data;
    } catch (error) {
        console.error("Streak Error:", error);
        throw error;
    }
};

export const getDashboardData = async () => {
    try {
        const response = await axios.get(`${API_BASE}/dashboard`);
        return response.data;
    } catch (error) {
        console.error('Dashboard Error:', error);
        throw error;
    }
};