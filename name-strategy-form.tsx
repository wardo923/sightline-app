"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NameStrategyForm({
  defaultName,
  onSave,
}: {
  defaultName: string
  onSave: (name: string) => void
}) {
  const [name, setName] = useState(defaultName)

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-4">
      <label className="mb-2 block text-sm text-muted-foreground">
        Name Your Strategy
      </label>

      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter strategy name"
        className="mb-4"
      />

      <Button
        onClick={() => onSave(name.trim() || defaultName)}
        className="w-full"
      >
        Save Strategy
      </Button>
    </div>
  )
}
