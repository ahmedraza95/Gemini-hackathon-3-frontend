import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryProvider } from './hooks/provider';
import MainLayout from './laoyout/mainlayout';
import HomePage from './pages/homepage/homepage';
import AnalyzePage from './pages/analyzepage';
import TasksPage from './pages/taskpage';
import StrategyPage from './pages/startegy';
import DashboardPage from './pages/dashboard';
import AnalysisReportPage from './pages/analysis';

function App() {
  return (
    <QueryProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="analyze" element={<AnalyzePage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="analysis" element={<AnalysisReportPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </Router>
    </QueryProvider>
  );
}

export default App;