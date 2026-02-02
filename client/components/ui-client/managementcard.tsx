"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, Save, Hash } from "lucide-react"

type ManagementCardProps = {
  id: string | number;
  label: string;
  initialValue: string;
  type: 'server' | 'channel';
  onSave: (newName: string) => void;
  onDelete: () => void;
  isPending: boolean;
}

export function ManagementCard({ 
  id, 
  label, 
  initialValue, 
  type, 
  onSave, 
  onDelete, 
  isPending 
}: ManagementCardProps) {
  const [currentValue, setCurrentValue] = useState(initialValue);
  const hasChanged = currentValue !== initialValue && currentValue.trim() !== "";

  return (
    <Card className="bg-[#2B2D31] border-none shadow-lg mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={isPending}
          className="h-8 w-8 p-0 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10"
          onClick={() => {
            if(confirm(`Voulez-vous vraiment supprimer ce ${type === 'server' ? 'serveur' : 'salon'} ?`)) {
              onDelete();
            }
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex items-end gap-4 p-6 pt-0">
        <div className="flex-1 space-y-1.5">
          <Label className="text-zinc-400 text-[11px] font-bold uppercase">{label}</Label>
          <div className="relative">
            {type === 'channel' && <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />}
            <Input 
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className={`bg-[#1E1F22] border-none text-white focus-visible:ring-1 ${type === 'channel' ? 'pl-9' : ''} focus-visible:ring-indigo-500`} 
            />
          </div>
        </div>
        <Button 
          disabled={!hasChanged || isPending}
          className="bg-indigo-500 hover:bg-indigo-600 h-10 px-6"
          onClick={() => onSave(currentValue)}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Enregistrer
        </Button>
      </CardContent>
    </Card>
  );
}