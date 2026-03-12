import { useCallback, useRef } from 'react';
import { Howl } from 'howler';

// Sound effect URLs using base64 placeholders (replace with actual sound files)
const SOUND_EFFECTS: Record<string, string> = {
  card_flip: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  dice_roll: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  win: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  lose: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  coin: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  damage: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  heal: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  button_click: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
};

// Simple synthesized sounds for development
const createSynthSound = (type: string): Howl => {
  // For now, return a silent sound - replace with actual sounds later
  return new Howl({
    src: [SOUND_EFFECTS[type] || SOUND_EFFECTS.button_click],
    volume: 0.5,
  });
};

export function useSound() {
  const soundsRef = useRef<Record<string, Howl>>({});
  const enabledRef = useRef(true);

  const play = useCallback((soundName: string) => {
    if (!enabledRef.current) return;

    if (!soundsRef.current[soundName]) {
      soundsRef.current[soundName] = createSynthSound(soundName);
    }

    const sound = soundsRef.current[soundName];
    sound.stop();
    sound.play();
  }, []);

  const toggle = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  const playCardFlip = useCallback(() => play('card_flip'), [play]);
  const playDiceRoll = useCallback(() => play('dice_roll'), [play]);
  const playWin = useCallback(() => play('win'), [play]);
  const playLose = useCallback(() => play('lose'), [play]);
  const playCoin = useCallback(() => play('coin'), [play]);
  const playDamage = useCallback(() => play('damage'), [play]);
  const playHeal = useCallback(() => play('heal'), [play]);
  const playButtonClick = useCallback(() => play('button_click'), [play]);

  return {
    play,
    playCardFlip,
    playDiceRoll,
    playWin,
    playLose,
    playCoin,
    playDamage,
    playHeal,
    playButtonClick,
    toggle,
  };
}
