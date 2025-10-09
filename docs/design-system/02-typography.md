# Typography System Documentation

## Overview

The Game Library uses a hierarchical typography system designed for clarity, readability, and visual hierarchy across all games and interfaces. The system defines four distinct typography levels: Title, Header, Body, and Caption.

## Font Hierarchy

### Typography Levels

The typography system consists of four primary levels, each serving a specific purpose:

```typescript
const fonts = {
  title: {
    family: 'Poppins-Bold',
    size: 32,
    weight: 'bold',
  },
  header: {
    family: 'Poppins-SemiBold',
    size: 24,
    weight: '600',
  },
  body: {
    family: 'Inter-Regular',
    size: 16,
    weight: 'normal',
  },
  caption: {
    family: 'Inter-Light',
    size: 12,
    weight: '300',
  },
};
```

## Font Families

### Primary Fonts

#### 1. Poppins (Display Font)

**Purpose:** Headers, titles, and prominent UI elements

**Characteristics:**
- Geometric sans-serif
- Modern, friendly appearance
- Excellent readability at large sizes
- Strong visual hierarchy

**Weights Available:**
- **Poppins-Bold** (700): For titles and main headings
- **Poppins-SemiBold** (600): For section headers and subheadings
- **Poppins-Regular** (400): For less prominent headers (if needed)

**Best Used For:**
- Page titles
- Game names
- Section headings
- Button labels (when prominent)
- Achievement titles

#### 2. Inter (Body Font)

**Purpose:** Body text, UI labels, and general content

**Characteristics:**
- Optimized for screen display
- Excellent readability at small sizes
- Neutral, professional appearance
- Wide range of weights

**Weights Available:**
- **Inter-Regular** (400): Standard body text
- **Inter-Light** (300): Captions and supporting text
- **Inter-Medium** (500): Emphasized body text (if needed)

**Best Used For:**
- Paragraph text
- UI labels
- Button text
- Form inputs
- Descriptions
- Captions and metadata

#### 3. SpaceMono (Monospace Font)

**Purpose:** Code, numbers, timers, and scores

**Characteristics:**
- Fixed-width characters
- Clear distinction between characters
- Excellent for tabular data
- Retro computing aesthetic

**Implementation:**
```typescript
import { MonoText } from '@/components/StyledText';

<MonoText>12:34:56</MonoText>
```

**Best Used For:**
- Timers and countdowns
- Score displays
- High score tables
- Numeric data
- Code snippets
- Statistics

---

## Typography Scale

### 1. Title (32px)

**Specifications:**
```typescript
{
  fontFamily: 'Poppins-Bold',
  fontSize: 32,
  fontWeight: 'bold',
  lineHeight: 40,
  letterSpacing: -0.5,
}
```

**Usage:**
- Main page titles (e.g., "Sudoku", "Minesweeper")
- Welcome screens
- Major section headings
- Modal titles
- Game over screens

**Implementation Example:**
```typescript
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
});

<Text style={styles.title}>Welcome to Game Library</Text>
```

**Guidelines:**
- Use sparingly - typically one title per screen
- Always pair with theme text color
- Provide adequate spacing above and below (24-32px)
- Consider reducing size on smaller screens (28px for mobile)

---

### 2. Header (24px)

**Specifications:**
```typescript
{
  fontFamily: 'Poppins-SemiBold',
  fontSize: 24,
  fontWeight: '600',
  lineHeight: 32,
  letterSpacing: -0.3,
}
```

**Usage:**
- Section headings
- Card titles
- Dialog headings
- Tab labels (when prominent)
- Game mode titles

**Implementation Example:**
```typescript
const styles = StyleSheet.create({
  header: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
});

<Text style={styles.header}>Choose Difficulty</Text>
```

**Guidelines:**
- Use for clear content hierarchy
- Maintain consistent spacing (16-24px margins)
- Can be used multiple times per screen
- Consider responsive sizing (20-22px for small screens)

---

### 3. Body (16px)

**Specifications:**
```typescript
{
  fontFamily: 'Inter-Regular',
  fontSize: 16,
  fontWeight: 'normal',
  lineHeight: 24,
  letterSpacing: 0,
}
```

**Usage:**
- Paragraph text
- Button labels
- Form labels
- Menu items
- General UI text
- Instructions

**Implementation Example:**
```typescript
const styles = StyleSheet.create({
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
  },
});

<Text style={styles.body}>Select a cell to place a number</Text>
```

