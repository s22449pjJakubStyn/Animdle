import React, {useContext, useState} from 'react';
import '../styles/App.css';
import '../styles/MainPage.css';
import animdle_logo2 from '../img/animdle_logo2.png';
import register_logo from '../img/register_logo.png';
import game_pannel2 from '../img/game_pannel2.png';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const MainPage = () => {
    const { isLoggedIn, setIsLoggedIn,  currentUser, currentPoints, currentNick, currentLevel } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isYourPointsOpen, setIsYourPointsOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const handleYourPointsClick = () => {
        setIsYourPointsOpen(!isYourPointsOpen);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    const levelThresholds = [0, 0, 300, 700, 1200]; // Przykładowe progi punktów dla poziomów 0, 1, 2, 3

    // Obliczanie procentowego postępu
    const currentThreshold = levelThresholds[currentLevel]; // Prog punktów dla aktualnego poziomu
    const nextThreshold = levelThresholds[currentLevel + 1]; // Prog punktów dla następnego poziomu
    const progress = (currentPoints - currentThreshold) / (nextThreshold - currentThreshold) * 100;

    return (
        <div className="App">
            <div className="Background" />
            <Link to="/">
                <img src={animdle_logo2} className="Logo" alt="logo" />
            </Link>
            <Link to="/classic">
                <div className="GamePannelContainer">
                    <img src={game_pannel2} className="GamePannel" alt="gamepannel2" />
                    <div className="GamePannelText">Classic</div>
                    <div className="GamePannelDescription">Get clue on every try</div>
                </div>
            </Link>
            {isLoggedIn ? (
                <div>
                    <div className="LevelContainer">
                        <span className="ProgressTitle">Progress: {currentPoints} / {nextThreshold}</span>
                            <div className="BarLook">
                                <div className="BarProgress" style={{ width: `${progress}%` }} />
                            </div>
                    </div>
                    <button className="UserName" onClick={handleMenuClick}>
                        Ohayo {currentNick}
                    </button>
                    {isMenuOpen && (
                        <div className="Menu">
                            <button className="MenuItem" onClick={handleYourPointsClick}>
                                Your Points
                            </button>
                            {isYourPointsOpen && (
                                <div className="YourPoints">Points: {currentPoints}</div>
                            )}
                            <div className="YourPoints">Level: {currentLevel}</div>
                            <Link to="/account"><button className="MenuItem"> Account</button></Link>
                            <Link to="/ranking"><button className="MenuItem"> Players Ranking</button></Link>
                            <Link to="/achievements"><button className="MenuItem"> Your Achievements</button></Link>
                        </div>
                    )}
                    <button onClick={handleLogout} className="Logout">Wyloguj się</button>
                </div>
            ) : (
                <div>
                    <Link to="/register">
                        <img src={register_logo} className="Register" alt="register_logo" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MainPage;