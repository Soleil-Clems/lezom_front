"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Hash } from "lucide-react"
import { DeleteConfirmModal } from "./DeleteConfirmModal"

type ManagementCardProps = {
  id: string | number;
  label: string;
  initialValue: string;
  type: 'server' | 'channel';
  onSave: (newName: string) => void;
  onDelete: () => void;
  isPending: boolean;
  isOwner?: boolean;
}

export function ManagementCard({
  id,
  label,
  initialValue,
  type,
  onSave,
  onDelete,
  isPending,
  isOwner = false
}: ManagementCardProps) {
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const hasChanged = currentValue !== initialValue && currentValue.trim() !== "";

  return (
    <Card className="bg-[#2B2D31] border-none shadow-lg mb-4">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-end gap-4">
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
        </div>
        {isOwner && (
          <div className="pt-2 border-t border-white/5">
            <Button
              variant="outline"
              disabled={isPending}
              className="w-full border-rose-500 text-rose-400 hover:text-white hover:bg-rose-500 h-10"
              onClick={() => setShowDeleteModal(true)}
            >
              {type === 'server' ? 'Supprimer le serveur' : 'Supprimer le salon'}
            </Button>
          </div>
        )}
      </CardContent>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete();
          setShowDeleteModal(false);
        }}
        title={type === 'server' ? 'Supprimer le serveur' : 'Supprimer le salon'}
        message={`Êtes-vous sûr de vouloir supprimer ${type === 'server' ? 'le serveur' : 'le salon'}`}
        itemName={initialValue}
        isPending={isPending}
      />
    </Card>
  );
}