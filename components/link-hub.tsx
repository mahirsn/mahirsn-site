"use client"

import { useState } from "react"
import { motion, cubicBezier } from "framer-motion"
import {
  Gamepad2,
  MessageCircle,
  Youtube,
  Instagram,
  Map,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react"
import NextImage from "next/image"
import { useToast } from "@/hooks/use-toast"

export type LinkItem = {
  id: number
  title: string
  url: string
  description?: string | null
  icon?: string | null
  iconPath?: string | null
  copy?: boolean
}

const iconMap: Record<string, typeof Gamepad2> = {
  Gamepad2,
  MessageCircle,
  Youtube,
  Instagram,
  Map,
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const easeCurve = cubicBezier(0.22, 1, 0.36, 1)

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeCurve,
    },
  },
}

function LinkCard({ link }: { link: LinkItem }) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const Icon = link.icon ? iconMap[link.icon] ?? Map : Map

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const valueToCopy = link.url || link.description || ""
      await navigator.clipboard.writeText(valueToCopy)
      setCopied(true)
      toast({
        title: "Link copied",
        description: link.title,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: "Failed to copy",
        variant: "destructive",
      })
    }
  }

  const Wrapper = link.copy || !link.url ? "div" : "a"
  const wrapperProps =
    link.copy || !link.url
      ? {}
      : { href: link.url, target: "_blank" as const, rel: "noopener noreferrer" as const }

  return (
    <motion.div variants={itemVariants}>
      <Wrapper
        {...wrapperProps}
        className="group relative flex items-center gap-4 px-5 py-4 rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md transition-all duration-300 hover:border-neon/50 hover:shadow-[0_0_20px_oklch(0.8_0.18_142_/_0.15)] cursor-pointer"
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-zinc-800/80 border border-zinc-700/50 group-hover:border-neon/40 group-hover:bg-neon/10 transition-all duration-300 shrink-0">
          {link.iconPath ? (
            <div className="relative w-5 h-5">
              <NextImage
                src={link.iconPath}
                alt={link.title}
                fill
                sizes="20px"
                className="object-contain"
              />
            </div>
          ) : (
            <Icon
              className="w-5 h-5 text-muted-foreground group-hover:text-neon transition-colors duration-300"
              strokeWidth={1.5}
            />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground font-semibold text-base group-hover:text-neon transition-colors duration-300">
            {link.title}
          </h3>
          <p className="text-muted-foreground text-sm truncate">
            {link.description || link.url}
          </p>
        </div>

        {/* Copy button or Arrow */}
        {link.copy ? (
          <button
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-600 hover:text-neon hover:bg-neon/10 transition-all duration-300 shrink-0"
          >
            {copied ? (
              <Check className="w-5 h-5 text-neon" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        ) : (
          <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-neon group-hover:translate-x-1 transition-all duration-300 shrink-0" />
        )}
      </Wrapper>
    </motion.div>
  )
}

export function LinkHub({ links }: { links: LinkItem[] }) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          {links.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
