"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"


export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <footer ref={ref} className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-md mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            &copy; 2024 Mahirsn. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
