"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-32 pb-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none bg-neon/5" />

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-24 h-24 rounded-full border-2 border-zinc-700 overflow-hidden bg-zinc-900"
        >
          <Image
            src="/logo.png"
            alt="Mahirsn avatar"
            width={96}
            height={96}
            className="w-full h-full object-cover"
            priority
          />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
        >
          Mahirsn
        </motion.h1>
      </div>
    </section>
  )
}
