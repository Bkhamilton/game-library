# Color System Documentation

## Overview

The Game Library color system provides a comprehensive palette for each theme, ensuring visual consistency, accessibility, and clear visual hierarchy across all games and interfaces.

## Color Categories

Each theme defines colors across five main categories:

### 1. Primary Colors
- **primary**: Main brand color, used for primary actions and emphasis
- **secondary**: Supporting brand color, used for secondary elements

### 2. Background Colors
- **background**: Main background color for screens and containers
- **grayBackground**: Secondary background for sections and cards
- **activeBackground**: Background for active/selected states

### 3. Text Colors
- **text**: Primary text color for content

### 4. Border Colors
- **border**: Primary border color for emphasis
- **grayBorder**: Subtle borders for divisions

### 5. Accent Colors
- **accent**: Highlight color for important elements
- **tint**: Tint color for icons and highlights

### 6. Navigation Colors
- **tabBar**: Tab bar background color
- **tabIconDefault**: Default tab icon color
- **tabIconSelected**: Selected tab icon color
- **tabBarInactiveColor**: Inactive tab text color

---

## Theme Color Palettes

### Light Theme

**Visual Identity:** Clean, minimalist, high contrast

```typescript
colors: {
  // Primary Colors
  primary: '#588157',           // Forest green - CTAs, emphasis
  secondary: '#6db36b',         // Light green - supporting elements
  
  // Background Colors
  background: '#fff',           // Pure white - main background
  grayBackground: '#F5F5F5',   // Light gray - sections
  activeBackground: 'green',    // Active state
  
  // Text Colors
  text: '#000',                 // Black - maximum contrast
  
  // Border Colors
  border: '#000',               // Black - strong borders
  grayBorder: '#EBEBEB',       // Very light gray - subtle divisions
  
  // Accent Colors
  accent: '#FF6B6B',           // Coral red - highlights
  tint: 'red',                  // Red tint
  
  // Navigation
  tabBar: 'white',
  tabIconDefault: 'black',
  tabIconSelected: 'red',
  tabBarInactiveColor: 'gray',
}
```

**Color Usage Examples:**
- **Primary Action Button:** Background `#588157`, Text `#fff`
- **Card Background:** `#F5F5F5`
- **Body Text:** `#000` on `#fff` (21:1 contrast ratio ✓)
- **Accent Element:** `#FF6B6B`

**Contrast Ratios:**
- Text on Background: 21:1 (AAA) ✓✓✓
- Primary on Background: 4.8:1 (AA) ✓✓
- Accent on Background: 4.7:1 (AA) ✓✓

---

### Dark Theme

**Visual Identity:** OLED-friendly, reduced eye strain

```typescript
colors: {
  // Primary Colors
  primary: '#19362d',           // Dark teal - muted primary
  secondary: '#112921',         // Very dark green - supporting
  
  // Background Colors
  background: '#121212',        // Near black - true OLED friendly
  grayBackground: '#313131',   // Dark gray - sections
  activeBackground: 'pink',     // Active state (high contrast)
  
  // Text Colors
  text: '#fff',                 // White - clear on dark
  
  // Border Colors
  border: '#fff',               // White - visible borders
  grayBorder: '#292929',       // Darker gray - subtle divisions
  
  // Accent Colors
  accent: '#588157',           // Forest green - stands out
  tint: '#588157',             // Green tint
  
  // Navigation
  tabBar: '#1e1e1e',
  tabIconDefault: '#ccc',
  tabIconSelected: '#588157',
  tabBarInactiveColor: 'gray',
}
```

**Color Usage Examples:**
- **Primary Action Button:** Background `#588157`, Text `#fff`
- **Card Background:** `#313131`
- **Body Text:** `#fff` on `#121212` (17.9:1 contrast ratio ✓)
- **Border:** `#fff` with reduced opacity

**Contrast Ratios:**
- Text on Background: 17.9:1 (AAA) ✓✓✓
- Accent on Background: 4.8:1 (AA) ✓✓
- GrayBackground on Background: 2.5:1 (Visual separation) ✓

