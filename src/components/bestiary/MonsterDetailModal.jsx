export default function MonsterDetailModal({ monster, onClose }) {
  if (!monster) return null;

  const translateSize = (size) => {
    const map = { Tiny: 'Minúsculo', Small: 'Pequeño', Medium: 'Mediano', Large: 'Grande', Huge: 'Enorme', Gargantuan: 'Gargantuesco' };
    return map[size] || size;
  };

  const translateType = (type) => {
    const map = {
      aberration: 'Aberración', beast: 'Bestia', celestial: 'Celestial', construct: 'Constructo',
      dragon: 'Dragón', elemental: 'Elemental', fey: 'Feérico', fiend: 'Infernal',
      giant: 'Gigante', humanoid: 'Humanoide', monstrosity: 'Monstruosidad', ooze: 'Cieno',
      plant: 'Planta', undead: 'No-muerto'
    };
    return map[type] || type;
  };

  const armorClassValue = Array.isArray(monster.armor_class) 
    ? monster.armor_class[0]?.value 
    : monster.armor_class;

  const monsterImageUrl = monster.image 
    ? `https://www.dnd5eapi.co${monster.image}` 
    : null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-[#121212] border border-[#333333] rounded-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl text-white flex flex-col">
        
        {/* Cabecera superior */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-[#333333] bg-[#7f1d1d] sticky top-0 z-20 gap-3">
          <div>
            <h2 className="text-3xl font-light tracking-wide text-white">{monster.name}</h2>
            <p className="text-xs text-slate-300 uppercase tracking-widest mt-1">
              {translateSize(monster.size)} {translateType(monster.type)} {monster.subtype ? `(${monster.subtype})` : ''} — {monster.alignment || 'Sin alineamiento'}
            </p>
          </div>

          {/* Botón de cerrar: Resaltado en móviles debajo del nombre, y alineado a la derecha en escritorio */}
          <button 
            onClick={onClose}
            className="w-full sm:w-auto bg-[#a1472b] hover:bg-[#b55232] text-white px-5 py-2 rounded text-sm font-bold transition border border-amber-500 shadow-md text-center"
          >
            Cerrar
          </button>
        </div>

        {/* Cuerpo principal en grid responsivo */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda (Sinopsis, Atributos y Acciones) */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            
            <div className="bg-[#1a1a1a] border border-[#333333] p-5 rounded-lg">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Sinopsis y Rasgos
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {monster.name} es una criatura de tipo {translateType(monster.type).toLowerCase()} catalogada con un nivel de desafío de {monster.challenge_rating ?? 'N/A'}. Su presencia en las partidas de Dungeons & Dragons representa un desafío táctico considerable para los aventureros.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Estadísticas de Atributo</h3>
              <div className="grid grid-cols-6 gap-2 text-center">
                {[
                  { label: 'FUE', val: monster.strength },
                  { label: 'DES', val: monster.dexterity },
                  { label: 'CON', val: monster.constitution },
                  { label: 'INT', val: monster.intelligence },
                  { label: 'SAB', val: monster.wisdom },
                  { label: 'CAR', val: monster.charisma },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#1a1a1a] border border-[#333333] p-2.5 rounded">
                    <span className="block text-[10px] text-slate-300 font-bold">{stat.label}</span>
                    <span className="text-base font-bold text-white">{stat.val ?? '-'}</span>
                  </div>
                ))}
              </div>
            </div>

            {monster.actions && monster.actions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#333333] pb-2">
                  Acciones de Combate
                </h3>
                {monster.actions.map((action, idx) => (
                  <div key={idx} className="bg-[#1a1a1a] border border-[#333333] p-4 rounded-lg">
                    <p className="font-bold text-white text-sm mb-1">{action.name}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{action.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha (Imagen y Ficha Técnica) */}
          <div className="space-y-4 order-1 lg:order-2">
            <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg overflow-hidden shadow-lg">
              
              <div className="bg-[#7f1d1d] text-white text-center py-2.5 font-bold text-sm tracking-wide border-b border-[#333333]">
                {monster.name}
              </div>
              
              <div className="bg-black/40 h-56 flex items-center justify-center border-b border-[#333333] overflow-hidden relative">
                {monsterImageUrl ? (
                  <img 
                    src={monsterImageUrl} 
                    alt={monster.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="text-sm text-slate-300 font-semibold uppercase tracking-wider">Sin Imagen</div>
                )}
              </div>

              <div className="bg-[#262626] text-white text-center py-2 font-bold text-xs uppercase tracking-wider flex justify-between items-center px-4 border-b border-[#333333]">
                <span>Información</span>
                <span className="text-slate-300">▲</span>
              </div>

              <div className="divide-y divide-[#333333] text-xs">
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-300">Clase de Armadura:</span>
                  <span className="font-medium text-white">{armorClassValue || 'N/A'}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-300">Puntos de Golpe:</span>
                  <span className="font-medium text-white">{monster.hit_points || 'N/A'}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-300">Nivel de Desafío (CR):</span>
                  <span className="font-medium text-white">{monster.challenge_rating ?? 'N/A'}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-300">Experiencia (XP):</span>
                  <span className="font-medium text-white">{monster.xp || 'N/A'}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-300">Tipo:</span>
                  <span className="font-medium text-white capitalize">{translateType(monster.type)}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-300">Tamaño:</span>
                  <span className="font-medium text-white">{translateSize(monster.size)}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}