import React, { createContext, useState } from 'react';

// Utwórz kontekst
export const AuthContext = createContext();

// Utwórz dostawcę kontekstu
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};
