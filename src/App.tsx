import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { CalendarPage } from './pages/CalendarPage';
import { StatsPage } from './pages/StatsPage';
import { AIPage } from './pages/AIPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-[#eef2ef] relative overflow-hidden">
          <div className="blur-ball bg-green-200 top-[-100px] right-[-80px]" />
          <div className="blur-ball bg-orange-100 bottom-[-120px] left-[-80px]" />
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/ai" element={<AIPage />} />
            </Routes>
            <BottomNav />
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
