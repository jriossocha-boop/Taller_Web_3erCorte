import { useEffect, useState } from 'react';
import { getCachedDetailedEquipment, fetchItemDetails, fetchMagicItems } from '../services/dndApi';
import LootResult from './LootResult';

export default function LootGenerator() {
  const [cr, setCr] = useState('1');
  const [generatedLoot, setGeneratedLoot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Generando Recompensa...');
  
  const [magicItemsList, setMagicItemsList] = useState([]);

  useEffect(() => {
    const initializeLootData = async () => {
      setLoadingMessage('Preparando botín y precargando equipo...');
      setLoading(true);
      try {
        const [, magic] = await Promise.all([
          getCachedDetailedEquipment(),
          fetchMagicItems()
        ]);
        setMagicItemsList(magic);
      } catch (error) {
        console.error('Error inicializando loot:', error);
      } finally {
        setLoading(false);
        setLoadingMessage('Generando Recompensa...');
      }
    };

    initializeLootData();
  }, []);

  const classifyItem = (name, details) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('sword') || lowerName.includes('axe') || lowerName.includes('bow') || lowerName.includes('dagger') || lowerName.includes('staff') || lowerName.includes('wand')) {
      return { type: 'Arma', category: 'weapon' };
    }
    if (lowerName.includes('armor') || lowerName.includes('shield') || lowerName.includes('mail') || lowerName.includes('plate') || lowerName.includes('helmet')) {
      return { type: 'Armadura / Defensa', category: 'armor' };
    }
    if (lowerName.includes('potion') || lowerName.includes('oil') || lowerName.includes('elixir')) {
      return { type: 'Poción / Líquido', category: 'potion' };
    }
    if (lowerName.includes('scroll') || lowerName.includes('map') || lowerName.includes('book') || lowerName.includes('case')) {
      return { type: 'Pergamino / Documento', category: 'scroll' };
    }
    if (lowerName.includes('ring') || lowerName.includes('amulet') || lowerName.includes('gem') || lowerName.includes('jewel') || lowerName.includes('stone')) {
      return { type: 'Objeto Valioso / Joya', category: 'gem' };
    }
    if (details && details.equipment_category) {
      return { type: details.equipment_category.name, category: 'gear' };
    }
    return { type: 'Equipo de Aventurero', category: 'gear' };
  };

  const generateLoot = () => {
    setLoading(true);
    setLoadingMessage('Generando Recompensa...');

    setTimeout(async () => {
      const numericCr = parseFloat(cr) || 1;
      
      const coins = {
        cp: Math.floor(Math.random() * 80 * numericCr) + 10,
        sp: Math.floor(Math.random() * 40 * numericCr) + 5,
        gp: Math.floor(Math.random() * 12 * numericCr) + 2,
        pp: numericCr >= 5 ? Math.floor(Math.random() * 4 * numericCr) : 0,
      };

      let items = [];
      const maxItems = Math.min(5, Math.max(1, Math.floor(numericCr / 3) + 1));
      const itemCount = Math.floor(Math.random() * maxItems) + 1;
      const magicItemCount = numericCr >= 10 ? 2 : (numericCr >= 5 ? 1 : 0);

      if (magicItemCount > 0 && magicItemsList.length > 0) {
        const magicPromises = Array.from({ length: magicItemCount }).map(async () => {
          const randomMagic = magicItemsList[Math.floor(Math.random() * magicItemsList.length)];
          const magicDetails = await fetchItemDetails(randomMagic.url);
          
          let magicDesc = ['Objeto mágico poderoso.'];
          let magicRarity = 'Desconocida';
          let magicWeight = null;

          if (magicDetails) {
            if (magicDetails.desc) magicDesc = magicDetails.desc;
            if (magicDetails.rarity) magicRarity = magicDetails.rarity.name || magicDetails.rarity;
            if (magicDetails.weight !== undefined) magicWeight = `${magicDetails.weight} lb`;
          }

          return {
            name: `[Mágico] ${randomMagic.name}`,
            desc: magicDesc,
            cost: magicRarity,
            isMagic: true,
            weight: magicWeight,
            itemType: 'Objeto Mágico',
            category: 'gem'
          };
        });

        const resolvedMagic = await Promise.all(magicPromises);
        items.push(...resolvedMagic);
      }

      let allDetailedEquipment = await getCachedDetailedEquipment();

      if (allDetailedEquipment && allDetailedEquipment.length > 0) {
        const filteredEquipment = allDetailedEquipment.filter(({ costInGp }) => {
          if (numericCr >= 10) return costInGp >= 10;
          if (numericCr >= 5) return costInGp >= 2;
          return true;
        });

        const pool = filteredEquipment.length > 0 ? filteredEquipment : allDetailedEquipment;
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const neededCount = Math.max(1, itemCount - items.length);
        const selectedBasicItems = shuffled.slice(0, neededCount);

        const basicResolved = selectedBasicItems.map(({ item, details }) => {
          const classification = classifyItem(item.name, details);
          
          let resolvedDesc = [];
          if (details) {
            if (details.desc && details.desc.length > 0) {
              resolvedDesc = details.desc;
            } else if (details.contents && details.contents.length > 0) {
              resolvedDesc = details.contents.map(c => `${c.quantity}x ${c.item.name}`);
            }
          }

          if (resolvedDesc.length === 0) {
            resolvedDesc = [`${item.name}: objeto de equipo estándar, útil para las travesías de los aventureros.`];
          }

          return {
            name: item.name,
            desc: resolvedDesc,
            cost: details && details.cost ? `${details.cost.quantity} ${details.cost.unit}` : 'No especificado',
            isMagic: false,
            weight: details && details.weight !== undefined ? `${details.weight} lb` : 'No especificado',
            itemType: classification.type,
            category: classification.category
          };
        });

        items = [...items, ...basicResolved];
      }

      setGeneratedLoot({ coins, items, time: new Date().toLocaleTimeString() });
      setLoading(false);
    }, 100);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-xl shadow-lg space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Generador de Loot (Botín)</h2>
          <p className="text-slate-300 text-xs">Genera recompensas y objetos mágicos proporcionales al Nivel de Desafío (CR) del monstruo.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="w-full sm:w-auto flex-1">
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Nivel de Desafío (CR del Monstruo)</label>
            <select 
              value={cr} 
              onChange={(e) => setCr(e.target.value)}
              className="w-full bg-[#121212] border border-[#333333] px-4 py-2 rounded-lg text-sm text-slate-300 focus:outline-none"
            >
              <option value="1">CR 0 - 1 (Bajo)</option>
              <option value="4">CR 2 - 4 (Moderado)</option>
              <option value="8">CR 5 - 10 (Alto)</option>
              <option value="12">CR 11 - 16 (Épico)</option>
              <option value="18">CR 17+ (Legendario)</option>
            </select>
          </div>
          <button
            onClick={generateLoot}
            disabled={loading}
            className="w-full sm:w-auto bg-[#a1472b] hover:bg-[#b55232] text-white font-bold px-6 py-2.5 rounded-lg transition shadow-md self-end disabled:opacity-50"
          >
            {loading ? loadingMessage : 'Generar Recompensa'}
          </button>
        </div>
      </div>

      <LootResult loot={generatedLoot} />
    </div>
  );
}