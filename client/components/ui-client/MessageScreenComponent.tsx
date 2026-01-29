// MessageScreenComponent.tsx
import React from "react";

export default function MessageScreenComponent() {
  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-indigo-400">Utilisateur 1</span>
        <div className="bg-[#383a40] p-3 rounded-r-xl rounded-bl-xl text-zinc-200 max-w-[80%]">
          On est pas des zhommmmes nous ???
        </div>
      </div>
      
      <div className="flex flex-col gap-1 items-end">
        <span className="text-xs font-bold text-emerald-400">Moi</span>
        <div className="bg-indigo-600 p-3 rounded-l-xl rounded-br-xl text-white max-w-[80%]">
        J'ai des pecs solaires frere !        </div>
      </div>
    </div>
  );
}