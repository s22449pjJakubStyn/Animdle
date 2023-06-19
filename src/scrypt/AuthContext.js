import React, {createContext, useContext, useState} from 'react';

// Utwórz kontekst
export const AuthContext = createContext();

// Utwórz dostawcę kontekstu
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPoints, setCurrentPoints] = useState(0);

    const handleSetCurrentPoints = (points) => {
        setCurrentPoints(points);
    };



    const handleSetCurrentUser = (user) => {
        setCurrentUser(user);
    };


    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser: handleSetCurrentUser, currentPoints,
            setCurrentPoints: handleSetCurrentPoints}}>
            {children}
        </AuthContext.Provider>
    );
};

