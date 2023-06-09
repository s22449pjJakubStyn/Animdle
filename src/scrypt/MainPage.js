import React, {useContext, useRef, useState} from 'react';
import '../styles/App.css';
import '../styles/MainPage.css';
import animdle_logo2 from '../img/animdle_logo2.png';
import register_logo from '../img/register_logo.png';
import game_pannel2 from '../img/game_pannel2.png';
import game_pannel3 from '../img/game_pannel3.png';
import git from '../img/git.png';
import linked from '../img/linked.png';
import {Link} from 'react-router-dom';
import {AuthContext} from './AuthContext';
import setting from "../img/setting.png";

const MainPage = () => {
    const {isLoggedIn, setIsLoggedIn, currentPoints, currentNick, currentLevel} = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isYourPointsOpen, setIsYourPointsOpen] = useState(false);
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


    const levelThresholds = [0, 0, 300, 700, 1200]; // Przykładowe progi punktów dla poziomów 0, 1, 2, 3

    // Obliczanie procentowego postępu
    const currentThreshold = levelThresholds[currentLevel]; // Prog punktów dla aktualnego poziomu
    const nextThreshold = levelThresholds[currentLevel + 1]; // Prog punktów dla następnego poziomu
    const progress = (currentPoints - currentThreshold) / (nextThreshold - currentThreshold) * 100;

    return (
        <div className="App">
            <div className="Background"/>
            <Link to="/">
                <img src={animdle_logo2} className="Logo" alt="logo"/>
            </Link>
            <Link to="/classic">
                <div className="GamePannelContainer">
                    <img src={game_pannel2} className="GamePannel" alt="gamepannel2"/>
                    <div className="GamePannelText">Classic</div>
                    <div className="GamePannelDescription">Get clue on every try</div>
                </div>
            </Link>
            <Link to="/quote">
                <div className="GamePannelContainer">
                    <img src={game_pannel3} className="GamePannel" alt="gamepannel3"/>
                    <div className="GamePannelText">Quote</div>
                    <div className="GamePannelDescription">Guess with most popular anime quotes</div>
                </div>
            </Link>
            <div className="RulesButton">
                <img src={setting} className="" alt="Settings" onClick={togglePanel}/>
                {isPanelVisible && (
                    <div className="RulesPanel">
                        Please register and login to get these additions:
                        <br/>-Getting points
                        <br/>-Getting level progress
                        <br/>-Level progress allows you to unlock exclusive content
                        <br/>-You take part in the ranking of players
                        <br/>-You can unlock achievements that help your level progress
                        <br/><br/>Contact: animdle.help@gmail.com
                        <br/><br/>Enjoy ❤️
                    </div>
                )}
            </div>
<div className="SocialMediaContainer">
    <a href="https://github.com/s22449pjJakubStyn?tab=repositories" target="blank"> <img src={git} className="Social" alt="Github icon"/></a>
    <a href="https://www.linkedin.com/in/jakub-styn-9b8b3a20a/" target="blank">   <img src={linked} className="Social" alt="LinkedIn icon"/></a>
</div>
            <footer>
                Credits: Jakub Styn:CEO & Creator, Grzegorz Styn: Content Searcher and Content Maker
                <br/>
                Project for studies subject non-profit. Animdle©2023
            </footer>
            {isLoggedIn ? (
                <div>
                    <div className="LevelContainer">
                        <span className="ProgressTitle">Progress: {currentPoints} / {nextThreshold}</span>
                        <div className="BarLook">
                            <div className="BarProgress" style={{width: `${progress}%`}}/>
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
                            <Link to="/account">
                                <button className="MenuItem"> Account</button>
                            </Link>
                            <Link to="/ranking">
                                <button className="MenuItem"> Players Ranking</button>
                            </Link>
                            <Link to="/achievements">
                                <button className="MenuItem"> Your Achievements</button>
                            </Link>
                            <Link to="/shop">
                                <button className="MenuItem"> Shop</button>
                            </Link>
                        </div>
                    )}
                    <button onClick={handleLogout} className="Logout">Logout</button>
                </div>
            ) : (
                <div>
                    <Link to="/register">
                        <img src={register_logo} className="Register" alt="register_logo"/>
                    </Link>
                </div>
            )}
        </div>
);
};

export default MainPage;