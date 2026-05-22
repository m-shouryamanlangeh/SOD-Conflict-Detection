import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header       from './components/Header';
import UploadPage   from './pages/UploadPage';
import WorkflowPage from './pages/WorkflowPage';
import AboutPage    from './pages/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
        <Header />
        <main className="flex-1 w-full">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <Routes>
              <Route path="/"         element={<UploadPage />}   />
              <Route path="/workflow" element={<WorkflowPage />} />
              <Route path="/about"    element={<AboutPage />}    />
              <Route path="*"         element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-[11px] text-slate-400">
            <span>SAP SoD Analyzer · Powered by n8n</span>
            <span className="font-mono">v1.0</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
