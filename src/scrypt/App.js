import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import MainPage from './MainPage';
import ClassicMode from './ClassicMode';
import Register from './Register';
import Login from './Login';
import PlayersRanking from './PlayersRanking';
import UserAchievemnts from "./UserAchievemnts";
import UserAccount from "./UserAccount";
import Shop from "./Shop";
import QuoteMode from "./QuoteMode";

function App() {
    return (
        <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/classic" element={<ClassicMode />} />
                <Route path="/quote" element={<QuoteMode />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/ranking" element={<PlayersRanking />} />
                <Route path="/achievements" element={<UserAchievemnts />} />
                <Route path="/account" element={<UserAccount />} />
                <Route path="/shop" element={<Shop />} />
            </Routes>
        </Router>
        </AuthProvider>
    );
}

export default App;
