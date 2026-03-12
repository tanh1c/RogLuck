# 🎰 Dungeon Casino Rogue

A pixel art roguelike deck-building web game with gambling mini-games. No real money involved - purely for entertainment!

## 🎮 Features

### Core Gameplay
- **5 Character Classes**: Gambler, Cheat Master, High Roller, Lucky Fool, Card Counter
- **10 Floor Dungeon**: Procedurally generated floors with increasing difficulty
- **6 Room Types**: Gambling, Elite, Boss, Rest, Treasure, Shop
- **Gambling-Based Combat**: Win gambling rounds to deal damage, lose and take damage

### Gambling Mini-Games (5 Total)
- **🃏 Poker** - 5-card draw poker hand evaluation
- **🎴 Blackjack** - Classic 21 against the dealer
- **🎡 Roulette** - European roulette with multiple bet types
- **🎲 Dice** - 3d6 dice rolling with various bet options
- **🎰 Slot Machine** - 3-reel slot with multiple symbols

### Deck-Building System
- **17 Unique Cards**: Technique, Ability, and Modifier types
- **4 Rarity Tiers**: Common, Uncommon, Rare, Legendary
- **Card Effects**: Damage, heal, buff, shield, crit, steal gold
- **Card Upgrades**: Level up cards during runs

### Meta Progression
- **Casino Coins**: Permanent currency earned from runs
- **Permanent Upgrades**: HP, gold, luck, discount, deck slots
- **Character Unlocks**: Unlock new character classes
- **Card Collection**: Unlock and track all discovered cards
- **Achievements**: 8 achievements with Coin rewards
- **Statistics Tracking**: Comprehensive run and gameplay stats

### Polish & UX
- **Animations**: Card flip, dice roll, win/loss effects with Framer Motion
- **Visual Effects**: Damage numbers, coin particles
- **Sound Effects**: Card flip, dice roll, win, lose, coin, damage sounds
- **Auto-Save**: Every 30 seconds + on page close
- **Mobile Responsive**: Touch-friendly controls, adaptive layouts
- **2-Column Layout**: Optimized desktop layout with gameplay left, stats sidebar right
- **Responsive Sidebar**: Collapsible mobile sidebar with slide-up animation
- **Real-time Stats**: HUD, combat log, quick stats, mini-map always visible
- **Pixel Art Style**: 16-bit inspired visuals with Press Start 2P font

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with pixel art theme
- **State Management**: Zustand (with persist middleware)
- **Animations**: Framer Motion
- **Sound**: Howler.js
- **Storage**: localStorage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 How to Play

1. **Select a Character**: Choose from 5 unique classes
2. **Enter the Dungeon**: Explore 10 floors of casino challenges
3. **Play Mini-Games**: Win at Poker, Blackjack, and other games
4. **Build Your Deck**: Collect cards and upgrade them
5. **Beat the Boss**: Defeat the House Casino Owner on Floor 10

## 🎨 Character Classes

| Class | HP | Gold | Special Ability |
|-------|-----|------|-----------------|
| Gambler | 100 | 50 | +10% gold found |
| Cheat Master | 90 | 40 | Free Peek once per combat |
| High Roller | 80 | 100 | Start with +50% gold, -20% HP |
| Lucky Fool | 70 | 50 | +25% crit chance, -30% max HP |
| Card Counter | 95 | 45 | See history of last 5 rounds |

## 🃏 Card Types

- **Technique Cards**: Gambling techniques (Bluff, Double Down, Peek)
- **Ability Cards**: Combat abilities (Fireball, Heal, Counter)
- **Modifier Cards**: Passive buffs (Lucky Charm, Hot Streak)

## 📦 Completed Features (v1.0)

### Phase 1: Core Game Loop ✅
- [x] Floor generation system (10 floors, 6 room types)
- [x] Combat system integration
- [x] Gambling-combat integration

### Phase 2: More Gambling Games ✅
- [x] Roulette mini-game
- [x] Dice mini-game
- [x] Slot Machine mini-game

### Phase 3: Card System & Deck Building ✅
- [x] Full card effects system (17 cards, 4 rarities)
- [x] Card collection & unlocks

### Phase 4: Meta Progression ✅
- [x] Meta shop with permanent upgrades
- [x] Statistics & achievements (8 achievements)

### Phase 5: Polish & UX ✅
- [x] Animations & effects (Framer Motion)
- [x] Auto-save system (30s interval + on close)
- [x] Mobile responsive design
- [x] Sound effects system
- [x] 2-column responsive layout with sidebar (desktop optimized)

### Phase 6: Testing & Documentation ✅
- [x] Unit tests
- [x] Updated documentation
- [x] CONTRIBUTING.md
- [x] CHANGELOG.md

## 🎨 Pixel Art Assets

Created with placeholder SVGs. For production assets, use:
- **Aseprite** (paid) - Professional pixel art editor
- **Piskel** (free) - Web-based pixel art editor
- **GraphicsGale** (free) - Powerful pixel art tool

## 📄 License

MIT

---

Built with ❤️ for gambling and roguelike fans everywhere!

🎲 Good luck at the tables! 🎰
