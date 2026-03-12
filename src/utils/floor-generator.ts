import { Room, RoomType, Enemy, Reward, Relic } from '../types/game';
import { Card, CARD_DATABASE } from '../types/cards';

// Room type weights (percentages)
const ROOM_WEIGHTS: Record<RoomType, number> = {
  gambling: 50,
  rest: 15,
  treasure: 10,
  shop: 10,
  elite: 10,
  boss: 5,
};

// Enemy data
const BASIC_ENEMIES: Omit<Enemy, 'id' | 'hp' | 'maxHp'>[] = [
  { name: 'Slot Goblin', class: 'basic' },
  { name: 'Roulette Rat', class: 'basic' },
  { name: 'Card Bat', class: 'basic' },
  { name: 'Dice Spider', class: 'basic' },
  { name: 'Chip Squirrel', class: 'basic' },
];

const ELITE_ENEMIES: Omit<Enemy, 'id' | 'hp' | 'maxHp'>[] = [
  { name: 'Poker Knight', class: 'elite' },
  { name: 'Blackjack Baron', class: 'elite' },
  { name: 'Wheel Duke', class: 'elite' },
];

const BOSS_ENEMIES: Omit<Enemy, 'id' | 'hp' | 'maxHp'>[] = [
  { name: 'Casino King', class: 'boss' },
  { name: 'House Edge', class: 'boss' },
  { name: 'Jackpot Demon', class: 'boss' },
];

// Relic data
const RELICS: Relic[] = [
  { id: 'lucky-coin', name: 'Lucky Coin', description: 'Gain +5 gold per floor', effect: '+5 gold/floor' },
  { id: 'loaded-dice', name: 'Loaded Dice', description: '+10% crit chance', effect: '+10% crit' },
  { id: 'golden-chip', name: 'Golden Chip', description: 'Start combat with 10 shield', effect: '+10 shield start' },
  { id: 'four-leaf', name: 'Four-Leaf Clover', description: '+15% dodge chance', effect: '+15% dodge' },
  { id: 'ace-up-sleeve', name: 'Ace Up Sleeve', description: 'Draw +1 card each turn', effect: '+1 card draw' },
];

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Random integer between min and max (inclusive)
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Get random item from array
const randomChoice = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Weighted random selection for room types
const selectRoomType = (floorNumber: number): RoomType => {
  // Floor 10 always has boss
  if (floorNumber === 10) {
    return 'boss';
  }

  // Floor 4 always has shop
  if (floorNumber === 4) {
    return 'shop';
  }

  // Floor 5 always has elite
  if (floorNumber === 5) {
    return 'elite';
  }

  // For other floors, use weighted random
  const rand = Math.random() * 100;
  let cumulative = 0;

  // Adjust weights for floor 1 (no boss on floor 1)
  const weights = floorNumber === 1
    ? { ...ROOM_WEIGHTS, boss: 0 }
    : ROOM_WEIGHTS;

  // Normalize weights
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  for (const [type, weight] of Object.entries(weights)) {
    cumulative += (weight / totalWeight) * 100;
    if (rand <= cumulative) {
      return type as RoomType;
    }
  }

  return 'gambling'; // Default fallback
};

// Generate an enemy for a room
const generateEnemy = (roomType: RoomType, floorNumber: number): Enemy | undefined => {
  if (roomType !== 'gambling' && roomType !== 'elite' && roomType !== 'boss') {
    return undefined;
  }

  let enemyTemplate;
  let hp: number;

  switch (roomType) {
    case 'boss':
      enemyTemplate = randomChoice(BOSS_ENEMIES);
      hp = 80 + (floorNumber * 10);
      break;
    case 'elite':
      enemyTemplate = randomChoice(ELITE_ENEMIES);
      hp = 40 + (floorNumber * 5);
      break;
    default:
      enemyTemplate = randomChoice(BASIC_ENEMIES);
      hp = 20 + (floorNumber * 3);
      break;
  }

  return {
    id: generateId(),
    ...enemyTemplate,
    hp,
    maxHp: hp,
  };
};

