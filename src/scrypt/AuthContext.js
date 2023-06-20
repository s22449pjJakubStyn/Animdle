import React, {createContext, useContext, useEffect, useState} from 'react';
import {get, getDatabase, ref, update} from "firebase/database";

// Utwórz kontekst
export const AuthContext = createContext();

// Utwórz dostawcę kontekstu
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPoints, setCurrentPoints] = useState(0);
    const [currentNick, setCurrentNick] = useState(null);
    const [currentName, setCurrentName] = useState(null);
    const [currentSurname, setCurrentSurname] = useState(null);
    const [currentPassword, setCurrentPassword] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(null);
    const handleSetCurrentPoints = (points) => {
        setCurrentPoints(points);
    };


    const handleSetCurrentUser = (user) => {
        setCurrentUser(user);
    };


    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser: handleSetCurrentUser, currentPoints,
            setCurrentPoints: handleSetCurrentPoints, currentNick, setCurrentNick, currentName, setCurrentName, currentSurname, setCurrentSurname, currentPassword, setCurrentPassword, currentLevel, setCurrentLevel}}>
            {children}
        </AuthContext.Provider>
    );
};

