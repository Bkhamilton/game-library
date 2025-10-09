# Theme System Documentation

## Overview

The Game Library features a comprehensive theme system that allows users to customize the visual appearance of all games. The theme system is built on a flexible architecture that supports multiple color schemes while maintaining consistency and accessibility.

## GameTheme Interface

The theme system is built around the `GameTheme` interface, which defines the structure for all themes:

```typescript
interface GameTheme {
  id: string;              // Unique identifier for the theme
  name: string;            // Display name for the theme
  colors: {
    primary: string;       // Primary brand color
    secondary: string;     // Secondary brand color
    background: string;    // Main background color
    text: string;          // Primary text color
    accent: string;        // Accent/highlight color
    grayBackground: string;// Secondary background color
    grayBorder: string;    // Border color for subtle divisions
    border: string;        // Primary border color
    tint: string;          // Tint color for icons/highlights
    tabIconDefault: string;// Default tab bar icon color
    tabIconSelected: string;// Selected tab bar icon color
    tabBar: string;        // Tab bar background color
    activeBackground: string;// Active state background
    tabBarInactiveColor: string;// Inactive tab bar text color
  };
}
```

**File Location:** `/constants/Themes.ts`

## Available Themes

The system includes 5 pre-defined themes, each with a distinct visual identity:

### 1. Light Theme (Default)

**Purpose:** Clean, minimalist design with high contrast for readability. Ideal for well-lit environments.

