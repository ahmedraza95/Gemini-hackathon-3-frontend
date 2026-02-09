// src/components/Footer.jsx (Enhanced)
import { motion } from 'framer-motion'
import { Heart, Shield, Lock, Sparkles } from 'lucide-react'

const Footer = () => {
    const features = [
        { icon: Shield, text: 'Enterprise Security' },
        { icon: Lock, text: 'End-to-End Encryption' },
        { icon: Sparkles, text: 'AI-Powered Insights' }
    ]

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 border-t border-gray-200/50 bg-gradient-to-b from-white to-gray-50/30"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.text}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200"
                        >
                            <feature.icon className="w-10 h-10 text-indigo-600 mb-4" />
                            <h4 className="font-semibold text-gray-900 mb-2">{feature.text}</h4>
                            <p className="text-sm text-gray-600">
                                {feature.text === 'Enterprise Security' && 'SOC 2 Type II compliant'}
                                {feature.text === 'End-to-End Encryption' && 'Your data is never stored'}
                                {feature.text === 'AI-Powered Insights' && 'Advanced reasoning models'}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Main footer */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-8 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                ExplainMyProblem.ai
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            <span className="text-gray-600">
                                Built for clarity • Powered by intelligence
                            </span>
                        </div>
                    </div>

                    <div className="text-center md:text-right">
                        <p className="text-gray-600 mb-2">
                            No authentication required • Your privacy matters
                        </p>
                        <div className="flex items-center justify-center md:justify-end gap-4">
                            <span className="text-xs text-gray-500">
                                © {new Date().getFullYear()} ExplainMyProblem.ai
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                                Terms
                            </a>
                            <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                                Privacy
                            </a>
                            <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                    <p className="text-gray-500 text-sm">
                        This tool provides AI-generated insights. Use discretion in applying suggestions to your situation.
                        <span className="block mt-2 text-xs text-gray-400">
                            AI models may produce inaccurate information. Always verify critical decisions.
                        </span>
                    </p>
                </div>
            </div>
        </motion.footer>
    )
}

export default Footer