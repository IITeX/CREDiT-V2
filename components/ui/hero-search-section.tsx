"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Shield, Sparkles, Globe, ArrowRight } from "lucide-react"

export function HeroSearchSection() {
  const [searchToken, setSearchToken] = useState("")

  const handleSearch = () => {
    if (searchToken.trim()) {
      // Navigate to credential detail page
      window.location.href = `/credential/${searchToken}`
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 green-gradient-subtle">
        <div className="absolute inset-0 bg-mesh-gradient opacity-60" />
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(5, 150, 105, 0.2) 0%, transparent 50%)
            `,
            backgroundSize: "100% 100%",
          }}
        />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-32 h-32 bg-green-200/30 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-200/30 rounded-full blur-xl"
      />
      <motion.div
        animate={{ x: [-30, 30, -30] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute top-1/2 right-10 w-24 h-24 bg-green-300/20 rounded-full blur-lg"
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-green-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">Powered by Internet Computer Protocol</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Your Skills, <span className="gradient-text">Verified</span>
            <br />
            On-Chain Forever
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Build a tamper-proof resume with blockchain-verified credentials. From certificates to work experience,
            every achievement is cryptographically secured and instantly verifiable.
          </motion.p>

          {/* Search Section */}
          <motion.div variants={fadeInUp} className="mb-12">
            <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-lg border border-green-200 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Search Verified Profiles</h3>
                    <p className="text-sm text-gray-600">
                      Enter a profile token or username to view verified credentials
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Enter profile token (e.g., john-doe-2024)"
                        value={searchToken}
                        onChange={(e) => setSearchToken(e.target.value)}
                        className="pl-10 h-12 border-green-200 focus:border-green-500 focus:ring-green-500"
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white shadow-sm"
                      disabled={!searchToken.trim()}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span>Try: "CS-2025-001"</span>
                    <span>•</span>
                    <span>Or "WE-2024-042"</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold shadow-sm group"
              asChild
            >
              <a href="/auth">
                <Shield className="mr-2 h-5 w-5" />
                Start Building Your CREDiT Resume
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4 text-lg font-semibold"
              asChild
            >
              <a href="/profile/demo">
                <Globe className="mr-2 h-5 w-5" />
                View Demo Profile
              </a>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={fadeInUp} className="mt-16">
            <p className="text-sm text-gray-600 mb-6">Trusted by leading organizations</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              {["University", "TechCorp", "CertifyPro", "SkillsHub"].map((name, index) => (
                <div key={name} className="text-gray-500 font-medium">
                  {name}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-green-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-green-400 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}
