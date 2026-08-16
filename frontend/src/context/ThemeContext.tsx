import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    return savedTheme === "dark";
  });

  const toggleDarkMode = () => {
    setDarkMode((current) => {
      const newValue = !current;

      localStorage.setItem(
        "theme",
        newValue ? "dark" : "light"
      );

      return newValue;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",

          primary: {
            main: "#2e7d32",
          },

          background: {
            default: darkMode ? "#121212" : "#f5f7f5",
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
        },

        transitions: {
          duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
            complex: 375,
            enteringScreen: 225,
            leavingScreen: 195,
          },
        },

        typography: {
          fontFamily: "Inter, Roboto, Arial, sans-serif",
        },
      }),
    [darkMode]
  );

  const value = useMemo(
    () => ({
      darkMode,
      toggleDarkMode,
    }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useThemeMode must be used inside ThemeContextProvider"
    );
  }

  return context;
}