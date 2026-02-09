import { useState, useEffect } from 'react';
import { getStreak } from '../services/gemini';

export const useUserStreak = () => {
    const [streak, setStreak] = useState({ current: 0, best: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStreak();
    }, []);

    const loadStreak = async () => {
        try {
            setIsLoading(true);
            const data = await getStreak();
            setStreak(data);
        } catch (error) {
            console.error('Failed to load streak:', error);
            // Fallback to localStorage
            const saved = localStorage.getItem('userStreak');
            if (saved) {
                setStreak(JSON.parse(saved));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateStreak = (newStreak) => {
        setStreak(newStreak);
        localStorage.setItem('userStreak', JSON.stringify(newStreak));
    };

    return { streak, isLoading, updateStreak };
};