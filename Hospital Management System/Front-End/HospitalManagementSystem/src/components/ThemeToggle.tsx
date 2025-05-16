
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useThemeStore } from "../store/themeStore";

const ThemeToggle = ({ children }: { children: React.ReactNode }) => {
    const { darkMode, toggleTheme } = useThemeStore();

    const theme = createTheme({ palette: { mode: darkMode ? "dark" : "light" } });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <IconButton sx={{ position: "absolute", right: 20, top: 20 }} onClick={toggleTheme}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            {children}
        </ThemeProvider>
    );
};

export default ThemeToggle;

