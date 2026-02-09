// src/components/ProgressChart.jsx
import { motion } from 'framer-motion'
import { TrendingUp, Target, Zap, Brain } from 'lucide-react'

const ProgressChart = ({ stats }) => {
    const metrics = [
        { icon: Brain, label: 'Clarity', value: stats.clarityScore, color: 'from-blue-500 to-cyan-500' },
        { icon: Zap, label: 'Actionability', value: stats.actionability, color: 'from-emerald-500 to-teal-500' },
        { icon: TrendingUp, label: 'Urgency', value: stats.urgency, color: 'from-amber-500 to-orange-500' },
        { icon: Target, label: 'Confidence', value: stats.confidenceBoost, color: 'from-indigo-500 to-purple-500' },
    ]

    return (
        <div className="space-y-6">
            {metrics.map((metric, index) => (
                <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                                <metric.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-medium text-gray-900">{metric.label}</span>
                                <span className="ml-2 text-sm text-gray-500">{metric.value}%</span>
                            </div>
                        </div>
                        <span className="font-semibold text-gray-900">{metric.value}%</span>
                    </div>

                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export default ProgressChart