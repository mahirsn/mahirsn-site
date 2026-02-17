"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl"
    >
      <nav className="relative flex items-center justify-between px-5 py-3 rounded-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Mahirsn logo"
            width={36}
            height={36}
            className="rounded-lg object-contain"
          />
          <span className="font-bold text-foreground text-lg tracking-tight">Mahirsn</span>
        </a>

        {/* Home Link */}
        <a
          href="#"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-zinc-800/60"
        >
          Home
        </a>
      </nav>
    </motion.header>
  )
}
