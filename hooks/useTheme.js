import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export default function useTheme() {
    const colorScheme = useColorScheme();

    const themeColors = {
        text: Colors[colorScheme].text,
        background: Colors[colorScheme].background,
        tint: Colors[colorScheme].tint,
        border: Colors[colorScheme].border,
        grayBackground: Colors[colorScheme].grayBackground,
        grayBorder: Colors[colorScheme].grayBorder,
        primary: Colors[colorScheme].primary,
        secondary: Colors[colorScheme].secondary,
        tabBarInactiveColor: Colors[colorScheme].tabBarInactiveColor,
    }

    return themeColors;
}