import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function useTheme() {
    const deviceColorScheme = useColorScheme();
    const { currentTheme, useDefaultPhoneMode } = useThemeContext();

    // If user has disabled default phone mode, use the custom theme
    // Otherwise, use the device's color scheme
    const colors = useDefaultPhoneMode 
        ? Colors[deviceColorScheme] 
        : currentTheme.colors;

    const themeColors = {
        text: colors.text,
        background: colors.background,
        tint: colors.tint,
        border: colors.border,
        grayBackground: colors.grayBackground,
        grayBorder: colors.grayBorder,
        primary: colors.primary,
        secondary: colors.secondary,
        tabBarInactiveColor: colors.tabBarInactiveColor,
        tabBar: colors.tabBar,
        tabIconDefault: colors.tabIconDefault,
        tabIconSelected: colors.tabIconSelected,
        activeBackground: colors.activeBackground,
    }

    return themeColors;
}