import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { ShoppingBag, X } from 'lucide-react';
import { PixelCard } from '../ui/PixelCard';

interface ShopProps {
  onExit: () => void;
}

export const Shop: React.FC<ShopProps> = ({ onExit }) => {
  const { gold, spendGold } = useGameStore();

  const shopItems = [
    { id: 1, type: 'card', name: 'Random Card', cost: 75, description: 'Add a random card to your deck' },
    { id: 2, type: 'remove', name: 'Remove Card', cost: 50, description: 'Remove a card from your deck' },
    { id: 3, type: 'potion', name: 'Health Potion', cost: 40, description: 'Restore 30 HP' },
    { id: 4, type: 'upgrade', name: 'Card Upgrade', cost: 100, description: 'Upgrade a card (in-run)' },
  ];

  const buyItem = (item: typeof shopItems[0]) => {
    if (gold >= item.cost) {
      spendGold(item.cost);
      // Handle item purchase logic here
    }
  };

  return (
    <PixelCard className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-casino-gold" />
          <h2 className="text-xl font-pixel text-casino-gold">Casino Shop</h2>
        </div>
        <button
          onClick={onExit}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-6 text-lg font-pixel">
        💰 Gold: <span className="text-casino-gold font-bold">{gold}</span>
      </div>

      <div className="grid gap-4">
        {shopItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-4 bg-gray-800 rounded-lg ${
              gold < item.cost ? 'opacity-50' : 'hover:bg-gray-700 cursor-pointer'
            } transition-colors`}
            onClick={() => buyItem(item)}
          >
            <div>
              <h3 className="font-pixel text-sm mb-1">{item.name}</h3>
              <p className="text-gray-400 text-xs">{item.description}</p>
            </div>
            <div className="text-casino-gold font-pixel text-sm">
              💰 {item.cost}
            </div>
          </div>
        ))}
      </div>
    </PixelCard>
  );
};
