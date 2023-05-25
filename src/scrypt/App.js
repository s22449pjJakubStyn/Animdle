import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import ClassicMode from './ClassicMode';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/classic" element={<ClassicMode />} />
            </Routes>
        </Router>
    );
}

export default App;
