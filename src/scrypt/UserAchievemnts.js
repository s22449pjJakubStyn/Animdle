import React, {useContext, useState, useEffect} from 'react';
import '../styles/App.css';
import '../styles/MainPage.css';
import animdle_logo2 from '../img/animdle_logo2.png';
import register_logo from '../img/register_logo.png';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { getDatabase, ref, onValue } from 'firebase/database';
import setting from "../img/setting.png";

const UserAchievemnts = () => {
    const { isLoggedIn, setIsLoggedIn,  currentUser, currentPoints, currentNick, currentLevel } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isYourPointsOpen, setIsYourPointsOpen] = useState(false);
    const [achievements, setAchievements] = useState([]);

    const [isPanelVisible, setIsPanelVisible] = useState(false);

    const levelThresholds = [0, 0, 300, 700, 1200]; // Przykładowe progi punktów dla poziomów 0, 1, 2, 3

    // Obliczanie procentowego postępu
    const currentThreshold = levelThresholds[currentLevel]; // Prog punktów dla aktualnego poziomu
    const nextThreshold = levelThresholds[currentLevel + 1]; // Prog punktów dla następnego poziomu
    const progress = (currentPoints - currentThreshold) / (nextThreshold - currentThreshold) * 100;

    useEffect(() => {
        const fetchAchievements = async () => {
            const database = getDatabase();
            const achievementsRef = ref(database, 'users/achievements');

            onValue(achievementsRef, (snapshot) => {
                const data = snapshot.val();
                const achievementsList = Object.entries(data || {}).map(([achievementKey, achievementData]) => ({
                    id: achievementKey,
                    ...achievementData,
                }));
                setAchievements(achievementsList);
            });
        };

        fetchAchievements();
    }, []);
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
                        Legend:
                        <br/><br/>⬛️ mean you haven't unlocked this achievement yet
                        <br/><br/>🟩 mean you have unlocked this achievement
                        <br/><br/>Enjoy ❤️
                    </div>
                )}
            </div>
            {isLoggedIn ? (
                    <div>
                        <div className="LevelContainer">
                            <span className="ProgressTitle">Progress: {currentPoints} / {nextThreshold}</span>
                            <div className="BarLook">
                                <div className="BarProgress" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                        <h2>User Achievements</h2>
                        <div className="table-wrapper">
                            <table className="fl-table">
                                <thead>
                                <tr>
                                    <th>Achievement Icon</th>
                                    <th>Achievement Name</th>
                                    <th>Achievement Description</th>
                                </tr>
                                </thead>
                                <tbody>
                                {achievements.map((achievement) => (
                                    <tr key={achievement.id} style={{ color: achievement.userUID?.includes(currentUser.uid) ? 'green' : 'gray' }}>
                                        <td>{achievement.icon}</td>
                                        <td>{achievement.name}</td>
                                        <td>{achievement.description}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
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
                            <Link to="/shop"><button className="MenuItem"> Shop</button></Link>
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

export default UserAchievemnts;