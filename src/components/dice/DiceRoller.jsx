import { useState } from 'react';
import DiceButton from './DiceButton';

const DICE_TYPES = [
  { sides: 4, label: 'd4' },
  { sides: 6, label: 'd6' },
  { sides: 8, label: 'd8' },
  { sides: 10, label: 'd10' },
  { sides: 12, label: 'd12' },
  { sides: 20, label: 'd20' },
  { sides: 100, label: 'd100' },
];

const BRIGHT_COLORS = [
  { name: 'Rojo Neón', value: '#ef4444' },
  { name: 'Ámbar Brillante', value: '#f59e0b' },
  { name: 'Esmeralda', value: '#10b981' },
  { name: 'Azul Eléctrico', value: '#3b82f6' },
  { name: 'Púrpura Mágico', value: '#8b5cf6' },
];

export default function DiceRoller() {
  const [history, setHistory] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [selectedSides, setSelectedSides] = useState(20);
  const [customColor, setCustomColor] = useState('#f59e0b');
  const [isRolling, setIsRolling] = useState(false);
  const [animatingNumber, setAnimatingNumber] = useState(20);

  const rollDice = (sides) => {
    if (isRolling) return;
    setSelectedSides(sides);
    setIsRolling(true);

    // Corrección exacta del d100 (rango de 1 a 100)
    const finalResult = sides === 100 
      ? Math.floor(Math.random() * 100) + 1 
      : Math.floor(Math.random() * sides) + 1;

    let counter = 0;
    const interval = setInterval(() => {
      setAnimatingNumber(Math.floor(Math.random() * sides) + 1);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        setAnimatingNumber(finalResult);
        setIsRolling(false);
        
        const rollData = { sides, result: finalResult, time: new Date().toLocaleTimeString() };
        setCurrentResult(rollData);
        setHistory(prev => [rollData, ...prev.slice(0, 9)]);
      }
    }, 60);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-xl shadow-lg space-y-6 text-center">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Bandeja de Dados</h2>
          <p className="text-slate-300 text-xs">Selecciona un tipo de dado para realizar tu tirada en tiempo real.</p>
        </div>

        <div className="w-full h-48 bg-[#121212] border border-[#333333] rounded-lg flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
          <span className="absolute top-3 left-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
            Dado d{selectedSides}
          </span>
          
          <div className={`transition-transform duration-75 ${isRolling ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
            <div 
              className="w-24 h-24 rounded-2xl border-2 flex items-center justify-center shadow-2xl mx-auto"
              style={{ borderColor: customColor, backgroundColor: '#1a1a1a' }}
            >
              <span 
                className={`text-4xl font-black ${isRolling ? 'animate-bounce text-slate-300' : 'text-white'}`}
                style={{ color: isRolling ? undefined : customColor }}
              >
                {animatingNumber}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-slate-300 uppercase tracking-widest mt-3">
            {isRolling ? 'Lanzando...' : 'Listo para tirar'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#121212] p-3 rounded-lg border border-[#333333]">
          <span className="text-xs font-bold text-slate-300 uppercase">Personalizar Color de los Dados:</span>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {BRIGHT_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setCustomColor(c.value)}
                  className={`w-7 h-7 rounded-full border-2 transition ${customColor === c.value ? 'border-white scale-110 shadow-md' : 'border-[#333333]'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 border-l border-[#333333] pl-3">
              <input 
                type="color" 
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-7 h-7 rounded bg-transparent cursor-pointer border-0"
                title="Elegir color personalizado"
              />
              <span className="text-[10px] text-slate-300 font-mono uppercase">{customColor}</span>
            </div>
          </div>
        </div>

        {/* Botonera de Dados reutilizando DiceButton sin duplicar código */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DICE_TYPES.map((d) => (
            <div 
              key={d.sides} 
              style={{ borderColor: selectedSides === d.sides ? customColor : 'transparent' }} 
              className="rounded-lg border-2 transition"
            >
              <DiceButton 
                label={d.label}
                isRolling={isRolling}
                isSelected={selectedSides === d.sides}
                onClick={() => rollDice(d.sides)}
              />
            </div>
          ))}
        </div>
      </div>

      {currentResult && (
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-6 text-center shadow-xl">
          <p className="text-xs text-slate-300 uppercase tracking-widest mb-1">Resultado d{currentResult.sides}</p>
          <p className="text-5xl font-black text-white animate-pulse" style={{ color: customColor }}>
            {currentResult.result}
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-5 shadow-lg">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">Historial de Tiradas</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="flex justify-between items-center bg-[#121212] border border-[#333333] px-4 py-2.5 rounded-lg text-sm">
                <span className="text-slate-300">Dado d{h.sides}</span>
                <span className="font-bold text-white">{h.result}</span>
                <span className="text-xs text-slate-300">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}