import React, {useContext, useState, useEffect} from 'react';
import '../styles/App.css';
import '../styles/MainPage.css';
import '../styles/PlayersRanking.css';
import animdle_logo2 from '../img/animdle_logo2.png';
import register_logo from '../img/register_logo.png';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { getDatabase, ref, orderByChild, onValue } from 'firebase/database';


const PlayersRanking = () => {
    const { isLoggedIn, setIsLoggedIn,  currentUser, currentPoints } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isYourPointsOpen, setIsYourPointsOpen] = useState(false);
    const [players, setPlayers] = useState([]);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const handleYourPointsClick = () => {
        setIsYourPointsOpen(!isYourPointsOpen);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const database = getDatabase();
        const usersRef = ref(database, 'users');

        // Pobierz dane użytkowników z bazy danych
        onValue(usersRef, (snapshot) => {
            const users = snapshot.val();

            // Konwertuj obiekt użytkowników na tablicę
            const playersArray = Object.keys(users).map((userId) => ({
                id: userId,
                nickName: users[userId].nickName,
                points: users[userId].points,
            }));

            // Posortuj graczy według liczby punktów w kolejności malejącej
            const sortedPlayers = playersArray.sort((a, b) => b.points - a.points);

            // Ustaw posortowaną listę graczy w stanie komponentu
            setPlayers(sortedPlayers.filter(player => player.id !== 'achievements'));
        });
    }, []);


    return (
        <div className="App">
            <div className="Background" />
            <Link to="/">
                <img src={animdle_logo2} className="Logo" alt="logo" />
            </Link>
            {isLoggedIn ? (
                <div>
                    <h2>Players Ranking</h2>
                    <div className="table-wrapper">
                        <table className="fl-table">
                            <thead>
                            <tr>
                                <th>Player Place</th>
                                <th>Player Nick</th>
                                <th>Points</th>
                            </tr>
                            </thead>
                            <tbody>
                            {players
                                .sort((a, b) => b.points - a.points)
                                .map((player, index) => (
                                    <tr key={player.id}>
                                        <td>{index + 1}</td>
                                        <td>{player.nickName}</td>
                                        <td>{player.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                                <Link to="/achievements"><button className="MenuItem"> Your Achievements</button></Link>
                            </div>
                        )}
                        <button onClick={handleLogout} className="Logout">Wyloguj się</button>
                    </div>
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

export default PlayersRanking;