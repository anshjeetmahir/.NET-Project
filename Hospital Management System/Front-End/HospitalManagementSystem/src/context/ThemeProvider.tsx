import React, { createContext, useState, useMemo, useContext } from "react";
import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { PaletteMode } from "@mui/material";
import { ThemeContextType } from "./types";



const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useThemeContext must be used within ThemeProvider");
    return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<PaletteMode>("light");

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode]
    );

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ toggleColorMode, mode }}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};
