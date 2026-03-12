import React from 'react';
import { CHARACTER_CLASSES, CharacterClass } from '../../types/characters';
import { useMetaStore } from '../../store/metaStore';
import { Lock } from 'lucide-react';

interface CharacterSelectProps {
  onCharacterSelected: (character: CharacterClass) => void;
  onBack: () => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  onCharacterSelected,
  onBack,
}) => {
  const { unlockedCharacters } = useMetaStore();

  const handleSelect = (characterId: CharacterClass) => {
    if (unlockedCharacters.includes(characterId)) {
      onCharacterSelected(characterId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-pixel text-center mb-8 text-casino-gold">
        Select Your Character
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(CHARACTER_CLASSES).map((character) => {
          const isUnlocked = unlockedCharacters.includes(character.id);

          return (
            <div
              key={character.id}
              className={`relative p-6 rounded-lg border-2 transition-all cursor-pointer pixel-border ${
                isUnlocked
                  ? 'bg-casino-purple/20 border-casino-purple hover:border-casino-gold'
                  : 'bg-gray-800 border-gray-700 opacity-50'
              }`}
              onClick={() => handleSelect(character.id)}
            >
              {!isUnlocked && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-6 h-6 text-gray-500" />
                </div>
              )}

              <h3 className="text-lg font-pixel mb-2 text-casino-gold">{character.name}</h3>
              <p className="text-gray-400 text-xs mb-4 leading-relaxed">{character.description}</p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>❤️ HP:</span>
                  <span className="font-medium">{character.maxHP}</span>
                </div>
                <div className="flex justify-between">
                  <span>💰 Gold:</span>
                  <span className="font-medium">{character.startingGold}</span>
                </div>
                <div className="flex justify-between">
                  <span>🃏 Cards:</span>
                  <span className="font-medium">{character.startingDeck.length}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-casino-gold font-pixel">{character.specialAbility}</p>
              </div>

              {!isUnlocked && (
                <div className="mt-4 text-xs text-gray-500 font-pixel">
                  🔒 {character.unlockRequirement}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onBack}
        className="mt-8 px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors btn-pixel"
      >
        ← Back to Menu
      </button>
    </div>
  );
};
