'use client';

export function ProjectSkeleton() {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-lg animate-pulse h-full">
      {/* Imagem Placeholder */}
      <div className="h-48 bg-slate-800/50"></div>
      
      <div className="p-6 space-y-4">
        {/* Título */}
        <div className="h-6 bg-slate-800 rounded w-3/4"></div>
        {/* Descrição */}
        <div className="space-y-2">
          <div className="h-3 bg-slate-800 rounded w-full"></div>
          <div className="h-3 bg-slate-800 rounded w-5/6"></div>
          <div className="h-3 bg-slate-800 rounded w-4/6"></div>
        </div>
        {/* Tags */}
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-12 bg-slate-800 rounded"></div>
          <div className="h-5 w-12 bg-slate-800 rounded"></div>
          <div className="h-5 w-12 bg-slate-800 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function ExperienceSkeleton() {
  return (
    <div className="relative pl-8 pb-12 animate-pulse">
      {/* Linha vertical */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-slate-800"></div>
      <div className="absolute -left-[9px] top-1.5 w-5 h-5 rounded-full bg-slate-800 border-4 border-slate-900"></div>

      <div className="space-y-3">
        <div className="h-6 bg-slate-800 rounded w-1/3"></div>
        <div className="h-4 bg-slate-800 rounded w-1/4"></div>
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-slate-800 rounded w-full"></div>
          <div className="h-3 bg-slate-800 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}
