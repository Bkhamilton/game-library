export interface GameTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    grayBackground: string;
    grayBorder: string;
    border: string;
    tint: string;
    tabIconDefault: string;
    tabIconSelected: string;
    tabBar: string;
    activeBackground: string;
    tabBarInactiveColor: string;
  };
}

export const THEMES: Record<string, GameTheme> = {
  light: {
    id: 'light',
    name: 'Light',
    colors: {
      primary: '#588157',
      secondary: '#6db36b',
      background: '#fff',
      text: '#000',
      accent: '#FF6B6B',
      grayBackground: '#F5F5F5',
      grayBorder: '#EBEBEB',
      border: '#000',
      tint: 'red',
      tabIconDefault: 'black',
      tabIconSelected: 'red',
      tabBar: 'gray',
      activeBackground: 'green',
      tabBarInactiveColor: 'gray',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    colors: {
      primary: '#19362d',
      secondary: '#112921',
      background: '#121212',
      text: '#fff',
      accent: '#588157',
      grayBackground: '#313131',
      grayBorder: '#292929',
      border: '#fff',
      tint: '#588157',
      tabIconDefault: '#ccc',
      tabIconSelected: '#588157',
      tabBar: 'white',
      activeBackground: 'pink',
      tabBarInactiveColor: 'gray',
    },
  },
  retro: {
    id: 'retro',
    name: 'Retro',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      background: '#2D1B2E',
      text: '#F4F4F4',
      accent: '#00FFF0',
      grayBackground: '#3D2B3E',
      grayBorder: '#4D3B4E',
      border: '#FF6B35',
      tint: '#FF6B35',
      tabIconDefault: '#888',
      tabIconSelected: '#FF6B35',
      tabBar: '#F4F4F4',
      activeBackground: '#FF6B35',
      tabBarInactiveColor: '#888',
    },
  },
  nature: {
    id: 'nature',
    name: 'Nature',
    colors: {
      primary: '#2D5016',
      secondary: '#4A7C2E',
      background: '#F5F3EF',
      text: '#3D2817',
      accent: '#8B6F47',
      grayBackground: '#E8E5DF',
      grayBorder: '#D4CFCA',
      border: '#3D2817',
      tint: '#4A7C2E',
      tabIconDefault: '#8B6F47',
      tabIconSelected: '#2D5016',
      tabBar: '#3D2817',
      activeBackground: '#4A7C2E',
      tabBarInactiveColor: '#8B6F47',
    },
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    colors: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      background: '#0A0E27',
      text: '#FFFFFF',
      accent: '#FFFF00',
      grayBackground: '#1A1E37',
      grayBorder: '#2A2E47',
      border: '#FF00FF',
      tint: '#00FFFF',
      tabIconDefault: '#888',
      tabIconSelected: '#FF00FF',
      tabBar: '#FFFFFF',
      activeBackground: '#FF00FF',
      tabBarInactiveColor: '#888',
    },
  },
};

export const THEME_IDS = Object.keys(THEMES);
