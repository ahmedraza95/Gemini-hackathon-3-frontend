import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
    TrendingUp, Target, Brain, Clock, Users, Award,
    BarChart3, PieChart, Activity, Calendar, Download,
    ArrowUpRight, ArrowDownRight, ChevronRight, Filter
} from 'lucide-react';
import { getDashboardData } from '../services/api';

const DashboardPage = () => {
    const [timeRange, setTimeRange] = useState('week');
    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['dashboard', timeRange],
        queryFn: getDashboardData,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    const stats = dashboardData?.stats || {};
    const progress = dashboardData?.progress || {};
    const insights = dashboardData?.insights || {};
    const recentAnalyses = dashboardData?.recentAnalyses || [];

    const metrics = [
        { label: 'Problems Solved', value: stats.totalAnalyses || 0, change: '+12%', icon: Brain, color: 'from-blue-500 to-cyan-500' },
        { label: 'Avg. Clarity Gain', value: `${stats.avgClarity || 0}%`, change: '+8%', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
        { label: 'Completion Rate', value: `${stats.completionRate || 0}%`, change: '+5%', icon: Target, color: 'from-indigo-500 to-purple-500' },
        { label: 'Current Streak', value: stats.currentStreak || 0, change: '+3 days', icon: Award, color: 'from-amber-500 to-orange-500' },
    ];

    const timeRanges = [
        { label: 'Today', value: 'day' },
        { label: 'This Week', value: 'week' },
        { label: 'This Month', value: 'month' },
        { label: 'Quarter', value: 'quarter' },
        { label: 'Year', value: 'year' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-600">Track your problem-solving journey with AI insights</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {timeRanges.map((range) => (
                            <button
                                key={range.value}
                                onClick={() => setTimeRange(range.value)}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${timeRange === range.value ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                                <metric.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
                                <ArrowUpRight className="w-4 h-4" />
                                {metric.change}
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Progress Chart */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Progress Overview</h3>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                            Details <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-6">
                        {Object.entries(progress).map(([key, value]) => (
                            <div key={key}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-700 capitalize">{key}</span>
                                    <span className="font-semibold">{value}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${value}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insights Chart */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Key Insights</h3>
                        <Activity className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                            <div>
                                <p className="text-sm text-gray-600">Success Rate</p>
                                <p className="text-2xl font-bold text-gray-900">{insights.successRate || 78}%</p>
                            </div>
                            <ArrowUpRight className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                            <div>
                                <p className="text-sm text-gray-600">Avg. Resolution Time</p>
                                <p className="text-2xl font-bold text-gray-900">{insights.avgResolutionTime || '2.3 weeks'}</p>
                            </div>
                            <Clock className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                            <div>
                                <p className="text-sm text-gray-600">Best Streak</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.bestStreak || 7} days</p>
                            </div>
                            <Award className="w-8 h-8 text-amber-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity & Top Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Analyses */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Recent Analyses</h3>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
                    </div>
                    <div className="space-y-4">
                        {recentAnalyses.map((analysis, index) => (
                            <motion.div
                                key={analysis.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl group"
                            >
                                <div>
                                    <p className="font-medium text-gray-900 line-clamp-1">{analysis.problem}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-sm text-gray-600">{analysis.date}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                            <span className="text-sm text-gray-600">{analysis.clarity}% clarity</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {(analysis.tags || []).map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Top Categories */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Top Categories</h3>
                    <div className="space-y-4">
                        {(insights.topCategories || []).map((category, index) => (
                            <div key={category} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center">
                                        {index === 0 && <Brain className="w-5 h-5 text-indigo-600" />}
                                        {index === 1 && <Users className="w-5 h-5 text-indigo-600" />}
                                        {index === 2 && <Target className="w-5 h-5 text-indigo-600" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{category}</p>
                                        <p className="text-sm text-gray-600">
                                            {index === 0 && 'Work & Productivity'}
                                            {index === 1 && 'Relationships & Team'}
                                            {index === 2 && 'Career & Purpose'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">
                                        {index === 0 && '42%'}
                                        {index === 1 && '28%'}
                                        {index === 2 && '19%'}
                                    </p>
                                    <p className="text-xs text-gray-600">of analyses</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
                        <p className="text-sm text-gray-600">
                            You're most actively solving work-related problems, with an average clarity gain of {stats.avgClarity || 0}%.
                            Keep up the streak to maintain momentum!
                        </p>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Recommendations</h3>
                        <p className="text-gray-600">Personalized suggestions based on your activity</p>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg">
                        Apply Recommendations
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Target className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Focus Area</h4>
                        </div>
                        <p className="text-sm text-gray-600">Work-related problems show highest clarity gains. Focus here for quick wins.</p>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Time Optimization</h4>
                        </div>
                        <p className="text-sm text-gray-600">Your peak analysis time is Monday morning. Schedule deep work then.</p>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Growth Target</h4>
                        </div>
                        <p className="text-sm text-gray-600">Aim for 4+ day streak to unlock advanced AI strategies.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardPage;