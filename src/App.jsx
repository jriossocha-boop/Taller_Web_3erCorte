import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MonsterList from './components/bestiary/MonsterList';
import LootGenerator from './components/loot/LootGenerator';
import DiceRoller from './components/dice/DiceRoller';
import { fetchMonsters } from './components/services/dndApi';

export default function App() {
  const [activeTab, setActiveTab] = useState('bestiary');

  const [monsters, setMonsters] = useState([]);
  const [loadingMonsters, setLoadingMonsters] = useState(true);

  useEffect(() => {
    const loadGlobalBestiary = async () => {
      setLoadingMonsters(true);
      const data = await fetchMonsters();
      setMonsters(data);
      setLoadingMonsters(false);
    };
    loadGlobalBestiary();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 flex flex-col justify-between font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeTab === 'bestiary' && (
          <MonsterList 
            monsters={monsters}
            loadingMonsters={loadingMonsters}
          />
        )}
        {activeTab === 'loot' && <LootGenerator />}
        {activeTab === 'dice' && <DiceRoller />}
      </main>

      <Footer />
    </div>
  );
}