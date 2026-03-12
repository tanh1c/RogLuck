import React from 'react';
import { useMetaStore, CHARACTER_CLASSES } from '../../store/metaStore';
import { PixelCard } from '../ui/PixelCard';
import { PixelButton } from '../ui/PixelButton';
import { Lock, X } from 'lucide-react';

interface CharacterUnlockScreenProps {
  onClose: () => void;
}

export const CharacterUnlockScreen: React.FC<CharacterUnlockScreenProps> = ({ onClose }) => {
  const { casinoCoins, unlockedCharacters, unlockCharacter, getCharacterUnlockCost } = useMetaStore();

  const handleUnlock = (characterId: string) => {
    const cost = getCharacterUnlockCost(characterId);
    if (casinoCoins >= cost) {
      unlockCharacter(characterId as any);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <PixelCard className="my-8 p-6 max-w-4xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-pixel text-casino-gold">Character Unlocks</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 text-lg font-pixel">
          Your Coins: <span className="text-casino-gold">{casinoCoins}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(CHARACTER_CLASSES).map((character) => {
            const isUnlocked = unlockedCharacters.includes(character.id);
            const cost = getCharacterUnlockCost(character.id);
            const canAfford = casinoCoins >= cost;

            return (
              <div
                key={character.id}
                className={`p-4 rounded-lg border-2 ${
                  isUnlocked
                    ? 'border-casino-gold bg-casino-gold/10'
                    : 'border-gray-700 bg-gray-800'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-pixel text-casino-gold">{character.name}</h3>
                  {!isUnlocked && <Lock className="w-4 h-4 text-gray-500" />}
                </div>

                <p className="text-xs text-gray-400 mb-3">{character.description}</p>

                <div className="text-xs text-gray-500 mb-3">
                  <div>HP: {character.maxHP} | Gold: {character.startingGold}</div>
                  <div className="text-casino-gold mt-1">{character.specialAbility}</div>
                </div>

                {isUnlocked ? (
                  <div className="text-xs text-casino-gold font-pixel">UNLOCKED</div>
                ) : (
                  <PixelButton
                    onClick={() => handleUnlock(character.id)}
                    variant={canAfford ? 'primary' : 'secondary'}
                    disabled={!canAfford}
                  >
                    Unlock ({cost})
                  </PixelButton>
                )}
              </div>
            );
          })}
        </div>
      </PixelCard>
    </div>
  );
};
