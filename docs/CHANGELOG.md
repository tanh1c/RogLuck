# Changelog

All notable changes to Dungeon Casino Rogue will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-12

### ✨ Added

#### Phase 1: Core Game Loop
- Procedural floor generation system (10 floors)
- 6 room types: Gambling, Elite, Boss, Rest, Treasure, Shop
- Turn-based combat system
- Gambling-combat integration (win = deal damage, lose = take damage)
- Floor map visualization with room icons

#### Phase 2: Gambling Games
- **Roulette**: European roulette with number, color, even/odd, high/low bets
- **Dice**: 3d6 dice rolling with sum, triple, specific number bets
- **Slot Machine**: 3-reel slot with 7 symbol types
- **Poker**: 5-card draw with hand evaluation
- **Blackjack**: Classic 21 with dealer AI

#### Phase 3: Card System
- 17 unique cards across 3 types (Technique, Ability, Modifier)
- 4 rarity tiers: Common, Uncommon, Rare, Legendary
- Card effects system: damage, heal, buff, shield, crit, steal gold
- Card collection tracking
- Card unlock system
- In-run card upgrades

#### Phase 4: Meta Progression
- Casino Coins currency system
- Meta shop with permanent upgrades:
  - Max HP +20
  - Starting Gold +25
  - Luck +10%
  - Shop Discount 10%
  - Extra deck slot
- 5 character classes with unique bonuses
- Character unlock system
- 8 achievements with Coin rewards
- Statistics tracking (runs, wins, gold, floors, etc.)

#### Phase 5: Polish & UX
- **Animations**:
  - Card flip animations (Framer Motion)
  - Card hover effects with spring physics
  - Fade-in and scale animations
- **Visual Effects**:
  - DamageNumber component (floating damage/heal/gold)
  - CoinParticle component (coin collection animation)
- **Auto-Save System**:
  - Auto-save every 30 seconds
  - Auto-save on page close
  - Full game state persistence
- **Mobile Responsive**:
  - Touch-friendly button sizes (min 44px)
  - Adaptive font sizes
  - Vertical button stacking on mobile
  - Optimized HP bar sizes
- **Sound Effects** (Howler.js):
  - Card flip sound
  - Dice roll sound
  - Win/lose sounds
  - Coin collection sound
  - Damage/heal sounds
  - Button click sound

#### Phase 6: Testing & Documentation
- Unit tests for core utilities
- Updated README.md with full features
- CONTRIBUTING.md guide
- CHANGELOG.md

### 🔧 Changed
- Improved TypeScript type safety across all components
- Enhanced state management with Zustand
- Optimized build size and performance
- Refined pixel art styling

### 🐛 Fixed
- 28+ TypeScript errors resolved
- Type mismatches in Blackjack and GamblingEncounter
- Unused imports and variables cleanup
- Deck store type issues

## [0.0.0] - 2026-03-11

### ✨ Added
- Initial MVP project setup
- React 18 + TypeScript + Vite
- Tailwind CSS with pixel art theme
- Zustand state management
- Basic Poker mini-game
- Basic Blackjack mini-game
- Character selection screen
- Main menu
- Basic shop system

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-03-12 | Full game release with all features |
| 0.0.0 | 2026-03-11 | Initial MVP |

## Upcoming Features (Post-1.0)

### Potential Additions
- [ ] More gambling games (Baccarat, Pai Gow, Mahjong)
- [ ] Additional character classes (up to 10)
- [ ] Relic system with passive bonuses
- [ ] Daily challenges/seeds
- [ ] Online leaderboards
- [ ] Custom character skins
- [ ] More card types (50+ cards total)
- [ ] Hard mode unlockable
- [ ] Achievement rewards beyond coins
- [ ] Tutorial system
- [ ] Better enemy AI
- [ ] More floor themes
- [ ] Boss mechanics
- [ ] Event rooms
- [ ] Card synergies/combos

### Balance Changes (Future)
- Tune enemy HP scaling
- Adjust card effect values
- Balance Casino Coins earnings
- Refine permanent upgrade costs

---

**Built with ❤️** | [View Source](https://github.com/) | [Report Issue](https://github.com/issues)
