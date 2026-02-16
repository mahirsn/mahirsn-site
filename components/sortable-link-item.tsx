"use client"

import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import { GripVertical, Eye, EyeOff, Copy, Link2, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Link = {
  id: number
  title: string
  url: string
  iconPath: string | null
  isCopyable: boolean
  isVisible: boolean
}

interface SortableItemProps {
  id: number
  link: Link
  onEdit: () => void
  onDelete: () => void
}

export function SortableItem({ id, link, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm",
        isDragging && "border-neon/60 shadow-[0_0_20px_oklch(0.8_0.18_142_/_0.3)]",
      )}
    >
      <button
        type="button"
        className="cursor-grab text-zinc-500 hover:text-zinc-300"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800/80 border border-zinc-700/60 overflow-hidden">
          {link.iconPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={link.iconPath}
              alt={link.title}
              className="h-5 w-5 object-contain"
            />
          ) : (
            <Link2 className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{link.title}</p>
          <p className="text-xs text-muted-foreground truncate">{link.url}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          {link.isCopyable ? <Copy className="h-3 w-3" /> : <Link2 className="h-3 w-3" />}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          {link.isVisible ? (
            <>
              <Eye className="h-3 w-3" /> Visible
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3" /> Hidden
            </>
          )}
        </span>
        <div className="flex items-center gap-1 ml-1">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Edit link"
            onClick={onEdit}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Delete link"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  )
}