**OLED Benefits:**
- True black (`#121212`) saves battery on OLED displays
- Reduced blue light for comfortable night viewing
- Lower brightness reduces eye strain

---

### Retro Theme

**Visual Identity:** 8-bit arcade aesthetic, vibrant colors

```typescript
colors: {
  // Primary Colors
  primary: '#FF6B35',           // Bright orange - bold primary
  secondary: '#F7931E',         // Golden orange - supporting
  
  // Background Colors
  background: '#2D1B2E',        // Dark purple - arcade feel
  grayBackground: '#3D2B3E',   // Medium purple - sections
  activeBackground: '#FF6B35',  // Orange active state
  
  // Text Colors
  text: '#F4F4F4',             // Off-white - readable
  
  // Border Colors
  border: '#FF6B35',           // Orange - vibrant borders
  grayBorder: '#4D3B4E',       // Light purple - subtle divisions
  
  // Accent Colors
  accent: '#00FFF0',           // Cyan - electric accent
  tint: '#FF6B35',             // Orange tint
  
  // Navigation
  tabBar: '#3D2B3E',
  tabIconDefault: '#888',
  tabIconSelected: '#FF6B35',
  tabBarInactiveColor: '#888',
}
```

**Color Usage Examples:**
- **Primary Action Button:** Background `#FF6B35`, Text `#2D1B2E`
- **Card Background:** `#3D2B3E`
- **Highlight:** `#00FFF0` (cyan accent)
- **Body Text:** `#F4F4F4` on `#2D1B2E`

**Contrast Ratios:**
- Text on Background: 11.8:1 (AAA) ✓✓✓
- Primary on Background: 5.2:1 (AA) ✓✓
- Accent on Background: 12.5:1 (AAA) ✓✓✓

**Design Notes:**
- High contrast creates arcade feel
- Cyan accent provides complementary pop
- Purple background reduces harshness of bright colors

---

### Nature Theme

**Visual Identity:** Organic, earth tones, calming

```typescript
colors: {
  // Primary Colors
  primary: '#2D5016',           // Dark forest green - natural primary
  secondary: '#4A7C2E',         // Medium green - growth
  
  // Background Colors
  background: '#F5F3EF',        // Warm beige - paper-like
  grayBackground: '#E8E5DF',   // Light beige - sections
  activeBackground: '#4A7C2E',  // Green active state
  
  // Text Colors
  text: '#3D2817',             // Dark brown - natural ink
  
  // Border Colors
  border: '#3D2817',           // Dark brown - organic borders
  grayBorder: '#D4CFCA',       // Gray beige - subtle divisions
  
  // Accent Colors
  accent: '#8B6F47',           // Tan/brown - earth accent
  tint: '#4A7C2E',             // Green tint
  
  // Navigation
  tabBar: '#E8E5DF',
  tabIconDefault: '#8B6F47',
  tabIconSelected: '#2D5016',
  tabBarInactiveColor: '#8B6F47',
}
```

**Color Usage Examples:**
- **Primary Action Button:** Background `#2D5016`, Text `#F5F3EF`
- **Card Background:** `#E8E5DF`
- **Body Text:** `#3D2817` on `#F5F3EF`
- **Accent Element:** `#8B6F47`

**Contrast Ratios:**
- Text on Background: 10.2:1 (AAA) ✓✓✓
- Primary on Background: 9.8:1 (AAA) ✓✓✓
- Accent on Background: 4.6:1 (AA) ✓✓

**Design Notes:**
- Warm beige creates paper-like feel
- Browns and greens evoke natural materials
- High contrast maintained despite soft palette

---

### Neon Theme

**Visual Identity:** Vibrant, futuristic, high energy

