"use client"

import type React from "react"
import { useState, useTransition } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { reorderLinks, createLink, updateLink, deleteLink } from "@/app/actions/links"
import { useToast } from "@/hooks/use-toast"
import { SortableItem } from "@/components/sortable-link-item"

type Link = {
  id: number
  title: string
  url: string
  description: string | null
  iconPath: string | null
  order: number
  isCopyable: boolean
  isVisible: boolean
}

interface LinkAdminClientProps {
  initialLinks: Link[]
}

export function LinkAdminClient({ initialLinks }: LinkAdminClientProps) {
  const [links, setLinks] = useState<Link[]>([...initialLinks].sort((a, b) => a.order - b.order))
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [isCopyable, setIsCopyable] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = links.findIndex((l) => l.id === active.id)
    const newIndex = links.findIndex((l) => l.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const newItems = arrayMove(links, oldIndex, newIndex).map((link, index) => ({
      ...link,
      order: index,
    }))
    setLinks(newItems)

    startTransition(async () => {
      try {
        await reorderLinks(newItems.map((l) => l.id))
        toast({ title: "Order updated" })
      } catch (error) {
        console.error(error)
        toast({ title: "Failed to update order", variant: "destructive" })
      }
    })
  }

  const handleEditSelect = (link: Link) => {
    setEditingLink(link)
    setTitle(link.title)
    setUrl(link.url)
    setDescription(link.description ?? "")
    setIsCopyable(link.isCopyable)
    setIsVisible(link.isVisible)
  }

  const handleDelete = (id: number) => {
    if (!confirm("Delete this link?")) return

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("id", String(id))
        const deleted = await deleteLink(formData)
        setLinks((prev) => prev.filter((link) => link.id !== deleted.id))
        // If we were editing this link, reset the form
        if (editingLink?.id === deleted.id) {
          resetForm()
        }
        toast({ title: "Link deleted" })
      } catch (error) {
        console.error(error)
        toast({ title: "Failed to delete link", variant: "destructive" })
      }
    })
  }

  const resetForm = () => {
    setEditingLink(null)
    setTitle("")
    setUrl("")
    setDescription("")
    setIsCopyable(false)
    setIsVisible(true)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isEditing = !!editingLink
    const form = event.currentTarget
    const formData = new FormData()

    if (isEditing && editingLink) {
      formData.append("id", String(editingLink.id))
    }

    formData.append("title", title.trim())
    formData.append("url", url.trim())
    formData.append("description", description.trim())

    const iconInput = form.elements.namedItem("icon") as HTMLInputElement | null
    const file = iconInput?.files?.[0]
    if (file) {
      formData.append("icon", file)
    }

    if (isCopyable) {
      formData.append("isCopyable", "true")
    }

    formData.append("isVisible", isVisible ? "true" : "false")

    startTransition(async () => {
      try {
        if (isEditing) {
          const updated = await updateLink(formData)
          setLinks((prev) =>
            prev.map((link) => (link.id === updated.id ? updated : link)),
          )
          toast({ title: "Link updated" })
        } else {
          const created = await createLink(formData)
          setLinks((prev) => [...prev, created].sort((a, b) => a.order - b.order))
          toast({ title: "Link created" })
        }
        resetForm()
      } catch (error) {
        console.error(error)
        toast({ title: "Failed to save link", variant: "destructive" })
      }
    })
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-5xl grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        <section className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight">Manage Links</h1>
          <p className="text-sm text-muted-foreground">
            Drag and drop to reorder your links. Changes are saved automatically.
          </p>

          <Card className="p-4 border border-zinc-800 bg-zinc-950/60 backdrop-blur">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                  {links.map((link) => (
                    <SortableItem
                      key={link.id}
                      id={link.id}
                      link={link}
                      onEdit={() => handleEditSelect(link)}
                      onDelete={() => handleDelete(link.id)}
                    />
                  ))}
                  {links.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No links yet. Add your first link using the form.
                    </p>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Add / Edit Link</h2>
          <Card className="p-4 border border-zinc-800 bg-zinc-950/60 backdrop-blur">
            <form
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              {editingLink && (
                <p className="text-xs text-muted-foreground">
                  Editing link <span className="font-mono text-foreground">#{editingLink.id}</span>
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Link title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL (optional)</Label>
                <Input
                  id="url"
                  name="url"
                  type="text"
                  placeholder="https://example.com or leave empty for text-only"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Short text to show under the title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon image</Label>
                <Input
                  id="icon"
                  name="icon"
                  type="file"
                  accept="image/*"
                />
                <p className="text-xs text-muted-foreground">
                  Uploaded icons are stored under <code>/public/uploads</code>.
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="isCopyable"
                    checked={isCopyable}
                    onCheckedChange={(checked) => setIsCopyable(Boolean(checked))}
                  />
                  <Label htmlFor="isCopyable">Copy to clipboard</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="isVisible"
                    checked={isVisible}
                    onCheckedChange={(checked) => setIsVisible(Boolean(checked))}
                  />
                  <Label htmlFor="isVisible">Visible</Label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Saving..." : editingLink ? "Save changes" : "Add link"}
                </Button>
                {editingLink && (
                  <Button
                    type="button"
                    variant="outline"
                    className="whitespace-nowrap"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </section>
      </div>
    </main>
  )
}

