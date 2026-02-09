// src/components/EnhancedLoader.jsx
import { motion } from 'framer-motion';
import { Brain, Sparkles, Target, Zap, CheckCircle } from 'lucide-react';

const Loader = ({ progress = 0, message = "Processing...", type = "analysis" }) => {
    const analysisInsights = [
        "Analyzing emotional patterns...",
        "Identifying core issues...",
        "Generating actionable steps...",
        "Calculating confidence scores..."
    ];

    const transformationInsights = [
        "Designing your personal journey...",
        "Creating actionable tasks...",
        "Setting up progress tracking...",
        "Optimizing your timeline..."
    ];

    const insights = type === "transformation" ? transformationInsights : analysisInsights;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 relative overflow-hidden"
            >
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-r from-indigo-100/30 to-purple-100/30"
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                {/* Header */}
                <div className="text-center mb-8 relative z-10">
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="w-20 h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                    >
                        {type === "transformation" ? (
                            <Sparkles className="w-10 h-10 text-white" />
                        ) : (
                            <Brain className="w-10 h-10 text-white" />
                        )}
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold text-gray-900 mb-3"
                    >
                        {type === "transformation" ? "Building Your Journey" : "Deep Analysis in Progress"}
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600"
                    >
                        {message}
                    </motion.p>
                </div>

                {/* Progress with animation */}
                <div className="mb-8 relative z-10">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{type === "transformation" ? "Creating plan..." : "Processing..."}</span>
                        <span>{Math.round(progress || 0)}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden relative">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress || 0}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`h-full rounded-full ${type === "transformation" 
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                                : 'bg-gradient-to-r from-indigo-500 to-blue-500'
                            }`}
                        />
                        
                        {/* Shimmer effect on progress bar */}
                        <motion.div
                            className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 0.3
                            }}
                        />
                    </div>
                </div>

                {/* Insights grid with staggered animation */}
                <div className="grid grid-cols-2 gap-3 mb-8 relative z-10">
                    {insights.map((insight, index) => (
                        <motion.div
                            key={insight}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ 
                                delay: index * 0.15,
                                type: "spring",
                                stiffness: 200
                            }}
                            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ 
                                        duration: 4, 
                                        repeat: Infinity,
                                        delay: index * 0.5
                                    }}
                                >
                                    {index === 0 && <Sparkles className="w-4 h-4 text-purple-500" />}
                                    {index === 1 && <Target className="w-4 h-4 text-blue-500" />}
                                    {index === 2 && <Zap className="w-4 h-4 text-amber-500" />}
                                    {index === 3 && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                </motion.div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">{insight}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Pulsing dots */}
                <div className="flex justify-center gap-3 relative z-10">
                    {[0, 1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            className={`w-3 h-3 rounded-full ${type === "transformation"
                                ? 'bg-gradient-to-r from-emerald-400 to-green-400'
                                : 'bg-gradient-to-r from-indigo-400 to-blue-400'
                            }`}
                            animate={{
                                y: ["0%", "-100%", "0%"],
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {/* Completion indicator */}
                {progress >= 100 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/5 flex items-center justify-center"
                    >
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                            >
                                <CheckCircle className="w-8 h-8 text-white" />
                            </motion.div>
                            <p className="text-emerald-700 font-semibold">Complete!</p>
                        </div>
                    </motion.div>
                )}

                {/* Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-gray-500 text-center mt-6 relative z-10"
                >
                    {type === "transformation" 
                        ? "This takes 15-30 seconds. Your personalized plan is being created."
                        : "This usually takes 10-20 seconds. Our AI is analyzing deeply."
                    }
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Loader;