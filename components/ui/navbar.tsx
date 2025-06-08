"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedLogo } from "./animated-logo"
import { useInternetIdentity } from "@/hooks/useInternetIdentity"

interface NavbarProps {
  className?: string
}

export function Navbar({ className = "" }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, loading } = useInternetIdentity()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "/dashboard", label: "Dashboard", authRequired: true },
    { href: "#pricing", label: "Pricing" },
  ]

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200" : "bg-transparent"
      } ${className}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <AnimatedLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.authRequired && !isAuthenticated) return null
              return (
                <motion.div key={item.href} whileHover={{ scale: 1.05 }}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200 relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-8 animate-pulse bg-gray-200 rounded" />
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>
            ) : (
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                <Link href="/signup">Sign up</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => {
                if (item.authRequired && !isAuthenticated) return null
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <div className="pt-4 border-t border-gray-200">
                {loading ? (
                  <div className="h-8 w-full animate-pulse bg-gray-200 rounded" />
                ) : isAuthenticated ? (
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Link href="/signup">Sign up</Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
