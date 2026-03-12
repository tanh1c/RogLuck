import { Card, CardEffect } from '../types/cards';

// Context for effect execution
export interface EffectContext {
  playerHP: number;
  maxHP: number;
  enemyHP: number;
  gold: number;
  winRateBonus: number;
  damageBonus: number;
  shield: number;
  critChance: number;
}

// Result of effect execution
export interface EffectResult {
  context: EffectContext;
  messages: string[];
}

/**
 * Execute a single card effect and return the modified context
 */
export function executeCardEffect(
  effect: CardEffect,
  context: EffectContext,
  cardLevel: number = 1
): EffectResult {
  const messages: string[] = [];
  const newContext = { ...context };

  // Apply level multiplier to effect value
  const levelMultiplier = 1 + (cardLevel - 1) * 0.2; // +20% per level
  const scaledValue = Math.floor(effect.value * levelMultiplier);

  switch (effect.type) {
    case 'damage':
      newContext.enemyHP = Math.max(0, newContext.enemyHP - scaledValue);
      messages.push(`Dealt ${scaledValue} damage to enemy!`);
      break;

    case 'heal':
      const oldHP = newContext.playerHP;
      newContext.playerHP = Math.min(newContext.maxHP, newContext.playerHP + scaledValue);
      const healed = newContext.playerHP - oldHP;
      messages.push(`Healed ${healed} HP!`);
      break;

    case 'buff_win_rate':
      newContext.winRateBonus += scaledValue;
      messages.push(`Win rate increased by ${scaledValue}%!`);
      break;

    case 'extra_damage':
      newContext.damageBonus += scaledValue;
      messages.push(`Damage bonus increased by ${scaledValue}!`);
      break;

    case 'shield':
      newContext.shield = scaledValue;
      messages.push(`Gained ${scaledValue} shield!`);
      break;

    case 'steal_gold':
      newContext.gold += scaledValue;
      messages.push(`Gained ${scaledValue} gold!`);
      break;

    case 'crit_boost':
      newContext.critChance += scaledValue;
      messages.push(`Critical chance increased by ${scaledValue}%!`);
      break;

    default:
      messages.push(`Unknown effect type: ${effect.type}`);
  }

  return { context: newContext, messages };
}

/**
 * Apply all passive effects from a collection of cards
 */
export function applyPassiveEffects(
  cards: Card[],
  context: EffectContext
): EffectContext {
  const passiveCards = cards.filter(card => card.effect.trigger === 'passive');

  return passiveCards.reduce((ctx, card) => {
    const result = executeCardEffect(card.effect, ctx, card.level);
    return result.context;
  }, context);
}

/**
 * Calculate the total win rate bonus from all passive cards
 */
export function calculateWinRateBonus(cards: Card[]): number {
  return cards
    .filter(card => card.effect.trigger === 'passive' && card.effect.type === 'buff_win_rate')
    .reduce((total, card) => {
      const levelMultiplier = 1 + (card.level - 1) * 0.2;
      return total + Math.floor(card.effect.value * levelMultiplier);
    }, 0);
}

/**
 * Calculate the total damage bonus from all passive cards
 */
export function calculateDamageBonus(cards: Card[]): number {
  return cards
    .filter(card => card.effect.trigger === 'passive' && card.effect.type === 'extra_damage')
    .reduce((total, card) => {
      const levelMultiplier = 1 + (card.level - 1) * 0.2;
      return total + Math.floor(card.effect.value * levelMultiplier);
    }, 0);
}

/**
 * Calculate total shield from all active shield effects
 */
export function calculateShield(cards: Card[]): number {
  return cards
    .filter(card => card.effect.type === 'shield')
    .reduce((total, card) => {
      const levelMultiplier = 1 + (card.level - 1) * 0.2;
      return total + Math.floor(card.effect.value * levelMultiplier);
    }, 0);
}

/**
 * Get all active effect messages for display
 */
export function getActiveEffectsDisplay(cards: Card[]): string[] {
  const displays: string[] = [];

  cards.forEach(card => {
    if (card.effect.trigger === 'passive') {
      const levelMultiplier = 1 + (card.level - 1) * 0.2;
      const value = Math.floor(card.effect.value * levelMultiplier);

      switch (card.effect.type) {
        case 'buff_win_rate':
          displays.push(`+${value}% Win Rate (${card.name})`);
          break;
        case 'extra_damage':
          displays.push(`+${value} Damage (${card.name})`);
          break;
        case 'heal':
          displays.push(`+${value} HP/turn (${card.name})`);
          break;
        case 'steal_gold':
          displays.push(`+${value} Gold/win (${card.name})`);
          break;
        case 'crit_boost':
          displays.push(`+${value}% Crit (${card.name})`);
          break;
      }
    }
  });

  return displays;
}

/**
 * Trigger effects based on game events (win/loss)
 */
export function triggerEventEffects(
  cards: Card[],
  event: 'on_win' | 'on_loss',
  context: EffectContext
): EffectResult {
  const eventCards = cards.filter(card => card.effect.trigger === event);
  let currentContext = { ...context };
  const allMessages: string[] = [];

  eventCards.forEach(card => {
    const result = executeCardEffect(card.effect, currentContext, card.level);
    currentContext = result.context;
    allMessages.push(...result.messages.map(m => `${card.name}: ${m}`));
  });

  return { context: currentContext, messages: allMessages };
}

/**
 * Calculate card damage with level scaling
 */
export function calculateCardDamage(
  card: Card,
  baseDamage: number,
  damageBonus: number
): number {
  const levelMultiplier = 1 + (card.level - 1) * 0.2;
  return Math.floor((baseDamage + damageBonus) * levelMultiplier);
}
