# Dungeon Casino Rogue - Game Design Document

**Date:** 2026-03-11
**Version:** 1.0
**Status:** Brainstorming Complete

---

## 🎮 Game Overview

**Dungeon Casino Rogue** là web game kết hợp giữa Roguelike + Gambling + Deck-building, không dùng tiền thật. Người chơi vào vai một冒险 giả thâm nhập vào "Casino Dungeon" huyền bí, nơi mỗi tầng là một sòng bạc với các trò gambling cổ điển.

### Core Concept
- **Genre:** Roguelike + Gambling + Deck-building
- **Setting:** Dungeon Fantasy + Casino huyền bí
- **Platform:** Web browser (desktop/mobile responsive)
- **Art Style:** Pixel Art (16-bit inspired)
- **Monetization:** None (local storage only, no real money)

---

## 🎯 Core Gameplay Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Hub] → Chọn Character → Vào Dungeon                          │
│                          ↓                                      │
│  [Floor Generation] → Procedural layout với rooms ngẫu nhiên   │
│                          ↓                                      │
│  [Room Selection] → Gambling Room / Shop / Rest / Elite / Boss │
│                          ↓                                      │
│  [Encounter] → Gambling Mini-game + Combat                     │
│                          ↓                                      │
│  [Reward] → Gold + Cards + Relics                              │
│                          ↓                                      │
│  [Shop] → Mua card, remove card, potion, relics                │
│                          ↓                                      │
│  [Next Floor] → Lặp lại cho đến khi thắng Boss hoặc "vỡ nợ"    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎲 Gambling Systems

### Thể loại Gambling

| Loại | Games | Áp dụng vào combat |
|------|-------|-------------------|
| **Card Games** | Poker, Blackjack, Baccarat | Combat chính, technique cards |
| **Dice Games** | Craps, Sic Bo, Custom dice | Buff damage, crit rolls |
| **Roulette** | European/American roulette | Random effects, AoE attacks |
| **Slot Machine** | 3-reel, 5-reel slots | Loot generation, random bonuses |
| **Custom Games** | High-Low, Guess the Color | Quick encounters |

### Combat Integration

1. **Gambling thay thế Combat:**
   - Thắng gambling = thắng combat (enemy mất HP hoặc chạy)
   - Thua gambling = người chơi mất HP, vào combat turn-based

2. **Gambling để Buff:**
   - In-combat mini-games để trigger abilities
   - Roll dice để xác định crit damage
   - Draw card để chọn ability sử dụng

---

## 🃏 Deck-building System

### Card Types

#### 🎴 Technique Cards (Gambling Techniques)
| Card | Effect | Upgrade Path |
|------|--------|--------------|
| Bluff | Thắng tự động 1 round nhỏ | Bluff II, III (thắng round lớn hơn) |
| Double Down | Gấp đôi cược, thắng x2 | Double Down II (x3), III (x4) |
| Peek | Xem trước 1 lá đối thủ | Peek II (2 lá), III (3 lá) |
| Fold | Thoát khỏi combat nhỏ | Fold II (không mất máu) |
| All In | Risk cao, reward cao | All In II (+luck), III (guaranteed win) |

#### 🔮 Ability Cards (Combat/Magic)
| Card | Effect | Upgrade Path |
|------|--------|--------------|
| Fireball | Gây sát thương khi thua gambling | Fireball II, III (sát thương tăng) |
| Heal | Hồi máu sau khi thua | Heal II (+50%), III (+100%) |
| Counter | Phản đòn khi đối thủ thắng | Counter II (2x), III (3x) |
| Lucky Strike | Crit chance +20% | Lucky Strike II (+30%), III (+50%) |
| Second Chance | Chơi lại 1 round đã thua | Second Chance II (2 lần/run) |

#### 🍀 Modifier Cards (Passive Buffs)
| Card | Effect | Upgrade Path |
|------|--------|--------------|
| Lucky Charm | +5% win rate | Lucky Charm II (+10%), III (+15%) |
| House Edge | Dealer khó thắng hơn | House Edge II, III (giảm khó dần) |
| Hot Streak | Thắng liên tiếp = bonus gold | Hot Streak II (bonus cao hơn) |
| Card Counter | Nhớ bài tốt hơn | Card Counter II (xem nhiều hơn) |
| High Roller | Thắng = nhiều gold hơn | High Roller II (x2), III (x3) |

### Deck Rules
- **Deck size:** 10-20 cards
- **Starting deck:** 5 cards cơ bản (tùy character class)
- **Card acquisition:** Shop, reward rooms, events
- **Card removal:** Shop (trả gold)
- **Upgrade system:** Dùng gold hoặc special currency để upgrade cards giữa các run