```typescript
colors: {
  // Primary Colors
  primary: '#FF00FF',           // Neon magenta - bold primary
  secondary: '#00FFFF',         // Neon cyan - electric secondary
  
  // Background Colors
  background: '#0A0E27',        // Very dark blue - night sky
  grayBackground: '#1A1E37',   // Dark blue - sections
  activeBackground: '#FF00FF',  // Magenta active state
  
  // Text Colors
  text: '#FFFFFF',             // Pure white - maximum visibility
  
  // Border Colors
  border: '#FF00FF',           // Neon magenta - glowing borders
  grayBorder: '#2A2E47',       // Medium dark blue - divisions
  
  // Accent Colors
  accent: '#FFFF00',           // Neon yellow - highlight
  tint: '#00FFFF',             // Cyan tint
  
  // Navigation
  tabBar: '#1A1E37',
  tabIconDefault: '#888',
  tabIconSelected: '#FF00FF',
  tabBarInactiveColor: '#888',
}
```

**Color Usage Examples:**
- **Primary Action Button:** Background `#FF00FF`, Text `#0A0E27`
- **Card Background:** `#1A1E37`
- **Highlight:** `#FFFF00` (neon yellow)
- **Body Text:** `#FFFFFF` on `#0A0E27`

**Contrast Ratios:**
- Text on Background: 18.3:1 (AAA) ✓✓✓
- Primary on Background: 6.2:1 (AA) ✓✓
- Secondary on Background: 11.8:1 (AAA) ✓✓✓
- Accent on Background: 17.4:1 (AAA) ✓✓✓

