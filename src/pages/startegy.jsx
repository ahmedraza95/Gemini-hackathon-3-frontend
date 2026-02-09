import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Target, Zap, TrendingUp, Brain, Rocket, LineChart,
    CheckCircle, PlayCircle, PauseCircle, AlertTriangle,
    Users, Shield, Clock, Award, Star, Download, Share2
} from 'lucide-react';
import { getStrategyData, getStrategyInsights, activateStrategy, deactivateStrategy } from '../services/api';

const StrategyPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const queryClient = useQueryClient();

    // Fetch strategy data
    const { data: strategyData, isLoading: strategyLoading } = useQuery({
        queryKey: ['strategy'],
        queryFn: getStrategyData,
    });

    // Fetch insights
    const { data: insightsData, isLoading: insightsLoading } = useQuery({
        queryKey: ['strategy-insights'],
        queryFn: getStrategyInsights,
    });

    // Activate strategy mutation
    const activateMutation = useMutation({
        mutationFn: activateStrategy,
        onSuccess: () => {
            queryClient.invalidateQueries(['strategy']);
        },
    });

    // Deactivate strategy mutation
    const deactivateMutation = useMutation({
        mutationFn: deactivateStrategy,
        onSuccess: () => {
            queryClient.invalidateQueries(['strategy']);
        },
    });

    const toggleStrategy = (strategyId, isActive) => {
        if (isActive) {
            deactivateMutation.mutate(strategyId);
        } else {
            activateMutation.mutate(strategyId);
        }
    };

    if (strategyLoading || insightsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading strategy data...</p>
                </div>
            </div>
        );
    }

    const strategies = strategyData?.strategies || [];
    const activeStrategies = strategies.filter(s => s.isActive);
    const performance = strategyData?.performanceMetrics || {};
    const recommendations = strategyData?.recommendations || [];
    const patternDetection = insightsData?.patternDetection || {};
    const successStories = insightsData?.successStories || [];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Strategy Engine</h1>
                        <p className="text-gray-600">Intelligent problem-solving strategies powered by Gemini AI</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full">
                            <Rocket className="w-4 h-4" />
                            <span className="text-sm font-semibold">{activeStrategies.length} Active Strategies</span>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                            <LineChart className="w-4 h-4" />
                            Generate New Strategy
                        </button>
                    </div>
                </div>

                {/* Performance Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Strategy Performance</h2>
                            <p className="opacity-90">AI-powered analysis working 24/7 to optimize your problem-solving</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold">{performance.averageEffectiveness || 85}%</div>
                                <p className="text-sm opacity-90">Effectiveness</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">{performance.totalStrategiesUsed || 126}</div>
                                <p className="text-sm opacity-90">Strategies Used</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">{performance.successRate || 89}%</div>
                                <p className="text-sm opacity-90">Success Rate</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">{activeStrategies.length}</div>
                                <p className="text-sm opacity-90">Active Now</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 border-b border-gray-200 mb-8">
                    {['overview', 'strategies', 'insights', 'recommendations'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium rounded-t-lg transition-all ${activeTab === tab ? 'bg-white border-t border-l border-r border-gray-200 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="space-y-8">
                    {/* Active Strategies */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Active Strategies</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeStrategies.map((strategy) => (
                                <motion.div
                                    key={strategy.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-lg"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                                                <Brain className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{strategy.name}</h4>
                                                <p className="text-sm text-gray-600">{strategy.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleStrategy(strategy.id, true)}
                                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                                            disabled={deactivateMutation.isLoading}
                                        >
                                            <PauseCircle className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Effectiveness</span>
                                                <span className="font-semibold">{strategy.effectiveness}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${strategy.effectiveness}%` }}
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Zap className="w-4 h-4" />
                                                <span>Used {strategy.usageCount} times</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>Last: {strategy.lastUsed}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200">
                                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Steps:</h5>
                                            <ul className="space-y-1">
                                                {strategy.steps.map((step, index) => (
                                                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs">
                                                            {index + 1}
                                                        </div>
                                                        {step}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                            <div className="flex items-center gap-3 mb-4">
                                <TrendingUp className="w-8 h-8 text-amber-600" />
                                <div>
                                    <h4 className="font-bold text-gray-900">Pattern Recognition</h4>
                                    <p className="text-sm text-gray-600">AI detects recurring issues</p>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{patternDetection.commonThemes?.length || 3} patterns</div>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="w-8 h-8 text-emerald-600" />
                                <div>
                                    <h4 className="font-bold text-gray-900">Success Rate</h4>
                                    <p className="text-sm text-gray-600">Based on user feedback</p>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{performance.successRate || 89}%</div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-8 h-8 text-blue-600" />
                                <div>
                                    <h4 className="font-bold text-gray-900">AI Confidence</h4>
                                    <p className="text-sm text-gray-600">Strategy recommendations</p>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-90">94%</div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'strategies' && (
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">All Available Strategies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {strategies.map((strategy) => (
                            <div key={strategy.id} className="bg-white rounded-2xl p-6 border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${strategy.isActive ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                                            {strategy.isActive ? (
                                                <Zap className="w-5 h-5 text-indigo-600" />
                                            ) : (
                                                <Target className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{strategy.name}</h4>
                                            <p className="text-sm text-gray-600">{strategy.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleStrategy(strategy.id, strategy.isActive)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${strategy.isActive ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'}`}
                                        disabled={activateMutation.isLoading || deactivateMutation.isLoading}
                                    >
                                        {strategy.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Effectiveness</span>
                                        <span className="font-semibold">{strategy.effectiveness}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                                            style={{ width: `${strategy.effectiveness}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Used {strategy.usageCount} times</span>
                                        <span>{strategy.isActive ? '● Active' : '○ Inactive'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'insights' && (
                <div className="space-y-8">
                    {/* Pattern Detection */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Pattern Detection</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Common Themes</h4>
                                <div className="space-y-2">
                                    {(patternDetection.commonThemes || []).map((theme, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                                                {index + 1}
                                            </div>
                                            <span className="text-gray-700">{theme}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Analysis Insights</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Peak Analysis Times</p>
                                        <p className="font-medium text-gray-900">{patternDetection.peakAnalysisTimes?.join(', ') || 'Monday 10 AM'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Average Duration</p>
                                        <p className="font-medium text-gray-900">{patternDetection.averageAnalysisDuration || '8.5 minutes'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Most Improved Category</p>
                                        <p className="font-medium text-gray-900">{patternDetection.mostImprovedCategory || 'Career decisions (+42% clarity)'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Success Stories */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Success Stories</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {successStories.map((story) => (
                                <div key={story.id} className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Award className="w-8 h-8 text-indigo-600" />
                                        <div>
                                            <h4 className="font-bold text-gray-900">{story.strategy}</h4>
                                            <p className="text-sm text-gray-600">Strategy Applied</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-3 line-clamp-2">{story.problem}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-emerald-600">{story.outcome}</span>
                                        <Star className="w-4 h-4 text-amber-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'recommendations' && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Recommendations</h3>
                        <div className="space-y-4">
                            {recommendations.map((rec, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-4 p-4 bg-white rounded-xl"
                                >
                                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <p className="text-gray-700">{rec}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4">Optimization Tips</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-amber-50 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                    <span className="font-medium text-gray-900">Pro Tip</span>
                                </div>
                                <p className="text-sm text-gray-700">Use Progressive Analysis for complex, multi-faceted problems</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-gray-900">Quick Win</span>
                                </div>
                                <p className="text-sm text-gray-700">Apply Root Cause Analysis when symptoms keep recurring</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default StrategyPage;