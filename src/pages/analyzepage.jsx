import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { analyzeProblem, askFollowupQuestions } from '../services/gemini';
import ProblemInput from './probleminput';
import EnhancedLoader from './loader'; // Add this import
import ResultCard from './resultcard';
import InsightsPanel from './insightpanel';
import ProgressChart from './progresschart';
import TimelineChart from './timelinechart';
import {
    Eye, Target, Calendar, AlertTriangle, Brain, Zap, TrendingUp,
    BarChart3, Rocket, CheckCircle, MessageSquare, ChevronRight,
    Sparkles, Lightbulb, HelpCircle, ArrowRight, Users, Clock
} from 'lucide-react';
import { transformProblem } from "../services/api";
import { useNavigate } from 'react-router-dom';

const AnalyzePage = () => {
    const navigate = useNavigate();
    const [problemText, setProblemText] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [previousAIData, setPreviousAIData] = useState('');
    const [showAnalysisLoader, setShowAnalysisLoader] = useState(false);
    const [showTransformationLoader, setShowTransformationLoader] = useState(false);
    const [transformationStarted, setTransformationStarted] = useState(false);
    const [showAnalysisOptions, setShowAnalysisOptions] = useState(false);
    const [loaderProgress, setLoaderProgress] = useState(0);
    const [loaderMessage, setLoaderMessage] = useState('');

    // Q&A flow states
    const [questionStep, setQuestionStep] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [aiQuestions, setAiQuestions] = useState([]);
    const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
    const [isAnalysisUnlocked, setIsAnalysisUnlocked] = useState(false);
    const [qaCompleted, setQaCompleted] = useState(false);
    const [showQAPanel, setShowQAPanel] = useState(false);
    const [isAnswering, setIsAnswering] = useState(false);

    const queryClient = useQueryClient();
    const inputRef = useRef(null);

    // Initial questions
    const initialQuestions = [
        "What specific emotions do you feel about this problem?",
        "How long has this been affecting you?",
        "What have you already tried to solve it?",
        "What would be your ideal outcome?",
        "What's preventing you from solving this right now?"
    ];

    // Auto-generate questions when problem is entered
    useEffect(() => {
        if (problemText.trim().length >= 20 && !aiQuestions.length && !isGeneratingQuestions) {
            generateAICustomizedQuestions();
        }
    }, [problemText]);

    const generateAICustomizedQuestions = async () => {
        if (aiQuestions.length > 0 || isGeneratingQuestions) return;

        setIsGeneratingQuestions(true);
        setLoaderMessage('Generating personalized questions...');

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setLoaderProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 300);

            const enhancedQuestions = await askFollowupQuestions(problemText);

            clearInterval(progressInterval);
            setLoaderProgress(100);

            // Add small delay for smooth transition
            setTimeout(() => {
                setAiQuestions(enhancedQuestions || initialQuestions);
                setIsGeneratingQuestions(false);
                setLoaderProgress(0);
            }, 500);

        } catch (error) {
            console.error("Failed to generate AI questions:", error);
            setAiQuestions(initialQuestions);
            setIsGeneratingQuestions(false);
            setLoaderProgress(0);
        }
    };

    const startQASession = () => {
        if (problemText.trim().length < 20) return;
        setShowQAPanel(true);

        // Smooth scroll to input with bounce effect
        setTimeout(() => {
            inputRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // Add a gentle bounce effect
            const inputEl = document.getElementById('problem-input');
            if (inputEl) {
                inputEl.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    inputEl.style.transform = 'translateY(0)';
                }, 300);
            }
        }, 100);
    };

    const mutation = useMutation({
        mutationFn: (data) => analyzeProblem(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['dashboard']);
            setShowAnalysisLoader(false);
            // Store analysis results for viewing later
            localStorage.setItem('lastAnalysis', JSON.stringify(data.analysis));
        },
        onError: () => {
            setShowAnalysisLoader(false);
        },
    });

    const handleAnswer = async (answer) => {
        setIsAnswering(true);

        // Add typing animation effect
        const newAnswers = {
            ...userAnswers,
            [questionStep]: answer
        };
        setUserAnswers(newAnswers);

        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 300));

        setTimeout(() => {
            if (questionStep < (aiQuestions.length - 1)) {
                setQuestionStep(prev => prev + 1);
            } else {
                // All questions answered - show analysis options
                setQaCompleted(true);
                setIsAnalysisUnlocked(true);
                setShowQAPanel(false);
                setShowAnalysisOptions(true);
                triggerCelebration();
            }
            setIsAnswering(false);
        }, 300);
    };

    const triggerCelebration = () => {
        const celebration = document.createElement('div');
        celebration.className = 'fixed inset-0 pointer-events-none z-40';
        celebration.innerHTML = `
            <div class="absolute inset-0 overflow-hidden">
                ${[...Array(20)].map((_, i) => `
                    <div class="absolute text-2xl animate-float" style="
                        left: ${Math.random() * 100}%;
                        animation-delay: ${i * 0.1}s;
                        font-size: ${Math.random() * 20 + 20}px;
                    ">🎉</div>
                `).join('')}
            </div>
        `;
        document.body.appendChild(celebration);

        // Add confetti effect
        const confetti = document.createElement('div');
        confetti.className = 'fixed inset-0 pointer-events-none z-30';
        confetti.innerHTML = `
            <canvas id="confetti-canvas" class="absolute inset-0 w-full h-full"></canvas>
        `;
        document.body.appendChild(confetti);

        // Simple confetti effect
        setTimeout(() => {
            celebration.remove();
            confetti.remove();
        }, 2000);
    };

    const handleAnalyze = () => {
        if (!isAnalysisUnlocked) return;

        const combinedData = {
            problem: problemText,
            answers: userAnswers,
            questions: aiQuestions
        };

        setShowAnalysisLoader(true);
        setLoaderMessage('Analyzing your problem with AI...');

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
            setLoaderProgress(prev => {
                if (prev >= 80) {
                    clearInterval(progressInterval);
                    return 80;
                }
                return prev + 10;
            });
        }, 300);

        mutation.mutate(combinedData, {
            onSettled: () => {
                clearInterval(progressInterval);
                setLoaderProgress(100);

                // Delay hiding loader for smooth transition
                setTimeout(() => {
                    setShowAnalysisLoader(false);
                    setLoaderProgress(0);
                }, 500);
            }
        });
    };

    const handleViewAnalysis = () => {
        if (!mutation.data) {
            handleAnalyze();
            // Wait for analysis to complete
            setTimeout(() => {
                navigate('/analysis', { state: { analysis: mutation.data?.analysis || previousAIData } });
            }, 1500);
        } else {
            navigate('/analysis', { state: { analysis: mutation.data.analysis } });
        }
    };

    const results = mutation.data?.analysis;

    useEffect(() => {
        if (results && showAnalysisLoader) {
            const timer = setTimeout(() => {
                setShowAnalysisLoader(false);
                setPreviousAIData(results);
                setShowAnalysisOptions(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [results, showAnalysisLoader]);

    const handleStartTransformation = async () => {
        setTransformationStarted(true);
        setShowTransformationLoader(true);
        setShowAnalysisOptions(false);
        setLoaderMessage('Creating your personalized transformation plan...');

        // Progress simulation
        const progressInterval = setInterval(() => {
            setLoaderProgress(prev => {
                if (prev >= 85) {
                    clearInterval(progressInterval);
                    return 85;
                }
                return prev + 5;
            });
        }, 300);

        try {
            const result = await transformProblem({
                problemText,
                results: results || previousAIData,
                userAnswers
            });

            clearInterval(progressInterval);
            setLoaderProgress(100);

            // Success notification with animation
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 z-50 animate-slide-in-right';
            notification.innerHTML = `
                <div class="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
                    <motion.div 
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                    >
                        <CheckCircle className="w-6 h-6" />
                    </motion.div>
                    <div>
                        <p class="font-bold">Transformation Started! 🚀</p>
                        <p class="text-sm opacity-90">Redirecting to your tasks...</p>
                    </div>
                </div>
            `;
            document.body.appendChild(notification);

            // Delay for smooth transition
            await new Promise(resolve => setTimeout(resolve, 800));

            // Redirect to tasks page
            setTimeout(() => {
                setShowTransformationLoader(false);
                notification.remove();
                navigate('/tasks', {
                    state: {
                        transformationData: result,
                        userAnswers,
                        problemText
                    }
                });
            }, 1500);

        } catch (error) {
            console.error("Transformation failed:", error);
            setTransformationStarted(false);
            setShowTransformationLoader(false);
            setLoaderProgress(0);

            const errorNotification = document.createElement('div');
            errorNotification.className = 'fixed top-4 right-4 z-50 animate-slide-in-right';
            errorNotification.innerHTML = `
                <div class="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6" />
                    <div>
                        <p class="font-bold">Failed to create plan</p>
                        <p class="text-sm opacity-90">Please try again in a moment</p>
                    </div>
                </div>
            `;
            document.body.appendChild(errorNotification);

            setTimeout(() => {
                errorNotification.remove();
            }, 3000);
        }
    };

    // Handle Enter key for form submission
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Only trigger on Enter without Shift
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();

                if (showQAPanel && !isAnswering) {
                    const textarea = document.querySelector('#problem-input textarea');
                    if (textarea && textarea.value.trim().length > 0) {
                        handleAnswer(textarea.value);
                    }
                } else if (problemText.trim().length >= 20 && !isAnalysisUnlocked) {
                    startQASession();
                } else if (isAnalysisUnlocked && !showAnalysisLoader) {
                    handleAnalyze();
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [problemText, isAnalysisUnlocked, showQAPanel, isAnswering, showAnalysisLoader]);

    // CSS animations for confetti
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-100px) rotate(180deg); }
            }
            .animate-float {
                animation: float 2s ease-in-out forwards;
            }
        `;
        document.head.appendChild(style);

        return () => style.remove();
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
            {/* Enhanced Loaders */}
            {isGeneratingQuestions && (
                <EnhancedLoader
                    progress={loaderProgress}
                    message={loaderMessage}
                    type="questions"
                />
            )}

            {showAnalysisLoader && (
                <EnhancedLoader
                    progress={loaderProgress}
                    message={loaderMessage}
                    type="analysis"
                />
            )}

            {showTransformationLoader && (
                <EnhancedLoader
                    progress={loaderProgress}
                    message={loaderMessage}
                    type="transformation"
                />
            )}

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, type: "spring" }}
                className="mb-12"
            >
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-64 h-64 rounded-full bg-white/5"
                                initial={{ x: -100, y: -100 }}
                                animate={{
                                    x: [null, Math.random() * 800],
                                    y: [null, Math.random() * 400],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 15 + i * 3,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: i * 1.5,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                            className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-sm mb-6"
                        >
                            <Sparkles className="w-8 h-8" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl font-bold mb-4"
                        >
                            Transform Your Problem Into Progress
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl opacity-90 mb-8 max-w-3xl mx-auto"
                        >
                            AI-powered analysis with personalized questions for deeper insights
                        </motion.p>

                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => document.getElementById('problem-input')?.scrollIntoView({
                                behavior: 'smooth'
                            })}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-xl hover:shadow-2xl transition-all group relative overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <Zap className="w-6 h-6" />
                            START YOUR JOURNEY
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Problem Input with Integrated Q&A */}
            <div ref={inputRef} id="problem-input">
                <ProblemInput
                    problemText={problemText}
                    setProblemText={setProblemText}
                    handleAnalyze={handleAnalyze}
                    isLoading={mutation.isLoading}
                    error={mutation.error?.message}
                    progress={mutation.isLoading ? 75 : 0}
                    hasResults={!!results}
                    onStartTransformation={handleStartTransformation}
                    transformationStarted={transformationStarted}
                    isAnalysisUnlocked={isAnalysisUnlocked}
                    qaCompleted={qaCompleted}
                    showQAPanel={showQAPanel}
                    aiQuestions={aiQuestions}
                    questionStep={questionStep}
                    userAnswers={userAnswers}
                    onStartQASession={startQASession}
                    onAnswerQuestion={handleAnswer}
                    isAnswering={isAnswering}
                    isGeneratingQuestions={isGeneratingQuestions}
                    onSkipQuestion={() => {
                        if (questionStep < aiQuestions.length - 1) {
                            setQuestionStep(prev => prev + 1);
                        } else {
                            setIsAnalysisUnlocked(true);
                            setShowQAPanel(false);
                            setShowAnalysisOptions(true);
                        }
                    }}
                    showAnalysisOptions={showAnalysisOptions}
                    onViewAnalysis={handleViewAnalysis}
                    resetFlow={() => {
                        setProblemText('');
                        setUserAnswers({});
                        setQuestionStep(0);
                        setQaCompleted(false);
                        setShowQAPanel(false);
                        setIsAnalysisUnlocked(false);
                        setShowAnalysisOptions(false);
                        setTransformationStarted(false);
                    }}
                />
            </div>

            {/* Analysis Options Panel (after Q&A completion) */}
            <AnimatePresence>
                {showAnalysisOptions && !results && !transformationStarted && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: "spring", bounce: 0.3 }}
                        className="mt-8 text-center"
                    >
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-200 shadow-xl relative overflow-hidden">
                            {/* Floating particles */}
                            <div className="absolute inset-0 overflow-hidden">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-2 h-2 bg-indigo-300/20 rounded-full"
                                        animate={{
                                            x: [0, 100, 0],
                                            y: [0, 50, 0]
                                        }}
                                        transition={{
                                            duration: 10 + i * 2,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    />
                                ))}
                            </div>

                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                className="inline-block p-4 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 mb-6 relative z-10"
                            >
                                <Lightbulb className="w-8 h-8" />
                            </motion.div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">
                                🎉 Questions Complete! What's Next?
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto relative z-10">
                                You've provided valuable insights! Choose your next step:
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto relative z-10">
                                {/* View Analysis Option */}
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="cursor-pointer"
                                    onClick={handleViewAnalysis}
                                >
                                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all h-full flex flex-col items-center shadow-sm hover:shadow-lg">
                                        <div className="p-3 rounded-full bg-blue-100 mb-4">
                                            <Eye className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">View Detailed Analysis</h4>
                                        <p className="text-gray-600 mb-4 flex-grow">
                                            Get comprehensive AI insights, patterns, and breakdown of your problem
                                        </p>
                                        <div className="inline-flex items-center gap-2 text-blue-600 font-medium group">
                                            View Full Report
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Start Transformation Option */}
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="cursor-pointer"
                                    onClick={handleStartTransformation}
                                >
                                    <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 border-2 border-emerald-200 hover:border-emerald-400 transition-all h-full flex flex-col items-center shadow-sm hover:shadow-lg">
                                        <div className="p-3 rounded-full bg-emerald-100 mb-4">
                                            <Rocket className="w-8 h-8 text-emerald-600" />
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">Start Transformation</h4>
                                        <p className="text-gray-600 mb-4 flex-grow">
                                            Jump straight into action with personalized tasks and progress tracking
                                        </p>
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-medium group">
                                            Begin Journey
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 relative z-10">
                                <p className="text-sm text-gray-500">
                                    <span className="inline-flex items-center gap-1">
                                        <Sparkles className="w-4 h-4" />
                                        Both options will save your progress. You can always switch between them.
                                    </span>
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to quickly select
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Section (when analysis is generated) */}
            {results && !showAnalysisLoader && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="space-y-12 mt-12"
                >
                    <InsightsPanel insights={results.insights} stats={results.stats} />

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <ResultCard
                                icon={Eye}
                                title="What You Think The Problem Is"
                                content={results.perceivedProblem}
                                delay={0.1}
                                color="from-blue-500 to-cyan-500"
                                confidence={78}
                            />
                        </div>

                        <div className="lg:col-span-2 lg:row-start-2">
                            <ResultCard
                                icon={Target}
                                title="The Real Core Issue"
                                content={results.realProblem}
                                delay={0.2}
                                color="from-indigo-500 to-purple-500"
                                confidence={85}
                            />
                        </div>

                        <div className="lg:row-span-2">
                            <ResultCard
                                icon={Calendar}
                                title="Why This Keeps Happening"
                                content={results.whyItHappens}
                                delay={0.3}
                                color="from-amber-500 to-orange-500"
                                confidence={82}
                            />
                        </div>

                        <ResultCard
                            icon={AlertTriangle}
                            title="Common Mistakes to Avoid"
                            content={results.commonMistakes || []}
                            delay={0.4}
                            color="from-rose-500 to-pink-500"
                            confidence={90}
                            list
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Progress Metrics</h3>
                            <ProgressChart stats={results.stats} />
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Action Timeline</h3>
                            <TimelineChart
                                steps={results.actionSteps || []}
                                activeStep={activeStep}
                                setActiveStep={setActiveStep}
                            />
                        </div>
                    </div>

                    {/* Action Buttons at Bottom */}
                    {results && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center pt-8"
                        >
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready for Next Steps?</h3>
                                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                    Based on your {aiQuestions.length} detailed answers, you have multiple paths forward
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/analysis', { state: { analysis: results } })}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all group"
                                    >
                                        <Eye className="w-6 h-6" />
                                        View Full Analysis
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleStartTransformation}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all group"
                                    >
                                        <Rocket className="w-6 h-6" />
                                        Start Transformation
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default AnalyzePage;