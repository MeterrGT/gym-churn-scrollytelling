export default function Loading() {
  return (
    <div className="min-h-screen bg-[#09080e] flex flex-col items-center justify-center relative px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#b829ea]/20 border-t-[#c77dff] animate-spin" />
        <span className="font-mono text-xs text-slate-400 tracking-wider uppercase animate-pulse">
          Yükleniyor...
        </span>
      </div>
    </div>
  );
}
