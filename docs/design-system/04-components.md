# Component Design Guidelines

## Overview

This document provides comprehensive design specifications for UI components used across the Game Library. All components should be theme-aware, accessible, and consistent in their implementation.

---

## Buttons

### Button Anatomy

Buttons consist of:
- Container (with background, borders, padding)
- Label (text or icon)
- Visual states (default, hover, pressed, disabled)

### Button Variants

#### 1. Primary Button

**Purpose:** Main call-to-action buttons

**Specifications:**
```typescript
const primaryButtonStyles = {
  container: {
    backgroundColor: currentTheme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: currentTheme.colors.background,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    fontWeight: '600',
  },
};
```

**States:**

**Default:**
- Background: `primary` color
- Text: Contrasting color (usually `background`)
- Border: None or 2px solid `primary`
- Shadow: Small elevation (2-4px)

**Pressed:**
- Background: Darken `primary` by 20%
- Scale: 0.98 (subtle scale down)
- Shadow: Reduced elevation (0-2px)

**Disabled:**
- Background: `grayBackground`
- Text: `grayBorder` or muted text
- Opacity: 0.5
- No interaction

**Implementation:**
```typescript
function PrimaryButton({ title, onPress, disabled = false }) {
  const { currentTheme } = useThemeContext();
  const [pressed, setPressed] = useState(false);
  
  return (
    <TouchableOpacity
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: disabled 
          ? currentTheme.colors.grayBackground
          : pressed
          ? Color(currentTheme.colors.primary).darken(0.2).hex()
          : currentTheme.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        opacity: disabled ? 0.5 : 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: pressed ? 1 : 2 },
        shadowOpacity: 0.2,
        shadowRadius: pressed ? 2 : 4,
        elevation: pressed ? 2 : 4,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      }}
    >
      <Text style={{
        color: currentTheme.colors.background,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
```

---

#### 2. Secondary Button

**Purpose:** Secondary actions, less emphasis

**Specifications:**
```typescript
const secondaryButtonStyles = {
  container: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: currentTheme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
    minWidth: 120,
  },
  text: {
    color: currentTheme.colors.primary,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
};
```

**States:**

**Default:**
- Background: Transparent
- Border: 2px solid `primary`
- Text: `primary` color

**Pressed:**
- Background: `primary` with 10% opacity
- Border: 2px solid darker `primary`

**Disabled:**
- Border: `grayBorder`
- Text: `grayBorder`
- Opacity: 0.5

---

#### 3. Text Button

**Purpose:** Tertiary actions, minimal emphasis

**Specifications:**
```typescript
const textButtonStyles = {
  container: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    color: currentTheme.colors.primary,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
};
```

**States:**

**Default:**
- No background
- No border
- Text: `primary` color

**Pressed:**
- Text: Darker `primary`
- Underline (optional)

---

#### 4. Icon Button

**Purpose:** Actions represented by icons

**Specifications:**
```typescript
const iconButtonStyles = {
  container: {
    backgroundColor: currentTheme.colors.grayBackground,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    size: 24,
    color: currentTheme.colors.text,
  },
};
```

**States:**

**Default:**
- Background: `grayBackground`
- Icon: `text` color
- Size: 44x44px (touch target)

**Pressed:**
- Background: Darker `grayBackground`
- Scale: 0.95

---

### Button Design Guidelines

**Do's ✅**
- Use consistent padding (12px vertical, 24px horizontal)
- Ensure minimum touch target size (44x44px)
- Provide clear visual feedback for all states
- Use appropriate button type for action importance
- Include loading states for async actions

**Don'ts ❌**
- Don't use too many primary buttons on one screen
- Don't make buttons too small (< 44px height)
- Don't use vague labels ("Click Here", "Submit")
- Don't remove visual feedback on interaction
- Don't disable buttons without explanation

---

## Cards

### Card Anatomy

Cards are containers for related content and actions.

**Components:**
- Container with background and borders
- Optional header with title
- Content area
- Optional footer with actions

### Card Variants

#### 1. Basic Card

**Specifications:**
```typescript
const cardStyles = {
  container: {
    backgroundColor: currentTheme.colors.grayBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
};
```

**Design Properties:**
- Background: `grayBackground`
- Border Radius: 12px
- Padding: 16px
- Shadow: Small elevation (2-4px)
- Border: None or 1px `grayBorder`

---

#### 2. Elevated Card

**Purpose:** More prominent cards, interactive elements

**Specifications:**
```typescript
const elevatedCardStyles = {
  container: {
    backgroundColor: currentTheme.colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
```