---

## 👤 Character Classes

| Class | Starting Deck | Special Ability | Playstyle |
|-------|---------------|-----------------|-----------|
| **Gambler** | 5 cards cơ bản balanced | +10% gold tìm được | Balanced, dễ chơi |
| **Cheat Master** | Technique cards nhiều hơn | Peek 1 lá miễn phí mỗi combat | Card game focused |
| **High Roller** | Modifier cards nhiều hơn | Starting gold +50%, HP -20% | High risk, high reward |
| **Lucky Fool** | Ability cards nhiều hơn | +25% crit chance, -30% max HP | Glass cannon |
| **Card Counter** | Technique + Modifier | Xem lịch sử 5 round trước | Calculation/strategy |

### Unlock Progression
- **Gambler:** Unlocked từ đầu
- **Cheat Master:** Thắng 5 runs với Gambler
- **High Roller:** Tích lũy 1000 gold meta-currency
- **Lucky Fool:** Thắng 1 run không thua lần nào
- **Card Counter:** Thắng boss với 4 class còn lại

---

## 🏛️ Roguelike Mechanics

### Floor Structure
```
Floor 1-3: Easy rooms (basic gambling, low stakes)
Floor 4: Shop + Rest room
Floor 5: Elite enemy (khó hơn, reward tốt hơn)
Floor 6-8: Medium rooms
Floor 9: Shop + Special event
Floor 10: BOSS (House Casino Owner)
```

### Room Types

| Room Type | Description |
|-----------|-------------|
| 🎰 Gambling Room | Enemy gambling encounter |
| 🏪 Shop | Mua card, remove card, items |
| 💤 Rest Room | Hồi máu, upgrade 1 card |
| 💰 Treasure Room | Free gold/card selection |
| ⚔️ Elite Room | Khó hơn, reward tốt hơn |
| 🐉 Boss Room | Floor 10 boss encounter |
| ❓ Event Room | Random event (có lợi hoặc có hại) |

### Death & Progression
- **Death:** Mất gold trong run, giữ lại meta-currency
- **Meta-currency:** "Casino Coins" kiếm từ achievement, thắng run
- **Persistent unlocks:** Giữ mãi dù chết

---

## 💰 Meta-Progression System

### Currency Types

| Currency | Source | Usage |
|----------|--------|-------|
| **Gold** | Thắng combat, sell items | Tiêu trong run (shop) |
| **Casino Coins** | Thắng run, achievements | Meta-upgrades, unlocks |
| **Achievement Points** | Complete challenges | Cosmetics, titles |

### Unlockables

#### Characters
- 5 classes như mô tả ở trên

#### Gambling Games
- Poker (unlocked từ đầu)
- Blackjack (unlocked từ đầu)
- Dice (thắng 3 runs)
- Roulette (thắng 5 runs)
- Slot Machine (thắng boss 1 lần)
- Custom games (achievements)

#### Card Collections
- 50+ cards total
- Unlock bằng cách tìm thấy trong runs hoặc mua với Casino Coins

### Permanent Upgrades (Shop giữa runs)

| Upgrade | Effect | Max Level | Cost |
|---------|--------|-----------|------|
| Health Boost | +10 max HP | 5 | 100 Coins |
| Starting Gold | +20 starting gold | 5 | 150 Coins |
| Luck Stat | +2% win rate | 10 | 200 Coins |
| Shop Discount | -5% shop prices | 5 | 250 Coins |
| Card Slots | +1 card trong deck | 3 | 300 Coins |

### Cosmetics
- Character skins (màu sắc, effect)
- Card back designs
- Table themes (casino floor skins)
- Victory animations
- Achievement badges

---

## 🏪 Shop System

### In-Run Shop (Gold)
| Item | Cost | Description |
|------|------|-------------|
| Random Card | 50-150 Gold | Card ngẫu nhiên tier 1-3 |
| Remove Card | 75 Gold | Xóa 1 card khỏi deck |
| Health Potion | 40 Gold | Hồi 30 HP |
| Random Relic | 200 Gold | Relic ngẫu nhiên |
| Card Upgrade | 100 Gold | Upgrade 1 card (trong run) |

### Meta Shop (Casino Coins)
| Item | Cost | Description |
|------|------|-------------|
| Permanent Upgrades | Xem bảng trên | Mua 1 lần, hiệu ứng mãi |
| New Character | 500 Coins | Unlock class mới |
| New Game Type | 300 Coins | Unlock game gambling mới |
| Cosmetics | 100-500 Coins | Skins, effects |

