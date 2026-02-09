// src/components/Hero.jsx (Enhanced)
import { motion } from 'framer-motion'
import { ChevronDown, Sparkles, Brain, Target, Zap } from 'lucide-react'

const Hero = () => {
    const scrollToInput = () => {
        document.getElementById('problem-input').scrollIntoView({
            behavior: 'smooth'
        })
    }

    const stats = [
        { value: '2.1K+', label: 'Problems Solved' },
        { value: '94%', label: 'User Satisfaction' },
        { value: '2.3h', label: 'Avg. Time Saved' },
        { value: '87%', label: 'Clarity Boost' }
    ]

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-white to-blue-50/20" />

            <div className="max-w-6xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg mb-10"
                >
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        <span className="font-semibold text-gray-800">
                            ExplainMyProblem.ai
                        </span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-sm text-gray-600">
                        AI-Powered Problem Solving
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8"
                >
                    <span className="block text-gray-800">
                        You don't need
                    </span>
                    <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-transparent bg-clip-text">
                        advice.
                    </span>
                    <span className="block mt-4 text-gray-800">
                        You need
                    </span>
                    <span className="block mt-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 text-transparent bg-clip-text">
                        clarity.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                    Explain your problem once. Get the real issue, clearly explained with actionable steps and progress tracking.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToInput}
                    className="group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 mb-16"
                >
                    <span>Start Analyzing Free</span>
                    <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </motion.button>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16"
                >
                    {stats.map((stat, index) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                >
                    {[
                        { icon: Brain, title: 'AI Analysis', desc: 'Advanced reasoning models' },
                        { icon: Target, title: 'Actionable Steps', desc: 'Clear, measurable actions' },
                        { icon: Zap, title: 'Instant Clarity', desc: 'No waiting, immediate insights' }
                    ].map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + index * 0.1 }}
                            className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center">
                                <feature.icon className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
                    onClick={scrollToInput}
                >
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-gray-500">Scroll to analyze</span>
                        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
                            <div className="w-1 h-3 bg-indigo-500 rounded-full mt-2" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default Hero