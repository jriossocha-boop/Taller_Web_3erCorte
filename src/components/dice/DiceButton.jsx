export default function DiceButton({ label, isRolling, isSelected, onClick }) {
  return (
    <button
      disabled={isRolling}
      onClick={onClick}
      className={`w-full bg-[#121212] border border-[#333333] hover:bg-[#1a1a1a] text-white font-bold py-3 px-4 rounded-lg transition shadow flex flex-col items-center justify-center gap-1 ${isSelected ? 'bg-[#1a1a1a]' : ''}`}
    >
      <span className="text-lg text-white">{label}</span>
      <span className="text-[10px] text-slate-300 uppercase tracking-wider">
        {isRolling && isSelected ? 'Girando...' : 'Lanzar'}
      </span>
    </button>
  );
}