import React from "react";

interface Theme {
    isDarkMode: boolean,
    setIsDarkMode?: React.Dispatch<React.SetStateAction<boolean>>
}

export const ThemeContext = React.createContext<Theme>({isDarkMode: false})