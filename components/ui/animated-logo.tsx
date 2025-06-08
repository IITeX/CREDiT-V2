"use client"

import { Shield } from "lucide-react"
import { motion } from "framer-motion"

interface AnimatedLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function AnimatedLogo({ className = "", size = "md" }: AnimatedLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  return (
    <motion.div
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <svg width="42" height="42" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="26" cy="26" r="26" fill="url(#paint0_linear_51_84)" />
          <circle cx="19.2591" cy="19.7764" r="3.27641" stroke="white" stroke-width="3" />
          <path d="M16.5219 25.3691C17.3389 25.8634 18.271 26.1445 19.2612 26.1445C20.2481 26.1445 21.1766 25.8644 21.9916 25.373L25.0922 35.167H13.4213L16.5219 25.3691Z" fill="white" />
          <path d="M28.514 21.7539L29.8511 16.674C30.1127 15.6801 31.5236 15.6801 31.7852 16.674L33.1158 21.7291C33.212 22.0946 33.506 22.3746 33.8758 22.4529L38.4545 23.4223L34.0656 24.3515C33.6034 24.4493 33.2727 24.8573 33.2727 25.3298L33.2727 28.1546C33.2727 28.9495 34.1555 29.4267 34.8206 28.9912L45 22.3252C45 23.4223 35.6727 32.2538 33.2727 34.6673C31.0562 36.8964 29.2894 35.8659 28.5309 34.9032C28.4138 34.7544 28.3636 34.5668 28.3636 34.3775L28.3636 25.2991C28.3636 24.8407 28.052 24.441 27.6075 24.3292L24 23.4223L27.7908 22.4692C28.1442 22.3804 28.4212 22.1063 28.514 21.7539Z" fill="white" />
          <defs>
            <linearGradient id="paint0_linear_51_84" x1="26" y1="0" x2="26" y2="52" gradientUnits="userSpaceOnUse">
              <stop stop-color="#0F6DC7" />
              <stop offset="1" stop-color="#1688B4" />
            </linearGradient>
          </defs>
        </svg>
        <motion.div
          className="absolute inset-0 bg-blue-400 rounded-full opacity-20 blur-md"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>
      <motion.span
          className={`font-bold gradient-text ${textSizeClasses[size]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          CREDiT
        </motion.span>
    </motion.div>
  )
}
