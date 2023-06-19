import React, {useContext, useState} from 'react';
import '../styles/App.css';
import '../styles/MainPage.css';
import animdle_logo2 from '../img/animdle_logo2.png';
import register_logo from '../img/register_logo.png';
import game_pannel2 from '../img/game_pannel2.png';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const MainPage = () => {
    const { isLoggedIn, setIsLoggedIn,  currentUser, currentPoints } = useContext(AuthContext);
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
                    <button className="UserName" onClick={handleMenuClick}>
                        Ohayo {currentUser.email}
                    </button>
                    {isMenuOpen && (
                        <div className="Menu">
                            <button className="MenuItem" onClick={handleYourPointsClick}>
                                Your Points
                            </button>
                            {isYourPointsOpen && (
                                <div className="YourPoints">Points: {currentPoints}</div>
                            )}
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