**Visual Characteristics:**
- Bright white background (#fff)
- Dark text for maximum contrast (#000)
- Green-based primary colors for a fresh, natural feel
- Soft gray backgrounds for subtle sections

**Color Palette:**
```typescript
{
  primary: '#588157',           // Forest green
  secondary: '#6db36b',         // Light green
  background: '#fff',           // Pure white
  text: '#000',                 // Black
  accent: '#FF6B6B',           // Coral red
  grayBackground: '#F5F5F5',   // Light gray
  grayBorder: '#EBEBEB',       // Very light gray
  border: '#000',              // Black
  tint: 'red',
  tabIconDefault: 'black',
  tabIconSelected: 'red',
  tabBar: 'white',
  activeBackground: 'green',
  tabBarInactiveColor: 'gray',
}
```

**Best Used For:**
- Default experience
- High readability scenarios
- Users who prefer light interfaces
- Daytime usage

---

### 2. Dark Theme

**Purpose:** OLED-friendly dark design that reduces eye strain in low-light environments.

**Visual Characteristics:**
- Near-black background (#121212)
- Light text on dark backgrounds
- Muted green color scheme
- Reduced brightness for comfortable viewing

**Color Palette:**
```typescript
{
  primary: '#19362d',           // Dark teal
  secondary: '#112921',         // Very dark green
  background: '#121212',        // Near black
  text: '#fff',                 // White
  accent: '#588157',           // Forest green
  grayBackground: '#313131',   // Dark gray
  grayBorder: '#292929',       // Darker gray
  border: '#fff',              // White
  tint: '#588157',
  tabIconDefault: '#ccc',
  tabIconSelected: '#588157',
  tabBar: '#1e1e1e',
  activeBackground: 'pink',
  tabBarInactiveColor: 'gray',
}
```

**Best Used For:**
- OLED displays (battery saving)
- Low-light environments
- Night-time usage
- Reducing eye strain

---

### 3. Retro Theme

**Purpose:** 8-bit pixel art aesthetic with vibrant colors reminiscent of classic arcade games.

**Visual Characteristics:**
- Purple-based dark background
- Orange and cyan accent colors
- High contrast for visibility
- Nostalgic gaming feel

**Color Palette:**
```typescript
{
  primary: '#FF6B35',           // Bright orange
  secondary: '#F7931E',         // Golden orange
  background: '#2D1B2E',        // Dark purple
  text: '#F4F4F4',             // Off-white
  accent: '#00FFF0',           // Cyan
  grayBackground: '#3D2B3E',   // Medium purple
  grayBorder: '#4D3B4E',       // Light purple
  border: '#FF6B35',           // Orange
  tint: '#FF6B35',
  tabIconDefault: '#888',
  tabIconSelected: '#FF6B35',
  tabBar: '#3D2B3E',
  activeBackground: '#FF6B35',
  tabBarInactiveColor: '#888',
}
```

**Best Used For:**
- Retro gaming enthusiasts
- Arcade-style games
- Users who prefer vibrant colors
- Nostalgic aesthetic

**Design Notes:**
- Pairs well with pixel art graphics
- Consider adding CRT screen effects
- Use chiptune sound effects for full retro experience

---

### 4. Nature Theme

**Purpose:** Organic, earth-toned design inspired by natural elements.

**Visual Characteristics:**
- Warm beige background
- Green and brown color scheme
- Soft, natural tones
- Calming, organic feel

**Color Palette:**
```typescript
{
  primary: '#2D5016',           // Dark forest green
  secondary: '#4A7C2E',         // Medium green
  background: '#F5F3EF',        // Warm beige
  text: '#3D2817',             // Dark brown
  accent: '#8B6F47',           // Tan/brown
  grayBackground: '#E8E5DF',   // Light beige
  grayBorder: '#D4CFCA',       // Gray beige
  border: '#3D2817',           // Dark brown
  tint: '#4A7C2E',
  tabIconDefault: '#8B6F47',
  tabIconSelected: '#2D5016',
  tabBar: '#E8E5DF',
  activeBackground: '#4A7C2E',
  tabBarInactiveColor: '#8B6F47',
}
```

**Best Used For:**
- Calming, relaxed gaming
- Puzzle games
- Users who prefer natural aesthetics
- Reducing visual fatigue

**Design Notes:**
- Pairs well with wood textures
- Consider leaf and organic patterns
- Use natural sound effects

---

### 5. Neon Theme

**Purpose:** Vibrant, high-energy design with glowing neon colors and synthwave aesthetics.

**Visual Characteristics:**
- Very dark blue/purple background
- Bright neon pink, cyan, and yellow
- High contrast for dramatic effect
- Futuristic, energetic feel

**Color Palette:**
```typescript
{
  primary: '#FF00FF',           // Neon magenta
  secondary: '#00FFFF',         // Neon cyan
  background: '#0A0E27',        // Very dark blue
  text: '#FFFFFF',             // Pure white
  accent: '#FFFF00',           // Neon yellow
  grayBackground: '#1A1E37',   // Dark blue
  grayBorder: '#2A2E47',       // Medium dark blue
  border: '#FF00FF',           // Neon magenta
  tint: '#00FFFF',
  tabIconDefault: '#888',
  tabIconSelected: '#FF00FF',
  tabBar: '#1A1E37',
  activeBackground: '#FF00FF',
  tabBarInactiveColor: '#888',
}
```

**Best Used For:**
- High-energy action games
- Modern, futuristic aesthetic
- Users who prefer bold visuals
- Nighttime gaming with impact

**Design Notes:**
- Add glow effects to maximize impact
- Pairs well with synthwave music
- Consider neon tube-like borders
- Use sparingly to avoid visual fatigue

---

## ThemeContext Implementation

### Context Structure

The theme system uses React Context for global state management:

```typescript
interface ThemeContextType {
  currentTheme: GameTheme;           // Currently active theme
  themeId: string;                   // ID of current theme
  setTheme: (themeId: string) => void; // Function to change theme
  availableThemes: GameTheme[];      // Array of all available themes
  useDefaultPhoneMode: boolean;      // Phone mode preference
  setUseDefaultPhoneMode: (value: boolean) => void;
}
```

**File Location:** `/contexts/ThemeContext.tsx`

### Using the Theme Context

#### Basic Usage

```typescript
import { useThemeContext } from '@/contexts/ThemeContext';

function MyComponent() {
  const { currentTheme, themeId, setTheme } = useThemeContext();
  
  return (
    <View style={{ backgroundColor: currentTheme.colors.background }}>
      <Text style={{ color: currentTheme.colors.text }}>
        Current theme: {currentTheme.name}
      </Text>
    </View>
  );
}
```

#### Changing Themes

```typescript
function ThemeSelector() {
  const { setTheme, availableThemes } = useThemeContext();
  
  return (
    <View>
      {availableThemes.map(theme => (
        <Button
          key={theme.id}
          title={theme.name}
          onPress={() => setTheme(theme.id)}
        />
      ))}
    </View>
  );
}
```

#### Accessing Specific Colors

```typescript
function GameBoard() {
  const { currentTheme } = useThemeContext();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: currentTheme.colors.background,
      borderColor: currentTheme.colors.border,
      borderWidth: 1,
    },
    cell: {
      backgroundColor: currentTheme.colors.grayBackground,
    },
    activeCell: {
      backgroundColor: currentTheme.colors.activeBackground,
    },
    text: {
      color: currentTheme.colors.text,
    },
  });
  
  return (
    <View style={styles.container}>
      {/* Game content */}
    </View>
  );
}
```

## Adding New Themes

To add a new theme to the system:

### Step 1: Define the Theme

Add the new theme to the `THEMES` object in `/constants/Themes.ts`:

```typescript
export const THEMES: Record<string, GameTheme> = {
  // ... existing themes
  
  myNewTheme: {
    id: 'myNewTheme',
    name: 'My New Theme',
    colors: {
      primary: '#000000',
      secondary: '#111111',
      background: '#ffffff',
      text: '#000000',
      accent: '#ff0000',
      grayBackground: '#f0f0f0',
      grayBorder: '#e0e0e0',
      border: '#000000',
      tint: '#ff0000',
      tabIconDefault: '#666666',
      tabIconSelected: '#ff0000',
      tabBar: '#ffffff',
      activeBackground: '#ff0000',
      tabBarInactiveColor: '#999999',
    },
  },
};
```

### Step 2: Test the Theme

1. Ensure all color properties are defined
2. Test contrast ratios for accessibility (minimum 4.5:1 for text)
3. Test on both light and dark system modes
4. Verify appearance across all games
5. Check tab bar and navigation elements

### Step 3: Document the Theme

Add documentation for your new theme in this file, including:
- Purpose and visual characteristics
- Color palette with hex values
- Best use cases
- Design notes and considerations

## Theme Best Practices

### 1. Consistency

- Use `primary` for main brand elements and CTAs
- Use `secondary` for supporting elements
- Use `accent` sparingly for highlights and important actions
- Use `grayBackground` for subtle sections and disabled states
- Use `grayBorder` for subtle divisions between elements

### 2. Accessibility

- Ensure text/background combinations meet WCAG AA standards (4.5:1 contrast)
- Large text (18pt+) can use 3:1 contrast ratio
- Test all themes with colorblind simulators
- Provide sufficient contrast for borders and interactive elements

### 3. Component Usage

Always access colors through the theme context rather than hardcoding:

**❌ Don't do this:**
```typescript
<View style={{ backgroundColor: '#588157' }}>
```

**✅ Do this:**
```typescript
const { currentTheme } = useThemeContext();
<View style={{ backgroundColor: currentTheme.colors.primary }}>
```

### 4. Dynamic Styling

For components that need to respond to theme changes, use hooks or create dynamic styles:

```typescript
function ThemedButton({ title, onPress }) {
  const { currentTheme } = useThemeContext();
  
  const buttonStyle = {
    backgroundColor: currentTheme.colors.primary,
    borderColor: currentTheme.colors.border,
  };
  
  const textStyle = {
    color: currentTheme.colors.background, // Inverted for button
  };
  
  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}
```

## Theme Persistence

Currently, themes are stored in component state. For persistence across app restarts:

### Future Implementation (Database Storage)

```typescript
// Save theme preference
const saveThemePreference = async (userId: number, themeId: string) => {
  await db.execAsync(
    'INSERT OR REPLACE INTO UserPreferences (userId, themeId) VALUES (?, ?)',
    [userId, themeId]
  );
};

// Load theme preference
const loadThemePreference = async (userId: number) => {
  const result = await db.getFirstAsync(
    'SELECT themeId FROM UserPreferences WHERE userId = ?',
    [userId]
  );
  return result?.themeId || 'light';
};
```

## Testing Themes

### Manual Testing Checklist

When implementing or modifying themes:

- [ ] All text is readable against backgrounds
- [ ] Interactive elements have clear visual states
- [ ] Borders are visible but not overwhelming
- [ ] Icons are clearly visible in both selected and unselected states
- [ ] Tab bar is functional and visually clear
- [ ] Game-specific elements work with the theme
- [ ] Animations and transitions look smooth
- [ ] No hardcoded colors remain in components

### Automated Testing

```typescript
describe('Theme System', () => {
  it('should provide all required color properties', () => {
    Object.values(THEMES).forEach(theme => {
      expect(theme.colors.primary).toBeDefined();
      expect(theme.colors.secondary).toBeDefined();
      expect(theme.colors.background).toBeDefined();
      expect(theme.colors.text).toBeDefined();
      // ... test all required properties
    });
  });
  
  it('should have unique IDs', () => {
    const ids = Object.values(THEMES).map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

## Advanced Usage

### Theme Variants

For components that need slight color variations:

```typescript
function getDarkerShade(color: string, amount: number = 0.2): string {
  // Implementation to darken a color
  // Use color manipulation library like 'color' or 'tinycolor2'
}

function Button() {
  const { currentTheme } = useThemeContext();
  const pressedColor = getDarkerShade(currentTheme.colors.primary);
  
  return (
    <TouchableOpacity
      style={[
        { backgroundColor: currentTheme.colors.primary },
        pressed && { backgroundColor: pressedColor }
      ]}
    />
  );
}
```

### Conditional Theme Logic

```typescript
function GameCell() {
  const { currentTheme, themeId } = useThemeContext();
  
  // Apply special effects for certain themes
  const shouldGlow = themeId === 'neon';
  
  return (
    <View
      style={{
        backgroundColor: currentTheme.colors.grayBackground,
        shadowColor: shouldGlow ? currentTheme.colors.primary : 'transparent',
        shadowOpacity: shouldGlow ? 0.8 : 0,
        shadowRadius: shouldGlow ? 10 : 0,
      }}
    />
  );
}
```

## Related Documentation

- [Color System](./03-colors.md) - Detailed color usage guidelines
- [Components](./04-components.md) - Themed component specifications
- [Accessibility](./03-colors.md#accessibility) - Color contrast and accessibility standards
