'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'

export async function getPublicLinks() {
  return prisma.link.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  })
}

export async function getAllLinks() {
  return prisma.link.findMany({
    orderBy: { order: 'asc' },
  })
}

async function saveIconFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const originalName = file.name || 'icon'
  const ext = path.extname(originalName) || '.png'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`

  const filePath = path.join(uploadsDir, filename)
  await fs.writeFile(filePath, buffer)

  return `/uploads/${filename}`
}

export async function createLink(formData: FormData) {
  const title = (formData.get('title') ?? '').toString().trim()
  const urlRaw = (formData.get('url') ?? '').toString().trim()
  const url = urlRaw || null
  const description = (formData.get('description') ?? '').toString().trim() || null
  const isCopyable = formData.get('isCopyable') === 'on' || formData.get('isCopyable') === 'true'
  const isVisible =
    formData.get('isVisible') === 'on' ||
    formData.get('isVisible') === 'true' ||
    formData.get('isVisible') === null

  if (!title) {
    throw new Error('Title is required')
  }

  const iconFile = formData.get('icon') as File | null
  const iconPath = await saveIconFile(iconFile)

  const { _max } = await prisma.link.aggregate({
    _max: { order: true },
  })

  const nextOrder = (_max.order ?? 0) + 1

  const created = await prisma.link.create({
    data: {
      title,
      url,
      iconPath,
      description,
      order: nextOrder,
      isCopyable,
      isVisible,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')

  return created
}

export async function updateLink(formData: FormData) {
  const idValue = formData.get('id')
  const id = typeof idValue === 'string' ? parseInt(idValue, 10) : NaN
  if (!id || Number.isNaN(id)) {
    throw new Error('Invalid link id')
  }

  const title = (formData.get('title') ?? '').toString().trim()
  const urlRaw = (formData.get('url') ?? '').toString().trim()
  const url = urlRaw || null
  const description = (formData.get('description') ?? '').toString().trim() || null
  const isCopyable = formData.get('isCopyable') === 'on' || formData.get('isCopyable') === 'true'
  const isVisible =
    formData.get('isVisible') === 'on' ||
    formData.get('isVisible') === 'true' ||
    formData.get('isVisible') === null

  if (!title) {
    throw new Error('Title is required')
  }

  const iconFile = formData.get('icon') as File | null
  const iconPath = await saveIconFile(iconFile)

  const updated = await prisma.link.update({
    where: { id },
    data: {
      title,
      url,
      description,
      isCopyable,
      isVisible,
      ...(iconPath ? { iconPath } : {}),
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')

  return updated
}

export async function deleteLink(formData: FormData) {
  const idValue = formData.get('id')
  const id = typeof idValue === 'string' ? parseInt(idValue, 10) : NaN
  if (!id || Number.isNaN(id)) {
    throw new Error('Invalid link id')
  }

  const deleted = await prisma.link.delete({
    where: { id },
  })

  revalidatePath('/')
  revalidatePath('/admin')

  return deleted
}

export async function reorderLinks(ids: number[]) {
  if (!Array.isArray(ids) || ids.length === 0) return

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.link.update({
        where: { id },
        data: { order: index },
      }),
    ),
  )

  revalidatePath('/')
  revalidatePath('/admin')
}