**Design Properties:**
- Background: `background` (main background color)
- Shadow: Medium elevation (4-8px)
- More prominent separation from background

---

#### 3. Outlined Card

**Purpose:** Subtle card style with emphasis on borders

**Specifications:**
```typescript
const outlinedCardStyles = {
  container: {
    backgroundColor: currentTheme.colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: currentTheme.colors.grayBorder,
  },
};
```

**Design Properties:**
- Background: `background`
- Border: 1px solid `grayBorder`
- No shadow
- Lighter visual weight

---

### Card States

**Default:**
- Standard elevation and colors

**Hover (if interactive):**
- Increase shadow slightly
- Subtle scale (1.02)

**Pressed (if interactive):**
- Reduce shadow
- Scale down (0.98)

**Selected:**
- Border: 2px solid `primary`
- Optional background tint

---

### Card Design Guidelines

**Do's ✅**
- Use consistent border radius (12px)
- Maintain adequate padding (16px minimum)
- Group related content in cards
- Use elevation to indicate hierarchy
- Keep card content organized and scannable

**Don'ts ❌**
- Don't overcrowd cards with too much content
- Don't use too many different card styles
- Don't nest cards deeply (max 1-2 levels)
- Don't make cards too wide (max 600px)

---

## Input Fields

### Input Field Anatomy

Input fields consist of:
- Container with background and border
- Label (optional)
- Input element
- Helper text or error message (optional)
- Icon (optional)

### Input Variants

#### 1. Text Input

**Specifications:**
```typescript
const textInputStyles = {
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: currentTheme.colors.text,
    marginBottom: 4,
  },
  input: {
    backgroundColor: currentTheme.colors.grayBackground,
    borderWidth: 1,
    borderColor: currentTheme.colors.grayBorder,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: currentTheme.colors.text,
  },
  helperText: {
    fontFamily: 'Inter-Light',
    fontSize: 12,
    color: currentTheme.colors.text,
    opacity: 0.7,
    marginTop: 4,
  },
};
```

**States:**

**Default:**
- Background: `grayBackground`
- Border: 1px `grayBorder`
- Text: `text` color

**Focused:**
- Border: 2px `primary`
- Slight shadow or glow

**Error:**
- Border: 2px `accent` (red/error color)
- Error message below in `accent` color

**Disabled:**
- Background: Lighter `grayBackground`
- Text: Muted
- Opacity: 0.5

---

#### 2. Number Input

**Purpose:** Numeric entry (scores, counts, etc.)

**Specifications:**
```typescript
const numberInputStyles = {
  input: {
    ...textInputStyles.input,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
};
```

**Features:**
- Monospace font for better alignment
- Center-aligned text
- Number keyboard on mobile
- Optional increment/decrement buttons

---

### Input Design Guidelines

**Do's ✅**
- Provide clear labels for all inputs
- Show focus state clearly
- Display helpful error messages
- Use appropriate keyboard types
- Maintain consistent input heights (44-48px)

**Don'ts ❌**
- Don't use placeholder as label
- Don't hide validation errors
- Don't make input fields too narrow
- Don't use tiny fonts (< 16px) to avoid zoom on iOS

---

## Grid Layouts (Game Boards)

### Grid Layout Specifications

#### Square Grid (Sudoku, Minesweeper, etc.)

**Specifications:**
```typescript
const gridStyles = {
  container: {
    aspectRatio: 1,
    backgroundColor: currentTheme.colors.background,
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  cell: {
    flex: 1,
    backgroundColor: currentTheme.colors.grayBackground,
    borderWidth: 0.5,
    borderColor: currentTheme.colors.grayBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Thicker borders for major divisions (e.g., 3x3 boxes in Sudoku)
  majorBorder: {
    borderWidth: 2,
    borderColor: currentTheme.colors.border,
  },
};
```

**Design Properties:**
- Aspect Ratio: 1:1 (square)
- Cell Background: `grayBackground`
- Minor Borders: 0.5-1px `grayBorder`
- Major Borders: 2px `border`
- Gap: Use borders or margins consistently

---

#### Cell States

**Default:**
- Background: `grayBackground`
- Border: `grayBorder`

**Selected:**
- Background: `primary` with opacity
- Border: `primary`

**Hover (if applicable):**
- Background: Slightly darker `grayBackground`

**Disabled/Fixed:**
- Background: Lighter or different shade
- Text: Bolder or different color

**Error:**
- Background: `accent` with low opacity
- Border: `accent`

---

### Grid Design Guidelines