---

## 🎨 Visual Design

### Art Style: Pixel Art

**Inspiration:** Slay the Spikes, Stardew Valley, Casino classic aesthetics

### Theme
- **Color Palette:** Gold (#FFD700), Purple (#6B21A8), Dark Blue (#0F0A1A), Neon Pink (#FF00FF)
- **Style:** Pixel Art 16-bit + Fantasy Casino
- **UI Components:** Pixel borders, retro fonts, pixel particles

### Pixel Art Specifications

| Asset Type | Specification | Notes |
|------------|---------------|-------|
| **Character Sprites** | 32x32 hoặc 48x48 pixels | 4-direction animation, attack/idle/walk |
| **Enemy Sprites** | 32x32 hoặc 64x64 pixels | Goblin Dealer, Dragon High-Roller, v.v. |
| **Cards** | 64x96 pixels (2x scale) | Pixel-art suit symbols, retro borders |
| **Tiles** | 16x16 hoặc 32x32 pixels | Floor tiles, table surfaces |
| **Icons** | 16x16 hoặc 32x32 pixels | Gold, HP, relics, status effects |
| **Particle Effects** | 8x8 hoặc 16x16 pixels | Coins, damage numbers, win sparks |

### Key Visuals
- **Character:** Pixel art sprites với animation frames (idle, walk, deal, win, lose)
- **Cards:** Pixel-art style với suit symbols (♥♦♣♠) retro
- **Tables:** Casino table pixel art với fantasy elements
- **Environment:** Dungeon casino floors với torches, carpets, slot machines
- **Animations:** Pixel-perfect card flip, dice roll, coin spin, damage shake

### Recommended Fonts
- **Primary:** "Press Start 2P" (Google Fonts)
- **Alternative:** "VT323", "Silkscreen"
- **UI Text:** Pixel-style readable fonts

### Color Palette (Pixel Art Friendly)

```
Background:    #0F0A1A (dark purple-black)
Primary:       #6B21A8 (casino purple)
Accent:        #FFD700 (gold)
Highlight:     #FF00FF (neon pink)
Secondary:     #1e3a5f (dark blue)
Text:          #ffffff (white)
Muted:         #a0a0a0 (gray)
Success:       #00ff00 (pixel green)
Danger:        #ff0000 (pixel red)
```

---

## 🛠 Technical Architecture

### Tech Stack

#### Option A: Canvas-based (Recommended cho Pixel Art)
```
Frontend:
  - React 18+ với TypeScript
  - Pixi.js hoặc Canvas API cho pixel art rendering
  - Tailwind CSS cho UI overlay
  - Zustand cho state management
  - Howler.js cho audio (pixel SFX)
  - IndexedDB/localStorage cho save data
```

#### Option B: DOM-based (Đơn giản hơn, dễ customize)
```
Frontend:
  - React 18+ với TypeScript
  - Tailwind CSS cho styling với pixel art fonts
  - shadcn/ui cho UI components
  - Zustand cho state management
  - Framer Motion cho pixel-perfect animations
  - IndexedDB/localStorage cho save data
```

### Pixel Art Tools Recommendations
| Purpose | Tool | Notes |
|---------|------|-------|
| Sprite Editor | Aseprite | Paid, professional |
| Sprite Editor | Piskel | Free, web-based |
| Sprite Editor | GraphicsGale | Free, powerful |
| Tile Editor | Tiled | Map design |
| Font | Google Fonts (Press Start 2P) | Pixel font |
| Palette | Lospec | Pixel art color palettes |

### Project Structure
```
rogluck/
├── src/
│   ├── components/
│   │   ├── game/
│   │   │   ├── Card.tsx
│   │   │   ├── Deck.tsx
│   │   │   ├── Hand.tsx
│   │   ├── gambling/
│   │   │   ├── Poker/
│   │   │   ├── Blackjack/
│   │   │   ├── Dice/
│   │   │   ├── Roulette/
│   │   │   ├── SlotMachine/
│   │   ├── ui/ (shadcn components)
│   │   └── layout/
│   ├── hooks/
│   │   ├── useGameState.ts
│   │   ├── useDeck.ts
│   │   ├── useSaveLoad.ts
│   ├── store/
│   │   ├── gameStore.ts
│   │   ├── deckStore.ts
│   │   ├── metaStore.ts
│   ├── types/
│   │   ├── game.ts
│   │   ├── cards.ts
│   │   ├── characters.ts
│   ├── utils/
│   │   ├── gambling-logic/
│   │   ├── combat-logic/
│   │   ├── save-load/
│   └── App.tsx
├── docs/
│   └── plans/
└── public/
    └── assets/
```

### State Management (Zustand)

```typescript
// Game State
interface GameState {
  currentFloor: number;
  currentRoom: Room | null;
  playerHP: number;
  maxHP: number;
  gold: number;
  deck: Card[];
  hand: Card[];
  relics: Relic[];
}

// Meta State
interface MetaState {
  casinoCoins: number;
  unlockedCharacters: string[];
  unlockedGames: string[];
  unlockedCards: string[];
  permanentUpgrades: Upgrade[];
  cosmetics: Cosmetic[];
  achievements: Achievement[];
}
```

### Save/Load System
```typescript
// localStorage: meta data nhỏ
localStorage.setItem('metaState', JSON.stringify(metaState));

// IndexedDB: data lớn hơn (deck stats, history)
const db = await openDB('RogLuck', 1, {
  upgrade(db) {
    db.createObjectStore('gameSaves');
    db.createObjectStore('statistics');
  }
});
```

---

## 📱 User Interface Flow

### Main Menu
```
┌─────────────────────────────────────┐
│     🎰 DUNGEON CASINO ROGUE 🎰      │
├─────────────────────────────────────┤
│  ▶️  New Run                        │
│  📂 Continue                        │
│  🏛️ Meta Shop                       │
│  📊 Statistics                      │
│  ⚙️  Settings                       │
└─────────────────────────────────────┘
```

### Character Select
```
┌─────────────────────────────────────┐
│       SELECT YOUR CHARACTER         │
├─────────────────────────────────────┤
│  [Gambler]      [Cheat Master]     │
│  [High Roller]  [Lucky Fool]       │
│  [Card Counter] [???] (locked)     │
└─────────────────────────────────────┘
```

### In-Game HUD
```
┌─────────────────────────────────────┐
│ ❤️ HP: 85/100  💰 Gold: 150        │
│ 🏛️ Floor: 3/10  🃏 Deck: 15 cards  │
├─────────────────────────────────────┤
│         [GAME CONTENT AREA]         │
└─────────────────────────────────────┘
```

---

## 🎮 Mini-Game Specifications

### Poker (Texas Hold'em)
- Player vs Enemy
- Simplified rules cho nhanh
- Thắng = enemy mất HP, Thua = player mất HP

### Blackjack
- Player vs Dealer (enemy)
- Standard rules, 3 decks
- Blackjack = 3x damage

### Dice (Craps Simplified)
- Roll 2 dice
- Predict total (high/low/exact)
- Win = buff damage, crit chance

### Roulette
- Bet on number/color
- Spin wheel animation
- Win = random effect (heal, damage, gold)

### Slot Machine
- 3-reel classic
- Match symbols = reward
- Jackpot = instant win

---

## 🏆 Achievements (Examples)

| Achievement | Requirement | Reward |
|-------------|-------------|--------|
| First Win | Thắng run đầu tiên | 100 Coins |
| High Roller | Tích 1000 gold trong 1 run | 50 Coins |
| Card Master | Thu thập 50 cards | Title + Skin |
| Unlucky | Thua 10 runs liên tiếp | 200 Coins (consolation) |
| Perfect Run | Thắng run không thua lần nào | 500 Coins + Title |
| All Classes | Thắng với 5 classes | Character skin đặc biệt |

---

## 🔮 Future Considerations (Post-MVP)

### Potential Features
- Multiplayer (PvP gambling)
- Daily challenges
- Leaderboards
- Seasonal events
- More character classes
- More gambling games
- Card trading (nếu có backend sau này)

### Technical Improvements
- PWA support (installable)
- Offline mode
- Cloud save (nếu có backend)
- Mobile app (React Native)

---

## 📋 MVP Scope

### Must Have (V1)
- [ ] 1 character class (Gambler)
- [ ] 2 gambling games (Poker, Blackjack)
- [ ] Basic deck-building (20 cards)
- [ ] 5 floors + 1 boss
- [ ] Shop between floors
- [ ] Save/Load system
- [ ] Meta-progression cơ bản

### Nice to Have (V2+)
- [ ] 5 character classes
- [ ] 5 gambling games
- [ ] 50+ cards
- [ ] 10 floors
- [ ] Full meta shop
- [ ] Achievements
- [ ] Cosmetics

---

## ✅ Approval

**Design approved by user:** 2026-03-11
**Next Step:** Invoke writing-plans skill để tạo implementation plan chi tiết
