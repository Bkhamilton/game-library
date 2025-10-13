# DolphinDive - Obstacle Position Diagram

## Visual Layout

```
Y=0   ─────────────────────────────────────────────────
      │                                              │
      │            SKY (Light Blue)                  │
      │                                              │
Y=200 │    🐦 SEAGULL (Blue, 50x40)                 │  ← Highest obstacle (200px above water)
      │                                              │
      │                                              │
      │                                              │
Y=360 │    🚤 BOAT (Red, 120x80)                    │  ← 40px above water (sits partially in water)
Y=370 │    ⚓ BUOY (Yellow, 40x60)                   │  ← 30px above water (just above surface)
      │                                              │
Y=400 ═════════ WATER SURFACE ══════════════════════  ← Water line (WATER_SURFACE_Y constant)
      │                                              │
Y=430 │    🐬 DOLPHIN (at rest)                     │  ← Resting depth (30px below water)
      │                                              │
Y=475 │    🪨 ROCK (Gray, 60x50)                    │  ← Shallow underwater (75px below water)
      │                                              │
      │            OCEAN (Dark Blue)                 │
      │                                              │
Y=550 │    🪼 JELLYFISH (Purple, 55x65)             │  ← Deep underwater (150px below water)
      │                                              │
Y=750 │                                              │  ← Max dive depth (350px below surface)
      │                                              │
Y=850 ─────────────────────────────────────────────────  ← Screen bottom
```

## Vertical Distribution

### Above Water (Sky Zone)
- **Y=200:** Seagull (absolute position 200px from top, 200px above water surface)
- **Y=360:** Boat (absolute position 360px from top, 40px above water surface)
- **Y=370:** Buoy (absolute position 370px from top, 30px above water surface)

### Water Surface
- **Y=400:** Water Surface Line (WATER_SURFACE_Y constant)

### Below Water (Ocean Zone)
- **Y=430:** Dolphin resting position (absolute 430px from top, 30px below water surface)
- **Y=475:** Rock (absolute 475px from top, 75px below water surface)
- **Y=550:** Jellyfish (absolute 550px from top, 150px below water surface)

**Note:** Y positions are absolute screen coordinates. Water surface is at Y=400 (WATER_SURFACE_Y constant).

## Height Ranges

### Airborne Obstacles
- **Seagull:** 200px above water (requires deep dive + high jump)
- **Boat:** 40px above water (forces underwater navigation)
- **Buoy:** 30px above water (flexible avoidance)

### Underwater Obstacles
- **Rock:** 75px below water (blocks shallow dives)
- **Jellyfish:** 150px below water (blocks deep dives)

## Gameplay Zones

```
┌─────────────────────────────────────────┐
│  HIGH JUMP ZONE (Y=0-300)               │  Seagull territory
│  Requires deep dive momentum            │
├─────────────────────────────────────────┤
│  LOW JUMP ZONE (Y=300-390)              │  Boat, Buoy territory
│  Surface obstacles                       │
├═════════════════════════════════════════┤  ← WATER SURFACE (Y=400)
│  SHALLOW DIVE ZONE (Y=400-500)          │  Rock territory
│  Light diving required                   │
├─────────────────────────────────────────┤
│  DEEP DIVE ZONE (Y=500-750)             │  Jellyfish territory
│  Maximum diving depth                    │
└─────────────────────────────────────────┘
```

## Obstacle Characteristics

| Obstacle  | Color Code | Absolute Y | Relative to Water | Size (W×H) | Zone        | Avoidance        |
|-----------|------------|------------|-------------------|------------|-------------|------------------|
| Seagull   | #1976D2    | 200        | 200px above       | 50×40      | High Air    | Deep dive → Jump |
| Boat      | #D32F2F    | 360        | 40px above        | 120×80     | Low Air     | Dive under       |
| Buoy      | #FBC02D    | 370        | 30px above        | 40×60      | Low Air     | Dive or Jump     |
| Rock      | #757575    | 475        | 75px below        | 60×50      | Shallow Sea | Stay above       |
| Jellyfish | #9C27B0    | 550        | 150px below       | 55×65      | Deep Sea    | Don't dive deep  |

**Note:** Absolute Y = screen position from top. Relative = distance from water surface (Y=400).

## Movement Pattern

All obstacles move horizontally across the screen from right to left:

```
TIME →

Frame 0:     [Obstacle at x=375] ───────────────────▶
Frame 1:                       [Obstacle] ──────────▶
Frame 2:                                [Obstacle] ─▶
Frame 3:                                         [Off]

Movement Speed:
- Easy Mode: 3 pixels per frame
- Hard Mode: 5 pixels per frame
```

## Spawn Pattern

```
Spawn Point (x=375)
      ↓
      │ [OBS]        Random Type Selection:
      │              - Boat (20%)
      │              - Seagull (20%)
      │              - Buoy (20%)
      │              - Rock (20%)
      │              - Jellyfish (20%)
      │
      │ [OBS]        Spawn Interval:
      │              Easy: 2500-3500ms (base + 0-1000ms random)
      │              Hard: 1800-2800ms (base + 0-1000ms random)
      │
      │ [OBS]
      │
```

## Collision Detection (Future)

```
Dolphin Hitbox:
┌─────────────┐
│   60×40px   │  DOLPHIN_WIDTH = 60
│   at (100,y)│  DOLPHIN_HEIGHT = 40
└─────────────┘  DOLPHIN_X = 100 (fixed)

Obstacle Hitbox:
┌─────────────┐
│  Varies by  │  Width: 40-120px
│  type       │  Height: 40-80px
└─────────────┘  Position: varies by type
```

## Design Notes

### Strategic Placement
1. **High obstacles** (seagull) encourage deep diving to build momentum
2. **Surface obstacles** (boat, buoy) test jump timing and decision-making
3. **Underwater obstacles** (rock, jellyfish) prevent "always dive" strategy
4. **Varied depths** create dynamic gameplay requiring constant adaptation

### Visual Clarity
- Each obstacle has a distinct color for easy identification
- Sizes vary to make obstacles recognizable at a distance
- Position heights are spread out to avoid confusion

### Difficulty Scaling
- More obstacles spawn in hard mode
- Obstacles move faster in hard mode
- Random spawn timing prevents pattern memorization