**Do's ✅**
- Ensure cells are easily tappable (minimum 32px)
- Use thicker borders to separate major sections
- Provide clear visual feedback for selected cells
- Maintain consistent spacing
- Scale grids appropriately for screen size

**Don'ts ❌**
- Don't make cells too small (< 32px)
- Don't use too many different cell states
- Don't make borders too thick (overwhelming)
- Don't ignore touch target sizes on mobile

---

## Icons

### Icon Guidelines

#### Icon Sizes

```typescript
const iconSizes = {
  small: 16,    // Inline with text, small indicators
  medium: 24,   // Standard UI icons
  large: 32,    // Prominent icons, headers
  xlarge: 48,   // Feature icons, empty states
};
```

#### Icon Usage

**Navigation Icons:**
- Size: 24px
- Color: `tabIconDefault` / `tabIconSelected`
- State changes with selection

**Action Icons:**
- Size: 24px
- Color: `text` or `primary`
- Interactive with touch feedback

**Decorative Icons:**
- Size: Variable (16-48px)
- Color: Match content or `accent`
- Non-interactive

---

### Icon Implementation

```typescript
import { Ionicons } from '@expo/vector-icons';

function IconButton({ name, onPress }) {
  const { currentTheme } = useThemeContext();
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons
        name={name}
        size={24}
        color={currentTheme.colors.text}
      />
    </TouchableOpacity>
  );
}
```

---

## Spacing System

### Spacing Scale

Use a consistent spacing scale based on 4px increments:

```typescript
const spacing = {
  xs: 4,    // Very tight spacing
  sm: 8,    // Small spacing
  md: 16,   // Standard spacing
  lg: 24,   // Large spacing
  xl: 32,   // Extra large spacing
  xxl: 48,  // Maximum spacing
};
```

### Spacing Usage

**Component Padding:**
- Cards: 16px
- Buttons: 12px vertical, 24px horizontal
- Inputs: 12px vertical, 16px horizontal

**Component Margins:**
- Between sections: 24-32px
- Between related items: 8-16px
- Between form fields: 16px

**Container Padding:**
- Screen edges: 16-24px
- Modal/Dialog: 24px

---

## Elevation (Shadows)

### Shadow Levels

```typescript
const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
```

### Elevation Usage

- **Level 0 (None):** Flat UI elements, backgrounds
- **Level 1 (Small):** Cards, buttons at rest
- **Level 2 (Medium):** Elevated cards, dropdowns, tooltips
- **Level 3 (Large):** Modals, dialogs, important overlays

---

## Border Radius

### Radius Scale

```typescript
const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999, // Fully rounded (pills, circular buttons)
};
```

### Radius Usage

- **Buttons:** 8px (medium)
- **Cards:** 12px (large)
- **Inputs:** 8px (medium)
- **Icon Buttons:** 50% (circular)
- **Badges/Pills:** 999px (fully rounded)

---

## Component States Summary

### Interactive Components

All interactive components should have these states:

1. **Default** - Standard appearance
2. **Hover** - Subtle highlight (web/cursor-based)
3. **Pressed/Active** - Clear feedback during interaction
4. **Focused** - Keyboard navigation indicator
5. **Disabled** - Muted appearance, no interaction
6. **Loading** - Progress indicator during async operations

### Visual State Indicators

**Default → Pressed:**
- Scale: 1.0 → 0.98
- Shadow: Reduce by 50%
- Color: Darken by 10-20%

**Default → Disabled:**
- Opacity: 1.0 → 0.5
- Background: Original → `grayBackground`
- Cursor: pointer → not-allowed

**Default → Loading:**
- Show spinner/activity indicator
- Disable interaction
- Optional: Reduce opacity to 0.7

---

## Best Practices

### Consistency

- Use the same component styles across the app
- Maintain consistent spacing, sizing, and colors
- Follow established patterns for similar interactions

### Accessibility

- Ensure minimum touch target sizes (44x44px)
- Provide clear visual feedback for all states
- Use sufficient color contrast
- Support keyboard navigation
- Include screen reader labels

### Performance

- Avoid excessive shadows on large lists
- Use native driver for animations when possible
- Optimize re-renders with React.memo
- Flatten view hierarchies when possible

### Responsiveness

- Scale components appropriately for screen size
- Maintain touch targets on all devices
- Consider landscape orientations
- Test on multiple screen sizes

---

## Related Documentation

- [Theme System](./01-themes.md) - Color and theme usage
- [Typography](./02-typography.md) - Text styling in components
- [Colors](./03-colors.md) - Color usage and accessibility
- [Animations](./05-animations.md) - Component animation guidelines