**Guidelines:**
- Default text size for most content
- Ensure 24px line height for comfortable reading
- Maximum line length: 60-75 characters
- Minimum contrast ratio: 4.5:1 with background

---

### 4. Caption (12px)

**Specifications:**
```typescript
{
  fontFamily: 'Inter-Light',
  fontSize: 12,
  fontWeight: '300',
  lineHeight: 16,
  letterSpacing: 0.2,
}
```

**Usage:**
- Timestamps
- Metadata
- Helper text
- Image captions
- Fine print
- Secondary information

**Implementation Example:**
```typescript
const styles = StyleSheet.create({
  caption: {
    fontFamily: 'Inter-Light',
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
});

<Text style={styles.caption}>Last played 2 hours ago</Text>
```

**Guidelines:**
- Use for non-essential information
- Ensure sufficient contrast (may need darker color)
- Don't use for critical information
- Consider 13-14px for accessibility if needed
- Use sparingly to avoid clutter

---

## Font Loading

### Current Implementation

Fonts are loaded via Expo's `useFonts` hook in the root layout:

```typescript
// app/_layout.tsx
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  
  // Handle loading and errors
  if (!loaded) {
    return null;
  }
  
  return <App />;
}
```

### Adding New Fonts

To add Poppins and Inter fonts:

1. **Download Fonts:**
   - Poppins: [Google Fonts](https://fonts.google.com/specimen/Poppins)
   - Inter: [Google Fonts](https://fonts.google.com/specimen/Inter)

2. **Place in Assets:**
   ```
   /assets/fonts/
   ├── Poppins-Bold.ttf
   ├── Poppins-SemiBold.ttf
   ├── Inter-Regular.ttf
   ├── Inter-Light.ttf
   └── SpaceMono-Regular.ttf
   ```

3. **Load Fonts:**
   ```typescript
   const [loaded, error] = useFonts({
     'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
     'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
     'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
     'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),
     'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
     ...FontAwesome.font,
   });
   ```

### Fallback Strategy

If custom fonts fail to load, the system falls back to platform defaults:

```typescript
const getFontFamily = (customFont: string, fallback: string) => {
  return Platform.select({
    ios: customFont || 'System',
    android: customFont || 'Roboto',
    default: customFont || 'sans-serif',
  });
};
```

**Example with Fallback:**
```typescript
const styles = StyleSheet.create({
  title: {
    fontFamily: Platform.select({
      ios: 'Poppins-Bold',
      android: 'Poppins-Bold',
      default: 'sans-serif',
    }),
    fontSize: 32,
  },
});
```

---

## Usage Guidelines

### When to Use Each Level

#### Title (32px)
- ✅ Main screen headers
- ✅ Welcome messages
- ✅ Game names on game screens
- ❌ Within paragraphs
- ❌ Repeated multiple times
- ❌ In small containers

#### Header (24px)
- ✅ Section divisions
- ✅ Card headers
- ✅ Modal titles
- ✅ Navigation labels
- ❌ Long text blocks
- ❌ Small UI elements

#### Body (16px)
- ✅ Default for most text
- ✅ Button labels
- ✅ Form inputs
- ✅ Instructions
- ✅ Paragraphs
- ❌ Large headers
- ❌ Tiny labels

#### Caption (12px)
- ✅ Timestamps
- ✅ Metadata
- ✅ Helper text
- ✅ Secondary info
- ❌ Primary content
- ❌ Critical information
- ❌ Long paragraphs

### Responsive Typography

For different screen sizes, scale fonts appropriately:

```typescript
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const isSmallScreen = screenWidth < 375;

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: isSmallScreen ? 28 : 32,
  },
  header: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: isSmallScreen ? 20 : 24,
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 16, // Keep body text at 16px for readability
  },
  caption: {
    fontFamily: 'Inter-Light',
    fontSize: 12,
  },
});
```

### Combining with Theme Colors

Always use typography with theme-aware colors:

```typescript
import { useThemeContext } from '@/contexts/ThemeContext';

function ThemedText() {
  const { currentTheme } = useThemeContext();
  
  const styles = StyleSheet.create({
    title: {
      fontFamily: 'Poppins-Bold',
      fontSize: 32,
      color: currentTheme.colors.text,
    },
    caption: {
      fontFamily: 'Inter-Light',
      fontSize: 12,
      color: currentTheme.colors.text,
      opacity: 0.7, // Slightly muted for captions
    },
  });
  
  return (
    <>
      <Text style={styles.title}>Game Title</Text>
      <Text style={styles.caption}>Started 5 minutes ago</Text>
    </>
  );
}
```

---

## Accessibility Considerations

### Font Size Minimums

- **Minimum readable size:** 12px (captions only)
- **Recommended minimum:** 16px for body text
- **Large text:** 18px+ qualifies for relaxed contrast requirements (3:1)

### Line Height

Proper line height improves readability:

- **Title (32px):** 40px (1.25x)
- **Header (24px):** 32px (1.33x)
- **Body (16px):** 24px (1.5x)
- **Caption (12px):** 16px (1.33x)

### Letter Spacing

Subtle letter spacing improves readability:

- **Large text (title, header):** Negative spacing (-0.3 to -0.5px) for tighter, more refined look
- **Body text:** 0px (default)
- **Small text (caption):** Positive spacing (+0.2px) for better legibility

### Text Contrast

Ensure sufficient contrast with backgrounds:

- **Regular text (< 18px):** Minimum 4.5:1 contrast ratio
- **Large text (≥ 18px):** Minimum 3:1 contrast ratio
- **Caption text:** May need darker color to maintain 4.5:1 ratio

---

## Typography Components

### Creating Reusable Text Components

```typescript
// components/Typography.tsx
import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';

interface ThemedTextProps extends TextProps {
  variant?: 'title' | 'header' | 'body' | 'caption';
}

export function ThemedText({ variant = 'body', style, ...props }: ThemedTextProps) {
  const { currentTheme } = useThemeContext();
  
  const variantStyles = {
    title: {
      fontFamily: 'Poppins-Bold',
      fontSize: 32,
      lineHeight: 40,
      fontWeight: 'bold' as const,
    },
    header: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600' as const,
    },
    body: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 'normal' as const,
    },
    caption: {
      fontFamily: 'Inter-Light',
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '300' as const,
    },
  };
  
  return (
    <Text
      style={[
        variantStyles[variant],
        { color: currentTheme.colors.text },
        style,
      ]}
      {...props}
    />
  );
}
```

**Usage:**
```typescript
<ThemedText variant="title">Welcome</ThemedText>
<ThemedText variant="header">Choose a Game</ThemedText>
<ThemedText variant="body">Select difficulty</ThemedText>
<ThemedText variant="caption">Last updated 5m ago</ThemedText>
```

---

## Game-Specific Typography

### Sudoku / Number Games

Use monospace fonts for numbers:

```typescript
const styles = StyleSheet.create({
  cellNumber: {
    fontFamily: 'SpaceMono',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timer: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
  },
});
```

### Word Games

Use clear, readable fonts:

```typescript
const styles = StyleSheet.create({
  gameLetter: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    textTransform: 'uppercase',
  },
  clueText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
});
```

### Action Games (Scores, Timers)

Large, bold text for quick readability:

```typescript
const styles = StyleSheet.create({
  score: {
    fontFamily: 'Poppins-Bold',
    fontSize: 48,
    letterSpacing: -1,
  },
  highScore: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
  },
});
```

---

## Best Practices

### Do's ✅

- Use the typography scale consistently
- Maintain proper hierarchy (title > header > body > caption)
- Ensure adequate line height for readability
- Test fonts with all theme colors
- Use monospace fonts for numbers and timers
- Keep line lengths between 60-75 characters
- Provide adequate spacing between text elements

### Don'ts ❌

- Don't use more than 3 font families in the app
- Don't use very small font sizes (< 12px) for important content
- Don't use all caps for long text (reduces readability)
- Don't use tight line-height (< 1.2x) for body text
- Don't mix too many font weights on one screen
- Don't use decorative fonts for body text
- Don't ignore accessibility contrast ratios

---

## Testing Typography

### Manual Testing Checklist

- [ ] All fonts load correctly on first launch
- [ ] Fonts display properly on iOS and Android
- [ ] Text is readable on all theme backgrounds
- [ ] Font sizes are appropriate for screen sizes
- [ ] Line heights provide comfortable reading
- [ ] Text doesn't overflow containers
- [ ] Monospace fonts align properly in tables
- [ ] Special characters display correctly

### Accessibility Testing

- [ ] Text meets minimum contrast ratios
- [ ] Font sizes are readable without zooming
- [ ] Text can be selected and copied (when appropriate)
- [ ] Screen readers pronounce text correctly
- [ ] Text remains readable with system font size adjustments

---

## Related Documentation

- [Theme System](./01-themes.md) - Theme color integration
- [Color System](./03-colors.md) - Text color and contrast guidelines
- [Components](./04-components.md) - Component-specific typography
