import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import MainPage from './MainPage';
import ClassicMode from './ClassicMode';
import Register from './Register';
import Login from './Login';
import PlayersRanking from './PlayersRanking';
import UserAchievemnts from "./UserAchievemnts";

function App() {
    return (
        <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/classic" element={<ClassicMode />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/ranking" element={<PlayersRanking />} />
                <Route path="/achievements" element={<UserAchievemnts />} />
            </Routes>
        </Router>
        </AuthProvider>
    );
}

export default App;