// Generate a reward for a room
const generateReward = (roomType: RoomType, floorNumber: number): Reward | undefined => {
  switch (roomType) {
    case 'treasure':
      // Treasure rooms give gold or relics
      const treasureRoll = Math.random();
      if (treasureRoll < 0.6) {
        // 60% chance for gold
        return {
          type: 'gold',
          amount: randomInt(30, 60) + (floorNumber * 5),
        };
      } else if (treasureRoll < 0.9) {
        // 30% chance for card
        return {
          type: 'card',
          card: generateRandomCard(),
        };
      } else {
        // 10% chance for relic
        return {
          type: 'relic',
          relic: randomChoice(RELICS),
        };
      }

    case 'gambling':
      // Gambling rooms give small gold rewards after combat
      return {
        type: 'gold',
        amount: randomInt(10, 30) + (floorNumber * 2),
      };

    case 'elite':
      // Elite rooms give better rewards
      return {
        type: 'gold',
        amount: randomInt(40, 80) + (floorNumber * 5),
      };

    case 'boss':
      // Boss gives big reward
      return {
        type: 'gold',
        amount: randomInt(100, 200) + (floorNumber * 10),
      };

    default:
      return undefined;
  }
};

// Generate a random card
const generateRandomCard = (): Card => {
  const cardIds = Object.keys(CARD_DATABASE);
  const cardId = randomChoice(cardIds);
  const cardData = CARD_DATABASE[cardId];

  return {
    id: cardId,
    ...cardData,
    level: 1,
  } as Card;
};

// Get number of rooms for a floor
const getRoomCount = (floorNumber: number): number => {
  if (floorNumber >= 1 && floorNumber <= 3) {
    return randomInt(3, 4);
  } else if (floorNumber === 4 || floorNumber === 5) {
    return 4; // Fixed rooms for special floors
  } else if (floorNumber >= 6 && floorNumber <= 9) {
    return randomInt(4, 5);
  } else if (floorNumber === 10) {
    return 1; // Just boss on floor 10
  }
  return 4; // Default
};

// Generate a single room
const generateRoom = (roomType: RoomType, floorNumber: number): Room => {
  const room: Room = {
    id: generateId(),
    type: roomType,
  };

  // Add enemy if applicable
  const enemy = generateEnemy(roomType, floorNumber);
  if (enemy) {
    room.enemy = enemy;
  }

  // Add reward if applicable
  const reward = generateReward(roomType, floorNumber);
  if (reward) {
    room.reward = reward;
  }

  return room;
};

// Main floor generation function
export const generateFloor = (floorNumber: number): Room[] => {
  const rooms: Room[] = [];
  const roomCount = getRoomCount(floorNumber);

  // Special floors have predetermined room types
  if (floorNumber === 10) {
    // Boss floor
    rooms.push(generateRoom('boss', floorNumber));
    return rooms;
  }

  if (floorNumber === 4) {
    // Shop floor - guaranteed shop room
    rooms.push(generateRoom('shop', floorNumber));
  }

  if (floorNumber === 5) {
    // Elite floor - guaranteed elite room
    rooms.push(generateRoom('elite', floorNumber));
  }

  // Generate remaining rooms with weighted random selection
  while (rooms.length < roomCount) {
    const roomType = selectRoomType(floorNumber);

    // Avoid duplicate room types except for gambling
    if (roomType !== 'gambling' && rooms.some(r => r.type === roomType)) {
      continue;
    }

    rooms.push(generateRoom(roomType, floorNumber));
  }

  // Shuffle rooms for variety (except keep boss last on floor 10)
  if (floorNumber !== 10) {
    for (let i = rooms.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rooms[i], rooms[j]] = [rooms[j], rooms[i]];
    }
  }

  return rooms;
};

// Generate all floors for a complete run
export const generateAllFloors = (maxFloor: number = 10): Room[][] => {
  const floors: Room[][] = [];

  for (let floor = 1; floor <= maxFloor; floor++) {
    floors.push(generateFloor(floor));
  }

  return floors;
};

// Get room icon based on type
export const getRoomIcon = (roomType: RoomType): string => {
  const icons: Record<RoomType, string> = {
    gambling: '🎲',
    shop: '🏪',
    rest: '💤',
    treasure: '💰',
    elite: '⚔️',
    boss: '👹',
  };
  return icons[roomType];
};

// Get room color class based on type
export const getRoomColorClass = (roomType: RoomType): string => {
  const colors: Record<RoomType, string> = {
    gambling: 'bg-purple-600 border-purple-400',
    shop: 'bg-yellow-600 border-yellow-400',
    rest: 'bg-green-600 border-green-400',
    treasure: 'bg-amber-600 border-amber-400',
    elite: 'bg-red-600 border-red-400',
    boss: 'bg-rose-700 border-rose-500',
  };
  return colors[roomType];
};

// Get room display name
export const getRoomDisplayName = (roomType: RoomType): string => {
  const names: Record<RoomType, string> = {
    gambling: 'Gambling Room',
    shop: 'Shop',
    rest: 'Rest Area',
    treasure: 'Treasure Room',
    elite: 'Elite Battle',
    boss: 'Boss Chamber',
  };
  return names[roomType];
};
