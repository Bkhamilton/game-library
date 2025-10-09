import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SQLiteProvider } from 'expo-sqlite';
import "react-native-reanimated";
import { initializeDatabase } from '@/api/startup'; 
import { DBContextProvider } from "@/contexts/DBContext";
import { UserContextProvider } from "@/contexts/UserContext";
import { ThemeProvider as CustomThemeProvider } from "@/contexts/ThemeContext";
import { useColorScheme } from "@/components/useColorScheme";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <SQLiteProvider databaseName="gamelibrary.db" onInit={initializeDatabase} useSuspense>
            <DBContextProvider>
                <UserContextProvider>
                    <CustomThemeProvider>
                        <RootLayoutNav />
                    </CustomThemeProvider>
                </UserContextProvider>
            </DBContextProvider>
        </SQLiteProvider>
    );
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: "modal", headerTitle: "Info" }} />
                <Stack.Screen
                    name="sudoku"
                    options={{ title: "Sudoku", headerBackTitle: "Home" }}
                />
                <Stack.Screen
                    name="ostrichhaul"
                    options={{ title: "Ostrich Haul", headerBackTitle: "Home" }}
                />
                <Stack.Screen
                    name="wordSearch"
                    options={{ title: "Word Search", headerBackTitle: "Home" }}
                />
                <Stack.Screen
                    name="crossword"
                    options={{ title: "Crossword", headerBackTitle: "Home" }}
                />
                <Stack.Screen
                    name="minesweeper"
                    options={{ title: "Minesweeper", headerBackTitle: "Home" }}
                />
                <Stack.Screen
                    name="gogobird"
                    options={{ title: "GoGoBird", headerBackTitle: "Home" }}
                />
                <Stack.Screen
                    name="2048"
                    options={{ title: "2048", headerBackTitle: "Home" }}
                />
                <Stack.Screen
                    name="memorymatch"
                    options={{ title: "Memory Match", headerBackTitle: "Home" }}
                />
                <Stack.Screen
                    name="simonsays"
                    options={{ title: "Simon Says", headerBackTitle: "Home" }}
                />
                <Stack.Screen
                    name="connectfour"
                    options={{ title: "Connect Four", headerBackTitle: "Home" }}
                />
                <Stack.Screen
                    name="animation-test"
                    options={{ title: "Animation Test", headerBackTitle: "Home" }}
                />
            </Stack>
        </ThemeProvider>
    );
}
