export default function MonsterCard({ title, stats = [], onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-[#1a1a1a] border border-[#333333] hover:border-[#a1472b] p-4 rounded-lg cursor-pointer transition shadow-md flex flex-col justify-between"
    >
      <div>
        <h3 className="text-base font-bold text-white mb-2">{title}</h3>
        {stats.length > 0 ? (
          <div className="space-y-1 text-xs text-slate-300">
            {stats.map((stat, idx) => (
              <p key={idx}><strong className="text-white">{stat.label}:</strong> {stat.value}</p>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-300 italic">Cargando estadísticas...</p>
        )}
      </div>
      <span className="mt-4 text-[10px] bg-[#262626] text-slate-300 px-2.5 py-1 rounded border border-[#333333] uppercase font-bold text-center">
        Ver Ficha
      </span>
    </div>
  );
}