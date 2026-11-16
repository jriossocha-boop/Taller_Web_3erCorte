import { useState } from 'react';

const ItemIcon = ({ category, itemName }) => {
  const name = itemName ? itemName.toLowerCase() : '';

  if (category === 'mounts' || name.includes('horse') || name.includes('pony') || name.includes('camel') || name.includes('mastiff') || name.includes('elephant') || name.includes('barding')) {
    return (
      <svg className="w-5 h-5 text-[#a1472b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.5C3 11 2 9 2 7c0-2.5 2-4 4-4 1.5 0 3 1 4 2.5C11 5 12.5 4 14 4c2 0 4 1.5 4 4 0 1.5-.5 3-2 4.5l-4 4.5H9l-4.5-4.5z" />
      </svg>
    );
  }

  if (category === 'weapon' || name.includes('sword') || name.includes('axe') || name.includes('bow') || name.includes('dagger') || name.includes('staff') || name.includes('wand')) {
    return (
      <svg className="w-5 h-5 text-[#a1472b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 3.5L20.5 9.5M4.5 19.5L9.5 14.5M19 5L5 19" />
      </svg>
    );
  }

  if (category === 'armor' || name.includes('shield') || name.includes('armor') || name.includes('mail') || name.includes('plate') || name.includes('helmet')) {
    return (
      <svg className="w-5 h-5 text-[#a1472b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }

  return (
    <svg className="w-5 h-5 text-[#a1472b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
};

export default function LootResult({ loot }) {
  const [selectedItem, setSelectedItem] = useState(null);

  if (!loot) return null;

  return (
    <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-6 space-y-6 shadow-lg">
      <div className="flex justify-between items-center border-b border-[#333333] pb-3">
        <h3 className="text-lg font-bold text-white">Recompensas Obtenidas</h3>
        <span className="text-xs text-slate-300">{loot.time}</span>
      </div>

      {/* Bloque de Monedas */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">Monedas</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(loot.coins).map(([coin, amount]) => (
            <div key={coin} className="bg-[#121212] border border-[#333333] p-3 rounded-lg text-center">
              <span className="block text-[10px] text-slate-300 uppercase font-bold">{coin}</span>
              <span className="text-lg font-bold text-white">{amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bloque de Tesoros */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">Objetos y Tesoros (Haz clic para ver descripción)</h4>
        {loot.items.length === 0 ? (
          <p className="text-xs text-slate-300 italic">No se encontraron objetos de valor en esta ocasión.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {loot.items.map((item, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedItem(item)}
                className="flex justify-between items-center bg-[#121212] border border-[#333333] hover:border-[#a1472b] px-4 py-3 rounded-lg text-sm cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#333333] flex items-center justify-center flex-shrink-0 shadow">
                    <ItemIcon category={item.category} itemName={item.name} />
                  </div>
                  <span className="font-medium text-slate-200">{item.name}</span>
                </div>
                <span className="text-[10px] bg-[#262626] text-slate-300 px-2.5 py-1 rounded border border-[#333333] uppercase font-bold">Ver Detalles</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] border border-[#333333] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-[#333333] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#333333] flex items-center justify-center flex-shrink-0 shadow">
                  <ItemIcon category={selectedItem.category} itemName={selectedItem.name} />
                </div>
                <h4 className="text-lg font-bold text-white">{selectedItem.name}</h4>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-slate-300 hover:text-white bg-[#1a1a1a] hover:bg-[#333333] px-3 py-1 rounded text-xs font-medium border border-[#333333] transition"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              {/* Etiqueta condicional: Muestra "Rareza" si es objeto mágico, o "Costo" si es equipo normal */}
              <p><strong className="text-white">{selectedItem.isMagic ? 'Rareza' : 'Costo'}:</strong> {selectedItem.cost}</p>
              
              {/* Muestra el peso solo si la API lo trae o existe */}
              {selectedItem.weight && (
                <p><strong className="text-white">Peso:</strong> {selectedItem.weight}</p>
              )}
              
              <p><strong className="text-white">Tipo:</strong> {selectedItem.itemType}</p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#333333] p-4 rounded-lg space-y-2 max-h-48 overflow-y-auto text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block uppercase text-[10px] tracking-wider mb-1">Descripción:</strong>
              {Array.isArray(selectedItem.desc) ? (
                selectedItem.desc.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <p>{selectedItem.desc}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}