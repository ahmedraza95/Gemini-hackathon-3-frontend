// src/components/ResultCard.jsx (Enhanced)
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

const ResultCard = ({ icon: Icon, title, content, delay = 0, color = "from-indigo-500 to-blue-500", confidence, list = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.5,
                delay,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300 h-full"
        >
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {title}
                        </h3>
                        {confidence && (
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                        style={{ width: `${confidence}%` }}
                                    />
                                </div>
                                <span className="text-xs font-semibold text-gray-600">{confidence}% confidence</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-gray-700 leading-relaxed">
                {list ? (
                    <ul className="space-y-3">
                        {Array.isArray(content) ? (
                            content.map((item, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: delay + index * 0.05 }}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </motion.li>
                            ))
                        ) : (
                            <li>{content}</li>
                        )}
                    </ul>
                ) : (
                    <p className="whitespace-pre-line">{content}</p>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <div className={`h-1.5 w-24 bg-gradient-to-r ${color} rounded-full`} />
            </div>
        </motion.div>
    )
}

export default ResultCard