import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AnalysisPage from './pages/analysis/analysis';

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AnalysisPage />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
