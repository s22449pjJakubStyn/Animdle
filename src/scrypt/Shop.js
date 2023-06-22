import React, {useContext, useState} from 'react';
import '../styles/App.css';
import '../styles/MainPage.css';
import '../styles/Shop.css';
import animdle_logo2 from '../img/animdle_logo2.png';
import register_logo from '../img/register_logo.png';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import setting from "../img/setting.png";

const Shop = (onBackgroundChange) => {
    const { isLoggedIn, setIsLoggedIn, currentPoints, currentNick, currentLevel } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isYourPointsOpen, setIsYourPointsOpen] = useState(false);
    const [selectedBackground, setSelectedBackground] = useState(null);

    const [isPanelVisible, setIsPanelVisible] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const handleYourPointsClick = () => {
        setIsYourPointsOpen(!isYourPointsOpen);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    const togglePanel = () => {
        setIsPanelVisible(!isPanelVisible);
    };

    const levelThresholds = [0, 0, 300, 700, 1200]; // Przykładowe progi punktów dla poziomów 0, 1, 2, 3, 4

    // Obliczanie procentowego postępu
    const currentThreshold = levelThresholds[currentLevel]; // Prog punktów dla aktualnego poziomu
    const nextThreshold = levelThresholds[currentLevel + 1]; // Prog punktów dla następnego poziomu
    const progress = (currentPoints - currentThreshold) / (nextThreshold - currentThreshold) * 100;

    const availableBackgrounds = [
        { levelRequired: 2, image: require('../img/meme1.jpg') },
        { levelRequired: 3, image: require('../img/meme2.jpg') },
    ];

    return (
        <div className="App">
            <div className="Background" />
            <Link to="/">
                <img src={animdle_logo2} className="Logo" alt="logo" />
            </Link>
            <div className="RulesButton">
                <img src={setting} className="" alt="Settings" onClick={togglePanel}/>
                {isPanelVisible && (
                    <div className="RulesPanel">
                        Level up to unlock exclusive items
                        <br/><br/>Enjoy ❤️
                    </div>
                )}
            </div>
            {isLoggedIn ? (
                <div>
                    <h2>Exclusive Content</h2>
                    <div className="BackgroundList">
                        {availableBackgrounds.map((background) => (
                            <div
                                key={background.image}
                                className={`BackgroundItem ${selectedBackground === background.image ? 'selected' : ''}`}
                                style={{
                                    backgroundImage: `url(${background.image})`,
                                }}
                            >
                                <div className="ImageSpacer" />
                                {selectedBackground === background.image && <span className="selectedBadge">Selected</span>}
                                {background.levelRequired > currentLevel && (
                                    <div className="Blocked" />
                                )}
                                {background.levelRequired > currentLevel && (
                                    <div className="DisplayLevelRequired">
                                        <span className="LevelRequired">Level Required: {background.levelRequired}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

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
                    <button onClick={handleLogout} className="Logout">Logout</button>
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

export default Shop;