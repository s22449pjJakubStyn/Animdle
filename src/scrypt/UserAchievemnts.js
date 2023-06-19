import React, {useContext, useState, useEffect} from 'react';
import '../styles/App.css';
import '../styles/MainPage.css';
import animdle_logo2 from '../img/animdle_logo2.png';
import register_logo from '../img/register_logo.png';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { getDatabase, ref, onValue } from 'firebase/database';

const UserAchievemnts = () => {
    const { isLoggedIn, setIsLoggedIn,  currentUser, currentPoints } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isYourPointsOpen, setIsYourPointsOpen] = useState(false);
    const [achievements, setAchievements] = useState([]);

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
    return (
        <div className="App">
            <div className="Background" />
            <Link to="/">
                <img src={animdle_logo2} className="Logo" alt="logo" />
            </Link>
            {isLoggedIn ? (
                    <div>
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

export default UserAchievemnts;