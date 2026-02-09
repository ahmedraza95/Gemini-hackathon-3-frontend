// src/pages/AnalysisReportPage.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import InsightsPanel from './insightpanel';
import ProgressChart from './progresschart';
import TimelineChart from './timelinechart';
import ResultCard from './resultcard';
import {
    Eye, Target, Calendar, AlertTriangle, Brain, Zap, TrendingUp,
    BarChart3, Rocket, CheckCircle, MessageSquare, ChevronRight,
    Sparkles, Lightbulb, HelpCircle, ArrowRight, Users, Clock,
    Download, Share2, Printer, FileText, Layers, PieChart,
    ArrowLeft, Maximize2, Minimize2, Filter, Search
} from 'lucide-react';

const AnalysisReportPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [analysisData, setAnalysisData] = useState(null);
    const [activeSection, setActiveSection] = useState('summary');
    const [activeStep, setActiveStep] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [exporting, setExporting] = useState(false);

    // Mock data structure for the report
    const defaultReport = {
        problem: "Career advancement and work-life balance challenges",
        timestamp: "2024-01-15 14:30",
        insights: {
            complexity: "Medium",
            confidence: 92,
            resolutionTime: "3-4 weeks",
            priority: "High"
        },
        stats: {
            clarityScore: 88,
            actionability: 76,
            urgency: 82,
            confidenceBoost: 91
        },
        results: {
            perceivedProblem: "I feel stuck in my current role with no clear path for advancement while also struggling to maintain a healthy work-life balance. The constant overtime is affecting my personal life, but I'm worried about asking for flexibility.",
            realProblem: "Core issue is a combination of unclear career progression criteria at your organization and difficulty setting professional boundaries due to fear of negative perception. The real constraint is not time but lack of structured career development framework and boundary-setting skills.",
            whyItHappens: "This pattern persists because: 1) Your organization lacks transparent promotion criteria, 2) You're compensating with overwork to feel secure, 3) There's no clear communication about career expectations, 4) You haven't developed negotiation skills for workplace boundaries.",
            commonMistakes: [
                "Working longer hours as a substitute for strategic career advancement",
                "Avoiding conversations about career progression due to discomfort",
                "Not documenting your achievements and contributions systematically",
                "Treating work-life balance as an afterthought rather than a priority",
                "Comparing your progress to others without context"
            ],
            keyInsights: [
                "Your skills are 40% underutilized in current role",
                "Boundary-setting could reduce overtime by 15+ hours/week",
                "Three specific growth areas align with company needs",
                "Peer support network is available but underutilized"
            ],
            rootCauses: [
                "Unclear organizational career pathways",
                "Fear-based overcompensation cycle",
                "Underdeveloped negotiation skills",
                "Lack of systematic achievement tracking"
            ],
            actionPlan: [
                "Schedule career development meeting with manager (Week 1)",
                "Create achievement portfolio documenting last 6 months (Week 1-2)",
                "Set and communicate clear work boundaries (Week 2)",
                "Identify and pursue one skill development opportunity (Week 3)",
                "Establish weekly progress review system (Ongoing)"
            ]
        },
        patterns: {
            commonThemes: ["Career progression uncertainty", "Work-life imbalance", "Communication barriers", "Skill utilization gaps"],
            recurrenceFrequency: "Monthly pattern observed for 4 months",
            triggerEvents: ["Performance reviews", "Team restructuring", "Quarterly planning"],
            improvementAreas: ["Communication skills", "Boundary setting", "Career planning", "Time management"]
        },
        recommendations: [
            "Implement structured weekly career check-ins",
            "Develop clear promotion criteria documentation",
            "Establish mentorship relationship within organization",
            "Create personal development roadmap with milestones"
        ],
        metrics: {
            problemClarity: 88,
            solutionFeasibility: 76,
            emotionalImpact: 65,
            resourceAvailability: 82,
            timelineRealism: 79
        }
    };

    useEffect(() => {
        // Get data from location state or localStorage
        const data = location.state?.analysis ||
            JSON.parse(localStorage.getItem('lastAnalysis')) ||
            defaultReport;

        setAnalysisData(data);

        // Store for future reference
        localStorage.setItem('lastAnalysis', JSON.stringify(data));
    }, [location.state]);

    const exportReport = async (format = 'pdf') => {
        setExporting(true);

        // Simulate export process
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create a downloadable file (simulated)
        const blob = new Blob([JSON.stringify(analysisData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analysis-report-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setExporting(false);

        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 animate-slide-in-right';
        notification.innerHTML = `
            <div class="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <div>
                    <p class="font-bold">Report Exported!</p>
                    <p class="text-sm opacity-90">Download will start shortly</p>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    const shareReport = () => {
        if (navigator.share) {
            navigator.share({
                title: 'AI Analysis Report',
                text: 'Check out this detailed problem analysis report',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);

            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 z-50 animate-slide-in-right';
            notification.innerHTML = `
                <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    <div>
                        <p class="font-bold">Link Copied!</p>
                        <p class="text-sm opacity-90">Share this analysis report</p>
                    </div>
                </div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    if (!analysisData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading analysis report...</p>
                </div>
            </div>
        );
    }

    const sections = [
        { id: 'summary', label: 'Summary', icon: FileText },
        { id: 'details', label: 'Details', icon: Layers },
        { id: 'patterns', label: 'Patterns', icon: PieChart },
        { id: 'timeline', label: 'Timeline', icon: TrendingUp },
        { id: 'recommendations', label: 'Recommendations', icon: CheckCircle }
    ];

    return (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isFullscreen ? 'py-4' : 'py-8'}`}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Analysis
                        </button>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Analysis Report
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {analysisData.timestamp || "Generated just now"}
                            </div>
                            <div className="flex items-center gap-1">
                                <Brain className="w-4 h-4" />
                                AI Confidence: {analysisData.insights?.confidence || 92}%
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-semibold">AI Analysis Complete</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => exportReport()}
                                disabled={exporting}
                                className="p-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                                title="Export Report"
                            >
                                {exporting ? (
                                    <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
                                ) : (
                                    <Download className="w-5 h-5 text-gray-600" />
                                )}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={shareReport}
                                className="p-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                                title="Share Report"
                            >
                                <Share2 className="w-5 h-5 text-gray-600" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleFullscreen}
                                className="p-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                            >
                                {isFullscreen ? (
                                    <Minimize2 className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <Maximize2 className="w-5 h-5 text-gray-600" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Problem Summary Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-3">Problem Analysis Summary</h2>
                            <p className="opacity-90 leading-relaxed max-w-3xl">
                                {analysisData.problem || analysisData.results?.perceivedProblem}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold">{analysisData.insights?.confidence || 92}%</div>
                                <p className="text-sm opacity-90">Confidence</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">{analysisData.stats?.clarityScore || 88}%</div>
                                <p className="text-sm opacity-90">Clarity</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex overflow-x-auto border-b border-gray-200 mb-8">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all ${activeSection === section.id
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <section.icon className="w-5 h-5" />
                            {section.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Summary Section */}
                {activeSection === 'summary' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <InsightsPanel
                            insights={analysisData.insights}
                            stats={analysisData.stats}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Key Insights */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100">
                                        <Lightbulb className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Key Insights</h3>
                                </div>
                                <div className="space-y-4">
                                    {(analysisData.results?.keyInsights || []).map((insight, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-bold">{index + 1}</span>
                                            </div>
                                            <p className="text-gray-700">{insight}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Root Causes */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-rose-100 to-pink-100">
                                        <AlertTriangle className="w-6 h-6 text-rose-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Root Causes</h3>
                                </div>
                                <div className="space-y-4">
                                    {(analysisData.results?.rootCauses || []).map((cause, index) => (
                                        <div key={index} className="p-4 bg-rose-50 rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-bold">{index + 1}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">Root Cause {index + 1}</h4>
                                                    <p className="text-gray-700">{cause}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Detailed Analysis Section */}
                {activeSection === 'details' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ staggerChildren: 0.1 }}
                        className="space-y-8"
                    >
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <ResultCard
                                    icon={Eye}
                                    title="What You Think The Problem Is"
                                    content={analysisData.results?.perceivedProblem}
                                    delay={0.1}
                                    color="from-blue-500 to-cyan-500"
                                    confidence={78}
                                />
                            </div>

                            <div className="lg:col-span-2 lg:row-start-2">
                                <ResultCard
                                    icon={Target}
                                    title="The Real Core Issue"
                                    content={analysisData.results?.realProblem}
                                    delay={0.2}
                                    color="from-indigo-500 to-purple-500"
                                    confidence={85}
                                />
                            </div>

                            <div className="lg:row-span-2">
                                <ResultCard
                                    icon={Calendar}
                                    title="Why This Keeps Happening"
                                    content={analysisData.results?.whyItHappens}
                                    delay={0.3}
                                    color="from-amber-500 to-orange-500"
                                    confidence={82}
                                />
                            </div>

                            <ResultCard
                                icon={AlertTriangle}
                                title="Common Mistakes to Avoid"
                                content={analysisData.results?.commonMistakes || []}
                                delay={0.4}
                                color="from-rose-500 to-pink-500"
                                confidence={90}
                                list
                            />
                        </div>
                    </motion.div>
                )}

                {/* Patterns Section */}
                {activeSection === 'patterns' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-100 to-green-100">
                                    <PieChart className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Pattern Analysis</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Common Themes</h4>
                                    <div className="space-y-2">
                                        {(analysisData.patterns?.commonThemes || []).map((theme, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                                    <span className="text-white font-bold">{index + 1}</span>
                                                </div>
                                                <span className="text-gray-700">{theme}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Pattern Details</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Recurrence Frequency</p>
                                            <p className="font-medium text-gray-900">
                                                {analysisData.patterns?.recurrenceFrequency || "Monthly pattern"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Trigger Events</p>
                                            <p className="font-medium text-gray-900">
                                                {Array.isArray(analysisData.patterns?.triggerEvents)
                                                    ? analysisData.patterns.triggerEvents.join(', ')
                                                    : analysisData.patterns?.triggerEvents}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Most Improved Area</p>
                                            <p className="font-medium text-gray-900">
                                                {(analysisData.patterns?.improvementAreas || [])[0] || "Communication skills"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Metrics */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Progress Metrics</h3>
                            <ProgressChart stats={analysisData.stats} />
                        </div>
                    </motion.div>
                )}

                {/* Timeline Section */}
                {activeSection === 'timeline' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Action Timeline</h3>
                            <TimelineChart
                                steps={analysisData.results?.actionPlan?.map((step, index) => ({
                                    day: index + 1,
                                    title: step.split('(')[0].trim(),
                                    description: step,
                                    duration: '1 week',
                                    priority: index === 0 ? 'High' : index < 3 ? 'Medium' : 'Low'
                                })) || []}
                                activeStep={activeStep}
                                setActiveStep={setActiveStep}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Recommendations Section */}
                {activeSection === 'recommendations' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">AI Recommendations</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(analysisData.recommendations || []).map((rec, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <span className="text-emerald-600 font-bold text-xl">{index + 1}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">Recommendation {index + 1}</h4>
                                                <p className="text-gray-700">{rec}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Action Steps */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Immediate Action Steps</h3>
                            <div className="space-y-4">
                                {(analysisData.results?.actionPlan || []).slice(0, 3).map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-700">{step}</p>
                                        </div>
                                        <div className="text-sm font-semibold text-blue-600">
                                            Week {index + 1}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Footer Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
            >
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Take Action?</h3>
                            <p className="text-gray-600">
                                Turn these insights into real progress with a personalized transformation plan
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/tasks')}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all group"
                            >
                                <Rocket className="w-6 h-6" />
                                Start Transformation
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/strategy')}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-bold text-lg rounded-xl hover:bg-indigo-50 transition-all group"
                            >
                                <Brain className="w-6 h-6" />
                                View Strategies
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AnalysisReportPage;