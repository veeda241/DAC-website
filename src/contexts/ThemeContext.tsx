import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => {},
    isDark: true,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    // Only dark mode is supported now
    const theme: Theme = 'dark';

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
    }, []);

    const toggleTheme = () => {
        // No-op: light mode removed
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: true }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
