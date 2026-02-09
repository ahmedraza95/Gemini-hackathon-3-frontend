// src/components/InsightsPanel.jsx
import { motion } from 'framer-motion'
import { Brain, Target, Clock, TrendingUp } from 'lucide-react'

const InsightsPanel = ({ insights, stats }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-rose-100 text-rose-800'
            case 'Medium': return 'bg-amber-100 text-amber-800'
            case 'Low': return 'bg-emerald-100 text-emerald-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <Brain className="w-8 h-8 text-indigo-600" />
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(insights.complexity)}`}>
                            {insights.complexity}
                        </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Complexity Level</h4>
                    <p className="text-sm text-gray-600">Problem requires structured approach</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <Target className="w-8 h-8 text-blue-600" />
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {insights.confidence}%
                        </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Confidence</h4>
                    <p className="text-sm text-gray-600">High accuracy analysis</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="w-8 h-8 text-emerald-600" />
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                            {insights.resolutionTime}
                        </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Resolution Time</h4>
                    <p className="text-sm text-gray-600">Estimated timeframe</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="w-8 h-8 text-amber-600" />
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                            {stats.clarityScore}%
                        </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Clarity Score</h4>
                    <p className="text-sm text-gray-600">Post-analysis understanding</p>
                </div>
            </div>
        </motion.div>
    )
}

export default InsightsPanel