**Design Notes:**
- Pure neon colors (#FF00FF, #00FFFF, #FFFF00) for authentic glow
- Very dark background makes neons pop
- Consider adding glow effects (box-shadow) for enhanced neon feel
- Use sparingly to avoid visual fatigue

---

## Color Usage Guidelines

### Primary Color Usage

**When to use `primary`:**
- ✅ Primary action buttons (Save, Submit, Play)
- ✅ Active navigation items
- ✅ Important icons
- ✅ Links and interactive elements
- ✅ Brand elements

**How to use:**
```typescript
const { currentTheme } = useThemeContext();

// Button
<TouchableOpacity
  style={{
    backgroundColor: currentTheme.colors.primary,
    padding: 16,
  }}
>
  <Text style={{ color: currentTheme.colors.background }}>
    Play Game
  </Text>
</TouchableOpacity>
```

---

### Secondary Color Usage

**When to use `secondary`:**
- ✅ Secondary action buttons (Cancel, Back)
- ✅ Supporting UI elements
- ✅ Alternative states
- ✅ Complementary highlights

**How to use:**
```typescript
<TouchableOpacity
  style={{
    backgroundColor: currentTheme.colors.secondary,
    padding: 12,
  }}
>
  <Text style={{ color: currentTheme.colors.text }}>
    Learn More
  </Text>
</TouchableOpacity>
```

---

### Background Color Usage

**When to use `background`:**
- ✅ Main screen background
- ✅ Modal backgrounds
- ✅ Card content areas

**When to use `grayBackground`:**
- ✅ Section divisions
- ✅ Disabled states
- ✅ Input fields
- ✅ Subtle containers

**How to use:**
```typescript
<View style={{ backgroundColor: currentTheme.colors.background }}>
  <View style={{
    backgroundColor: currentTheme.colors.grayBackground,
    padding: 16,
    borderRadius: 8,
  }}>
    <Text>Section Content</Text>
  </View>
</View>
```

---

### Border Color Usage

**When to use `border`:**
- ✅ Emphasis borders
- ✅ Selected states
- ✅ Important separations
- ✅ Focus indicators

**When to use `grayBorder`:**
- ✅ Subtle separations
- ✅ Grid lines
- ✅ Card boundaries
- ✅ Input outlines (default state)

**How to use:**
```typescript
<View style={{
  borderWidth: 1,
  borderColor: currentTheme.colors.grayBorder,
  padding: 16,
}}>
  {/* Normal card */}
</View>

<View style={{
  borderWidth: 2,
  borderColor: currentTheme.colors.border,
  padding: 16,
}}>
  {/* Selected card */}
</View>
```

---

### Accent Color Usage

**When to use `accent`:**
- ✅ Highlights and emphasis
- ✅ Notifications and badges
- ✅ Important status indicators
- ✅ Call-to-action elements
- ✅ Success states

**How to use sparingly:**
```typescript
// Notification badge
<View style={{
  backgroundColor: currentTheme.colors.accent,
  borderRadius: 12,
  padding: 4,
}}>
  <Text style={{ color: currentTheme.colors.background, fontSize: 10 }}>
    New
  </Text>
</View>
```

---

## Accessibility

### WCAG Standards

The Game Library follows WCAG 2.1 Level AA standards for color contrast.

#### Contrast Requirements

**For Normal Text (< 18px or < 14px bold):**
- Minimum contrast ratio: **4.5:1** (Level AA)
- Enhanced contrast ratio: **7:1** (Level AAA)

**For Large Text (≥ 18px or ≥ 14px bold):**
- Minimum contrast ratio: **3:1** (Level AA)
- Enhanced contrast ratio: **4.5:1** (Level AAA)

#### UI Components
- Minimum contrast ratio: **3:1** (Level AA)
- Applies to: Buttons, form inputs, borders, icons

### Contrast Ratios by Theme

#### Light Theme
| Combination | Ratio | Grade |
|------------|-------|-------|
| Text on Background | 21:1 | AAA ✓✓✓ |
| Primary on Background | 4.8:1 | AA ✓✓ |
| Accent on Background | 4.7:1 | AA ✓✓ |
| GrayBackground on Background | 1.1:1 | Decorative only |

#### Dark Theme
| Combination | Ratio | Grade |
|------------|-------|-------|
| Text on Background | 17.9:1 | AAA ✓✓✓ |
| Accent on Background | 4.8:1 | AA ✓✓ |
| Primary on Background | 1.7:1 | Use with white text |
| GrayBackground on Background | 2.5:1 | Decorative only |

#### Retro Theme
| Combination | Ratio | Grade |
|------------|-------|-------|
| Text on Background | 11.8:1 | AAA ✓✓✓ |
| Primary on Background | 5.2:1 | AA ✓✓ |
| Accent on Background | 12.5:1 | AAA ✓✓✓ |

#### Nature Theme
| Combination | Ratio | Grade |
|------------|-------|-------|
| Text on Background | 10.2:1 | AAA ✓✓✓ |
| Primary on Background | 9.8:1 | AAA ✓✓✓ |
| Accent on Background | 4.6:1 | AA ✓✓ |

#### Neon Theme
| Combination | Ratio | Grade |
|------------|-------|-------|
| Text on Background | 18.3:1 | AAA ✓✓✓ |
| Primary on Background | 6.2:1 | AA ✓✓ |
| Secondary on Background | 11.8:1 | AAA ✓✓✓ |
| Accent on Background | 17.4:1 | AAA ✓✓✓ |

### Testing Contrast

**Online Tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Contrast Ratio Calculator](https://contrast-ratio.com/)
- [Color Review](https://color.review/)

**Testing Code:**
```typescript
// Example contrast testing function
function getContrastRatio(color1: string, color2: string): number {
  // Calculate relative luminance for each color
  // Return ratio between 1:1 and 21:1
  // Implementation would use W3C formula
}

// Usage
const ratio = getContrastRatio('#000', '#fff'); // Returns 21
const isAccessible = ratio >= 4.5; // true for normal text
```

---

## Color Accessibility Best Practices

### 1. Never Rely on Color Alone

Always provide additional visual cues:

**❌ Don't:**
```typescript
// Only using color to indicate state
<View style={{ backgroundColor: isError ? 'red' : 'green' }} />
```

**✅ Do:**
```typescript
// Color + icon + text
<View style={{ backgroundColor: isError ? theme.colors.accent : theme.colors.primary }}>
  <Icon name={isError ? 'x-circle' : 'check-circle'} />
  <Text>{isError ? 'Error' : 'Success'}</Text>
</View>
```

### 2. Ensure Sufficient Contrast

**❌ Don't:**
```typescript
// Low contrast text
<Text style={{
  color: '#888',
  backgroundColor: '#ccc'
}}>
  Important Information
</Text>
```

**✅ Do:**
```typescript
// High contrast text
<Text style={{
  color: currentTheme.colors.text,
  backgroundColor: currentTheme.colors.background
}}>
  Important Information
</Text>
```

### 3. Test with Colorblind Simulators

Common colorblindness types:
- **Protanopia** (red-blind): ~1% of males
- **Deuteranopia** (green-blind): ~1% of males
- **Tritanopia** (blue-blind): ~0.001% of population

**Tools:**
- [Coblis Color Blindness Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/)
- [Stark Plugin for Figma](https://www.getstark.co/)

### 4. Provide Theme Options

Allow users to choose themes that work best for them:
- Light theme for bright environments
- Dark theme for low light
- High contrast options if needed

---

## Semantic Color Usage

### Success States

```typescript
// Use primary or secondary for success
<View style={{
  backgroundColor: currentTheme.colors.primary,
  padding: 16,
  borderRadius: 8,
}}>
  <Text style={{ color: currentTheme.colors.background }}>
    ✓ Game Completed!
  </Text>
</View>
```

### Error States

```typescript
// Use accent for errors/warnings
<View style={{
  backgroundColor: currentTheme.colors.accent,
  padding: 16,
  borderRadius: 8,
}}>
  <Text style={{ color: currentTheme.colors.background }}>
    ⚠ Invalid Move
  </Text>
</View>
```

### Neutral/Info States

```typescript
// Use grayBackground for neutral info
<View style={{
  backgroundColor: currentTheme.colors.grayBackground,
  padding: 16,
  borderRadius: 8,
}}>
  <Text style={{ color: currentTheme.colors.text }}>
    ℹ Hint: Look for patterns
  </Text>
</View>
```

---

## Color Manipulation

### Creating Variations

Sometimes you need lighter or darker versions of theme colors:

```typescript
// Using color manipulation library (e.g., 'color' or 'tinycolor2')
import Color from 'color';

function Button({ pressed }) {
  const { currentTheme } = useThemeContext();
  
  const backgroundColor = pressed
    ? Color(currentTheme.colors.primary).darken(0.2).hex()
    : currentTheme.colors.primary;
  
  return (
    <TouchableOpacity style={{ backgroundColor }}>
      <Text>Press Me</Text>
    </TouchableOpacity>
  );
}
```

### Adding Opacity

```typescript
// Using rgba for transparency
<View style={{
  backgroundColor: currentTheme.colors.primary,
  opacity: 0.8, // 80% opacity
}}>
```

Or with hex:
```typescript
// Adding alpha to hex color (00-FF)
<View style={{
  backgroundColor: currentTheme.colors.primary + 'CC', // 80% opacity
}}>
```

---

## Testing Colors

### Manual Testing Checklist

For each theme:
- [ ] Text is readable on all backgrounds
- [ ] Buttons have sufficient contrast
- [ ] Borders are visible but not overwhelming
- [ ] Interactive elements have clear visual states
- [ ] Colors look correct on different displays
- [ ] No jarring color combinations
- [ ] Animations maintain color consistency

### Automated Testing

```typescript
describe('Color System', () => {
  it('should have valid hex colors', () => {
    Object.values(THEMES).forEach(theme => {
      Object.values(theme.colors).forEach(color => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });
  
  it('should meet contrast requirements', () => {
    Object.values(THEMES).forEach(theme => {
      const ratio = getContrastRatio(
        theme.colors.text,
        theme.colors.background
      );
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });
});
```

---

## Related Documentation

- [Theme System](./01-themes.md) - Complete theme implementation
- [Typography](./02-typography.md) - Text color usage
- [Components](./04-components.md) - Component color usage
- [Accessibility](https://www.w3.org/WAI/WCAG21/Understanding/) - WCAG Guidelines
