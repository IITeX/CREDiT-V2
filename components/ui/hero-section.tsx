"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Globe } from "lucide-react"

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200/40 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-200/40 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-teal-200/40 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Announcement Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-green-200 text-sm font-medium text-green-700">
              <span className="mr-2">🚀</span>
              Powered by Internet Computer Protocol
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
              <span className="block">Your Skills,</span>
              <span className="block text-green-600">Verified</span>
              <span className="block">On-Chain Forever</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Build a tamper-proof resume with blockchain-verified credentials. From certificates to work experience,
              every achievement is cryptographically secured and instantly verifiable.
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div variants={itemVariants} className="w-full max-w-2xl">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-green-200 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Verified Profiles</h3>
              <p className="text-gray-600 mb-4">Enter a profile token or username to view verified credentials</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Enter profile token (e.g. john-doe-2024)"
                    className="pl-10 h-12 border-green-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <Button className="h-12 px-8 bg-green-600 hover:bg-green-700 text-white">Search</Button>
              </div>

              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
                <button className="hover:text-green-600 transition-colors">Try: "demo-profile"</button>
                <span>•</span>
                <button className="hover:text-green-600 transition-colors">Or browse public profiles</button>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold rounded-xl"
            >
              <Link href="/auth">
                <span className="mr-2">🎯</span>
                Start Building Your CREDiT
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-green-300 text-green-700 hover:bg-green-50 px-8 py-6 text-lg font-semibold rounded-xl"
            >
              <Link href="/profile/demo">
                <Globe className="mr-2 h-5 w-5" />
                View Demo Profile
              </Link>
            </Button>
          </motion.div>

          {/* Trusted Organizations */}
          <motion.div variants={itemVariants} className="mt-12">
            <p className="text-sm text-gray-500 mb-4">Trusted by leading organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <span className="text-lg font-semibold text-gray-400">University</span>
              <span className="text-lg font-semibold text-gray-400">TechCorp</span>
              <span className="text-lg font-semibold text-gray-400">CertifyPro</span>
              <span className="text-lg font-semibold text-gray-400">SkillHub</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
