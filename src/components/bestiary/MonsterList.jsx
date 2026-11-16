import { useState, useEffect } from 'react';
import { fetchMonsterDetails } from '../services/dndApi';
import MonsterCard from './MonsterCard';
import MonsterDetailModal from './MonsterDetailModal';

export default function MonsterList({ monsters, loadingMonsters }) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  
  const [detailedMonsters, setDetailedMonsters] = useState({});
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  // Diccionario de traducción para mostrar en español
  const translateType = (type) => {
    const map = {
      aberration: 'Aberración', beast: 'Bestia', celestial: 'Celestial', construct: 'Constructo',
      dragon: 'Dragón', elemental: 'Elemental', fey: 'Feérico', fiend: 'Infernal',
      giant: 'Gigante', humanoid: 'Humanoide', monstrosity: 'Monstruosidad', ooze: 'Cieno',
      plant: 'Planta', undead: 'No-muerto'
    };
    return map[type?.toLowerCase()] || type;
  };

  const translateSize = (size) => {
    const map = { tiny: 'Minúsculo', small: 'Pequeño', medium: 'Mediano', large: 'Grande', huge: 'Enorme', gargantuan: 'Gargantuesco' };
    return map[size?.toLowerCase()] || size;
  };

  // Formateador de CR a fracciones estándar de D&D
  const formatCR = (cr) => ({ 0.125: '1/8', 0.25: '1/4', 0.5: '1/2' }[cr] ?? cr);

  useEffect(() => {
    if (!monsters || monsters.length === 0) return;

    let isMounted = true;
    const loadBatchDetails = async () => {
      const batchSize = 15;
      for (let i = 0; i < monsters.length; i += batchSize) {
        if (!isMounted) break;
        const chunk = monsters.slice(i, i + batchSize);
        const results = await Promise.all(
          chunk.map(async (m) => {
            const details = await fetchMonsterDetails(m.index);
            return { index: m.index, details };
          })
        );
        if (!isMounted) break;
        setDetailedMonsters(prev => {
          const next = { ...prev };
          results.forEach(r => {
            if (r.details) next[r.index] = r.details;
          });
          return next;
        });
      }
    };

    loadBatchDetails();
    return () => { isMounted = false; };
  }, [monsters]);

  const handleSelectMonster = async (index) => {
    if (detailedMonsters[index]) {
      setSelectedMonster(detailedMonsters[index]);
    } else {
      setLoadingModal(true);
      const details = await fetchMonsterDetails(index);
      if (details) {
        setDetailedMonsters(prev => ({ ...prev, [index]: details }));
        setSelectedMonster(details);
      }
      setLoadingModal(false);
    }
  };

  const filteredMonsters = monsters.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const details = detailedMonsters[m.index];

    if ((selectedType !== 'all' || selectedSize !== 'all') && !details) {
      return false;
    }

    if (!details) return matchesSearch;

    const monsterType = details.type ? details.type.toLowerCase() : '';
    const monsterSize = details.size ? details.size.toLowerCase() : '';

    const matchesType = selectedType === 'all' || monsterType === selectedType.toLowerCase();
    const matchesSize = selectedSize === 'all' || monsterSize === selectedSize.toLowerCase();

    return matchesSearch && matchesType && matchesSize;
  });

  return (
    <div className="space-y-8">
      <div className="bg-[#1a1a1a] p-5 rounded-lg border border-[#333333] shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-white">
            Bestiario de Monstruos
          </h2>
          
          <input 
            type="text"
            placeholder="Buscar monstruo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#121212] border border-[#333333] px-3.5 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-[#a1472b] w-full md:w-64"
          />
        </div>

        {/* Filtros de Tipo y Tamaño (Sin 'capitalize' en el select de tipo para unificar estilos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#333333]">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Filtrar por Tipo</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#121212] border border-[#333333] px-3 py-2 rounded-lg text-sm text-slate-300 focus:outline-none"
            >
              <option value="all">Todos los tipos</option>
              <option value="aberration">Aberración</option>
              <option value="beast">Bestia</option>
              <option value="celestial">Celestial</option>
              <option value="construct">Constructo</option>
              <option value="dragon">Dragón</option>
              <option value="elemental">Elemental</option>
              <option value="fey">Feérico</option>
              <option value="fiend">Infernal</option>
              <option value="giant">Gigante</option>
              <option value="humanoid">Humanoide</option>
              <option value="monstrosity">Monstruosidad</option>
              <option value="ooze">Cieno</option>
              <option value="plant">Planta</option>
              <option value="undead">No-muerto</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Filtrar por Tamaño</label>
            <select 
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full bg-[#121212] border border-[#333333] px-3 py-2 rounded-lg text-sm text-slate-300 focus:outline-none"
            >
              <option value="all">Todos los tamaños</option>
              <option value="tiny">Minúsculo</option>
              <option value="small">Pequeño</option>
              <option value="medium">Mediano</option>
              <option value="large">Grande</option>
              <option value="huge">Enorme</option>
              <option value="gargantuan">Gargantuesco</option>
            </select>
          </div>
        </div>
      </div>

      {loadingMonsters ? (
        <div className="text-center py-16 text-slate-300 font-medium">Cargando bestiario...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredMonsters.map((monster) => {
            const details = detailedMonsters[monster.index];
            const armorClass = details ? (Array.isArray(details.armor_class) ? details.armor_class[0]?.value : details.armor_class) : null;
            
            const statsProps = details ? [
              { label: 'Tipo', value: translateType(details.type) },
              { label: 'Tamaño', value: translateSize(details.size) },
              { label: 'CA', value: armorClass || 'N/A' },
              { label: 'PG', value: details.hit_points || 'N/A' },
              { label: 'CR', value: formatCR(details.challenge_rating) }
            ] : [];

            return (
              <MonsterCard 
                key={monster.index} 
                title={monster.name}
                stats={statsProps}
                onClick={() => handleSelectMonster(monster.index)} 
              />
            );
          })}
        </div>
      )}

      {loadingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-[#333333] px-6 py-4 rounded-lg text-white font-medium text-sm">
            Cargando detalles de la criatura...
          </div>
        </div>
      )}

      <MonsterDetailModal 
        monster={selectedMonster} 
        onClose={() => setSelectedMonster(null)} 
      />
    </div>
  );
}