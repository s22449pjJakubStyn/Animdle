import React, {useContext, useState} from 'react';
import '../styles/App.css';
import '../styles/MainPage.css';
import '../styles/UserAccount.css';
import animdle_logo2 from '../img/animdle_logo2.png';
import register_logo from '../img/register_logo.png';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { getAuth, deleteUser } from 'firebase/auth';
import {toast, ToastContainer} from "react-toastify";
import {getDatabase, ref, remove} from "firebase/database";

const UserAccount = () => {
    const { isLoggedIn, setIsLoggedIn,  setCurrentUser, currentUser, currentPoints, currentNick, currentName, currentSurname, currentPassword, currentLevel } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isYourPointsOpen, setIsYourPointsOpen] = useState(false);
    const [error, setError] = useState(null);

    const levelThresholds = [0, 0, 300, 700, 1200]; // Przykładowe progi punktów dla poziomów 0, 1, 2, 3

    // Obliczanie procentowego postępu
    const currentThreshold = levelThresholds[currentLevel]; // Prog punktów dla aktualnego poziomu
    const nextThreshold = levelThresholds[currentLevel + 1]; // Prog punktów dla następnego poziomu
    const progress = (currentPoints - currentThreshold) / (nextThreshold - currentThreshold) * 100;
    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const handleYourPointsClick = () => {
        setIsYourPointsOpen(!isYourPointsOpen);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    const handleDeleteAccount = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const currentUserUID = user.uid;
            const database = getDatabase();
            const userRef = ref(database, `users/${currentUserUID}`);

            if (window.confirm('Czy na pewno chcesz usunąć swoje konto?')) {  // Usuwanie konta użytkownika z Firebase Authentication
                deleteUser(user)
                    .then(() => {
                        setIsLoggedIn(false);
                        remove(userRef)
                            .then(() => {
                                setIsLoggedIn(false);
                                toast.success("Poprawnie usunięto konto");
                            })
                            .catch((error) => {
                                // Wystąpił błąd podczas usuwania konta użytkownika z bazy danych
                                console.error(error);
                            });
                    })
                    .catch((error) => {
                        // Wystąpił błąd podczas usuwania konta użytkownika z Firebase Authentication
                        console.error(error);
                    });
            }
        }
    };

    return (
        <div className="App">
            <div className="Background" />
            <Link to="/">
                <img src={animdle_logo2} className="Logo" alt="logo" />
            </Link>
            {isLoggedIn ? (
                <div>
                    <div className="LevelContainer">
                        <span className="ProgressTitle">Progress: {currentPoints} / {nextThreshold}</span>
                        <div className="BarLook">
                            <div className="BarProgress" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                    <h2>User Account</h2>
                    {currentUser && (
                        <div className="table-wrapper">
                            <table className="fl-table">
                                <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Password</th>
                                    <th>Name</th>
                                    <th>Surname</th>
                                    <th>Nickname</th>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{currentUser.email}</td>
                                        <td>{currentPassword}</td>
                                        <td>{currentName}</td>
                                        <td>{currentSurname}</td>
                                        <td>{currentNick}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="DeleteButtonDiv">
                    <button onClick={handleDeleteAccount} className="DeleteButton">Delete Account</button>
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
                            <Link to="/ranking"><button className="MenuItem"> Players Ranking</button></Link>
                            <Link to="/achievements"><button className="MenuItem"> Your Achievements</button></Link>
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
            <ToastContainer/>
        </div>
    );
};

export default UserAccount;