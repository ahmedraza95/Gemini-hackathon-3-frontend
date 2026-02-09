import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, AlertCircle, Brain, Zap, Target, Rocket, Sparkles,
    ChevronRight, MessageSquare, CheckCircle, Loader, HelpCircle,
    ArrowRight, SkipForward, Edit2, Key, RotateCcw, Eye, Play
} from 'lucide-react';

const ProblemInput = ({
    problemText,
    setProblemText,
    handleAnalyze,
    isLoading,
    error,
    progress,
    hasResults,
    onStartTransformation,
    transformationStarted,
    isAnalysisUnlocked = false,
    qaCompleted = false,
    showQAPanel = false,
    aiQuestions = [],
    questionStep = 0,
    userAnswers = {},
    onStartQASession,
    onAnswerQuestion,
    onSkipQuestion,
    isAnswering = false,
    isAskingQuestions = false,
    resetFlow,
    showAnalysisOptions = false,
    onViewAnalysis
}) => {
    const maxLength = 2000;
    const charCount = problemText.length;
    const charPercentage = (charCount / maxLength) * 100;
    const [currentAnswer, setCurrentAnswer] = useState('');
    const answerTextareaRef = useRef(null);

    const features = [
        {
            icon: Brain,
            text: 'AI-powered analysis',
            description: 'Deep pattern recognition'
        },
        {
            icon: Zap,
            text: '5-step Q&A flow',
            description: 'Personalized insights'
        },
        {
            icon: Target,
            text: 'Actionable steps',
            description: 'Clear transformation path'
        }
    ];

    const exampleProblems = [
        "I feel overwhelmed at work, constantly busy but never productive...",
        "My team doesn't communicate effectively and projects keep getting delayed...",
        "I'm stuck in a career rut and don't know what to do next...",
        "I struggle with procrastination and can't seem to build consistent habits...",
        "My relationships feel strained and I don't know how to improve communication..."
    ];

    // Focus on answer textarea when question changes
    useEffect(() => {
        if (showQAPanel && answerTextareaRef.current) {
            answerTextareaRef.current.focus();
            setCurrentAnswer(userAnswers[questionStep] || '');
        }
    }, [questionStep, showQAPanel]);

    const handleExampleClick = (example) => {
        setProblemText(example);
        const textarea = document.querySelector('textarea');
        if (textarea) {
            textarea.focus();
            textarea.style.transform = 'scale(1.02)';
            setTimeout(() => {
                textarea.style.transform = 'scale(1)';
            }, 150);
        }
    };

    const handleSubmitAnswer = () => {
        if (!currentAnswer.trim()) {
            alert('Please provide an answer before submitting.');
            return;
        }
        onAnswerQuestion(currentAnswer);
        setCurrentAnswer('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSubmitAnswer();
        }
    };

    const isTextareaEmpty = () => {
        return !currentAnswer || currentAnswer.trim().length === 0;
    };

    return (
        <motion.section
            id="problem-input"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, type: "spring" }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
            <div className="bg-gradient-to-br from-white via-gray-50/50 to-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200/50 relative overflow-hidden">
                {/* Reset button */}
                {!hasResults && (problemText || showQAPanel || isAnalysisUnlocked) && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetFlow}
                        className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 hover:text-gray-900 transition-all text-sm font-medium shadow-sm"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </motion.button>
                )}

                {/* Animated background elements */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20" />

                <div className="text-center mb-10 relative z-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block p-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-6"
                    >
                        {showQAPanel ? (
                            <MessageSquare className="w-8 h-8 text-indigo-600" />
                        ) : showAnalysisOptions ? (
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        ) : hasResults ? (
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        ) : (
                            <Brain className="w-8 h-8 text-indigo-600" />
                        )}
                    </motion.div>

                    <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 bg-clip-text text-transparent">
                        {showAnalysisOptions ? 'Choose Your Path 🎯' :
                            showQAPanel ? 'Personalized Questions' :
                                qaCompleted ? '✅ Questions Complete!' :
                                    hasResults ? 'Ready for Transformation?' :
                                        'Describe Your Challenge'}
                    </h2>

                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {showAnalysisOptions ? 'You\'ve completed all questions! Choose how to proceed:' :
                            showQAPanel ? 'Answer these personalized questions for deeper insights' :
                                qaCompleted ? 'Perfect! Now let\'s analyze your answers' :
                                    hasResults ? 'Your analysis is complete! Time to create your action plan.' :
                                        'Share your challenge. We\'ll ask 5 personalized questions for deeper insight.'}
                    </p>
                </div>

                {/* Q&A Panel */}
                <AnimatePresence>
                    {showQAPanel && !qaCompleted && aiQuestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200 shadow-lg"
                        >
                            {/* Question Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-indigo-100">
                                        <HelpCircle className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Question {questionStep + 1} of {aiQuestions.length}</h3>
                                        <p className="text-sm text-gray-600">Take your time to provide a thoughtful answer</p>
                                    </div>
                                </div>
                            </div>

                            {/* Question Card */}
                            <motion.div
                                key={questionStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="mb-6"
                            >
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <h4 className="text-xl font-semibold text-gray-900 mb-6">
                                        {aiQuestions[questionStep]}
                                    </h4>

                                    {/* Answer Input Area */}
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <textarea
                                                ref={answerTextareaRef}
                                                value={currentAnswer}
                                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Type your detailed answer here..."
                                                rows="5"
                                                className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                disabled={isAnswering}
                                                maxLength={1000}
                                            />
                                            <div className="text-xs text-gray-500 mt-2 text-right">
                                                {currentAnswer.length}/1000 characters
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                                            <button
                                                onClick={onSkipQuestion}
                                                disabled={isAnswering}
                                                className="flex items-center gap-2 px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <SkipForward className="w-4 h-4" />
                                                {questionStep < aiQuestions.length - 1 ? 'Skip Question' : 'Skip to Analysis'}
                                            </button>

                                            <div className="flex items-center gap-3">
                                                <div className="text-sm text-gray-500">
                                                    Press Ctrl+Enter to submit
                                                </div>
                                                <motion.button
                                                    whileHover={!isTextareaEmpty() && !isAnswering ? { scale: 1.05 } : {}}
                                                    whileTap={!isTextareaEmpty() && !isAnswering ? { scale: 0.95 } : {}}
                                                    onClick={handleSubmitAnswer}
                                                    disabled={isTextareaEmpty() || isAnswering}
                                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${isTextareaEmpty() || isAnswering
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:shadow-lg'
                                                        }`}
                                                >
                                                    {isAnswering ? (
                                                        <>
                                                            <motion.div
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                            />
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            {questionStep < aiQuestions.length - 1 ? 'Next Question' : 'Finish Questions'}
                                                            <ArrowRight className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Progress Indicator */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    {[...Array(aiQuestions.length)].map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-8 h-2 rounded-full ${idx < questionStep
                                                ? 'bg-emerald-500'
                                                : idx === questionStep
                                                    ? 'bg-indigo-500'
                                                    : 'bg-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {Object.keys(userAnswers).length}/{aiQuestions.length} questions answered
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Analysis Options Panel */}
                <AnimatePresence>
                    {showAnalysisOptions && !hasResults && !transformationStarted && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mb-8"
                        >
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-200 shadow-xl">
                                <div className="text-center mb-8">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="inline-block p-4 rounded-full bg-emerald-100 text-emerald-600 mb-4"
                                    >
                                        <Sparkles className="w-8 h-8" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Congratulations! 🎉</h3>
                                    <p className="text-gray-600">You've completed all {aiQuestions.length} questions. What would you like to do next?</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* View Analysis Card */}
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="cursor-pointer"
                                        onClick={onViewAnalysis}
                                    >
                                        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all h-full flex flex-col">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 rounded-full bg-blue-100">
                                                    <Eye className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900">View Detailed Analysis</h4>
                                            </div>
                                            <p className="text-gray-600 mb-4 flex-grow">
                                                Get comprehensive AI insights with detailed breakdowns, patterns, and recommendations.
                                            </p>
                                            <div className="mt-auto">
                                                <div className="inline-flex items-center gap-2 text-blue-600 font-medium">
                                                    Explore Insights
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Start Transformation Card */}
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="cursor-pointer"
                                        onClick={onStartTransformation}
                                    >
                                        <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 border-2 border-emerald-200 hover:border-emerald-400 transition-all h-full flex flex-col">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 rounded-full bg-emerald-100">
                                                    <Rocket className="w-6 h-6 text-emerald-600" />
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900">Start Transformation</h4>
                                            </div>
                                            <p className="text-gray-600 mb-4 flex-grow">
                                                Jump straight into action with personalized tasks, daily goals, and progress tracking.
                                            </p>
                                            <div className="mt-auto">
                                                <div className="inline-flex items-center gap-2 text-emerald-600 font-medium">
                                                    Begin Journey
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                                    <p className="text-sm text-gray-500">
                                        <span className="inline-flex items-center gap-1">
                                            <Sparkles className="w-4 h-4" />
                                            Both options will save your progress
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Initial Input or Results State */}
                {!showQAPanel && !showAnalysisOptions && (
                    <>
                        {!hasResults ? (
                            // Initial Input State
                            <>
                                {/* Features */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    {features.map((feature, index) => (
                                        <motion.div
                                            key={feature.text}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ y: -4, scale: 1.02 }}
                                            className="group flex flex-col items-center text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all"
                                        >
                                            <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 mb-4 group-hover:scale-110 transition-transform">
                                                <feature.icon className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-2">{feature.text}</h4>
                                            <p className="text-sm text-gray-500">{feature.description}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <div className="relative">
                                        <textarea
                                            value={problemText}
                                            onChange={(e) => {
                                                if (e.target.value.length <= maxLength) {
                                                    setProblemText(e.target.value);
                                                    if (error) error = null;
                                                }
                                            }}
                                            placeholder={`Describe your challenge in detail...\n\nFor example:\n• "I feel stuck in my career and lack direction..."\n• "My productivity fluctuates and I can't maintain consistency..."\n• "I struggle with work-life balance and feel constantly stressed..."`}
                                            rows="8"
                                            className="w-full px-6 py-5 text-lg bg-white border-2 border-gray-300 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 outline-none transition-all duration-300 resize-none placeholder-gray-400 shadow-sm hover:shadow-md focus:shadow-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            disabled={isAskingQuestions}
                                        />

                                        {/* Character counter with animated progress */}
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <AnimatePresence>
                                                        {error && (
                                                            <motion.div
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0 }}
                                                                className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-lg"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                <span className="text-sm font-medium">{error}</span>
                                                            </motion.div>
                                                        )}
                                                        {isAskingQuestions && (
                                                            <motion.div
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg"
                                                            >
                                                                <Loader className="w-4 h-4 animate-spin" />
                                                                <span className="text-sm font-medium">Generating AI questions...</span>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <motion.div
                                                        className={`text-sm font-semibold ${charCount > maxLength * 0.9
                                                            ? 'text-rose-600'
                                                            : charCount > maxLength * 0.7
                                                                ? 'text-amber-600'
                                                                : 'text-gray-500'
                                                            }`}
                                                        key={charCount}
                                                        initial={{ scale: 1 }}
                                                        animate={{ scale: charCount % 10 === 0 ? [1, 1.2, 1] : 1 }}
                                                    >
                                                        {charCount} / {maxLength}
                                                    </motion.div>
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full ${charPercentage > 90
                                                                ? 'bg-gradient-to-r from-rose-500 to-pink-500'
                                                                : charPercentage > 70
                                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                                                    : 'bg-gradient-to-r from-emerald-500 to-green-500'
                                                                }`}
                                                            initial={{ width: '0%' }}
                                                            animate={{ width: `${charPercentage}%` }}
                                                            transition={{ duration: 0.5 }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Examples */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Sparkles className="w-4 h-4" />
                                            <span>Not sure what to write? Try one of these:</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {exampleProblems.slice(0, 4).map((example, idx) => (
                                                <motion.button
                                                    key={idx}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleExampleClick(example)}
                                                    className="p-3 text-left bg-white border border-gray-200 hover:border-indigo-300 rounded-xl hover:shadow-sm transition-all text-sm text-gray-600 hover:text-gray-900"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                >
                                                    {example.length > 70 ? example.substring(0, 70) + '...' : example}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Main Action Button */}
                                    <motion.button
                                        whileHover={!isLoading && problemText.trim().length >= 20 && !isAnalysisUnlocked && !isAskingQuestions ? {
                                            scale: 1.02,
                                            boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)"
                                        } : {}}
                                        whileTap={!isLoading && problemText.trim().length >= 20 && !isAnalysisUnlocked && !isAskingQuestions ? { scale: 0.98 } : {}}
                                        onClick={isAnalysisUnlocked ? handleAnalyze : onStartQASession}
                                        disabled={isLoading || problemText.trim().length < 20 || isAskingQuestions}
                                        className={`w-full py-5 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg relative overflow-hidden group ${isLoading || problemText.trim().length < 20 || isAskingQuestions
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : isAnalysisUnlocked
                                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-xl hover:from-emerald-600 hover:to-green-700'
                                                : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-xl hover:from-indigo-700 hover:to-blue-700'
                                            }`}
                                    >
                                        {/* Animated background */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                        {isLoading ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                />
                                                Analyzing...
                                            </>
                                        ) : isAskingQuestions ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Generating Questions...
                                            </>
                                        ) : isAnalysisUnlocked ? (
                                            <>
                                                <Brain className="w-5 h-5" />
                                                Generate AI Analysis
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        ) : (
                                            <>
                                                <Key className="w-5 h-5" />
                                                {problemText.trim().length >= 20 ? 'Continue to AI Questions' : 'Enter Your Challenge First'}
                                                {problemText.trim().length >= 20 && (
                                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                )}
                                            </>
                                        )}
                                    </motion.button>

                                    {/* Security & Privacy Note */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-center space-y-2 pt-4"
                                    >
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                <span>End-to-end encrypted</span>
                                            </div>
                                            <span className="text-gray-300">•</span>
                                            <span>No data stored</span>
                                            <span className="text-gray-300">•</span>
                                            <span>100% private</span>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            Your thoughts are processed securely • GDPR compliant • No account required
                                        </p>
                                    </motion.div>
                                </div>
                            </>
                        ) : (
                            /* Transformation State */
                            <div className="space-y-6 text-center">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", bounce: 0.4 }}
                                    className="bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-emerald-200/50 relative overflow-hidden"
                                >
                                    {/* Background pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-emerald-300 blur-3xl" />
                                        <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-green-300 blur-3xl" />
                                    </div>

                                    <div className="relative z-10">
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: 0.2, type: "spring" }}
                                            className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
                                        >
                                            {transformationStarted ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Loader className="w-10 h-10 text-white" />
                                                </motion.div>
                                            ) : (
                                                <Rocket className="w-10 h-10 text-white" />
                                            )}
                                        </motion.div>

                                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                            {transformationStarted
                                                ? 'Building Your Transformation Plan...'
                                                : 'Analysis Complete! 🎉'}
                                        </h3>

                                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                                            {transformationStarted
                                                ? 'AI is creating your personalized strategy, daily tasks, and progress timeline...'
                                                : 'Your problem has been analyzed. Ready to transform insights into action?'}
                                        </p>

                                        {/* Progress indicator for transformation */}
                                        {transformationStarted && (
                                            <motion.div
                                                initial={{ width: '0%' }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 2 }}
                                                className="max-w-md mx-auto mb-8"
                                            >
                                                <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
                                                        animate={{
                                                            backgroundPosition: ['0%', '100%']
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            repeat: Infinity,
                                                            ease: "linear"
                                                        }}
                                                        style={{
                                                            backgroundSize: '200% 100%',
                                                            backgroundImage: 'linear-gradient(90deg, #10b981, #34d399, #10b981)'
                                                        }}
                                                    />
                                                </div>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Generating personalized strategy...
                                                </p>
                                            </motion.div>
                                        )}

                                        <motion.button
                                            whileHover={!transformationStarted ? {
                                                scale: 1.05,
                                                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
                                            } : {}}
                                            whileTap={!transformationStarted ? { scale: 0.95 } : {}}
                                            onClick={onStartTransformation}
                                            disabled={transformationStarted}
                                            className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg group relative overflow-hidden ${transformationStarted
                                                ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white cursor-default'
                                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl'
                                                }`}
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                            {transformationStarted ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Creating Your Strategy...
                                                </>
                                            ) : (
                                                <>
                                                    <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                                                    Start Transformation Journey
                                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                                </>
                                            )}
                                        </motion.button>

                                        {!transformationStarted && (
                                            <p className="text-sm text-gray-500 mt-6">
                                                <span className="inline-flex items-center gap-1">
                                                    <Sparkles className="w-4 h-4" />
                                                    Includes: Daily tasks • Progress tracker • Timeline • Accountability system
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </motion.section>
    );
};

export default ProblemInput;