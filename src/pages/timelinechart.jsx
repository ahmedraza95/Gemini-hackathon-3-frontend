// src/components/TimelineChart.jsx
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react'

const TimelineChart = ({ steps, activeStep, setActiveStep }) => {
    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

            <div className="space-y-6">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                    >
                        <div className="flex items-start gap-4">
                            {/* Timeline dot */}
                            <div className="relative z-10 flex-shrink-0">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveStep(index)}
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${index <= activeStep
                                            ? 'bg-gradient-to-r from-indigo-500 to-blue-500 shadow-lg'
                                            : 'bg-gray-100 border border-gray-300'
                                        }`}
                                >
                                    {index < activeStep ? (
                                        <CheckCircle className="w-8 h-8 text-white" />
                                    ) : index === activeStep ? (
                                        <Clock className="w-8 h-8 text-white" />
                                    ) : (
                                        <Circle className="w-8 h-8 text-gray-400" />
                                    )}
                                </motion.button>
                                <div className="text-center mt-2">
                                    <span className="text-sm font-semibold text-gray-900">Day {step.day}</span>
                                </div>
                            </div>

                            {/* Step content */}
                            <div className={`flex-1 bg-white rounded-2xl p-6 border transition-all ${index === activeStep
                                    ? 'border-indigo-300 shadow-lg bg-indigo-50/50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${step.priority === 'High'
                                            ? 'bg-rose-100 text-rose-800'
                                            : step.priority === 'Medium'
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-emerald-100 text-emerald-800'
                                        }`}>
                                        {step.priority} Priority
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">{step.description}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span>{step.duration}</span>
                                    </div>
                                    {index === activeStep && (
                                        <span className="text-sm font-medium text-indigo-600">Current Step</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default TimelineChart