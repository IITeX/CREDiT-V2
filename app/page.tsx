"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Globe, ArrowRight, CheckCircle, Zap, Lock } from "lucide-react"
import { Navbar } from "@/components/ui/navbar"
import { HeroSearchSection } from "@/components/ui/hero-search-section"

export default function HomePage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Modern Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Search Section */}
        <HeroSearchSection />

        {/* Features Section */}
        <section id="features" className="py-24 relative bg-white">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Why Choose <span className="gradient-text">CREDiT</span>?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-gray-600 max-w-2xl mx-auto">
                Traditional resumes are static and unverifiable. CREDiT changes that with blockchain technology.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid gap-8 lg:grid-cols-3"
            >
              {[
                {
                  icon: Shield,
                  title: "Tamper-Proof Verification",
                  description:
                    "Every credential is cryptographically signed and stored on-chain. No more fake certificates or inflated experience claims.",
                  gradient: "from-green-500 to-emerald-500",
                },
                {
                  icon: Users,
                  title: "Multi-Type Credentials",
                  description:
                    "From certificates and work experience to volunteering and soft skills. Capture your complete professional journey.",
                  gradient: "from-emerald-500 to-green-600",
                },
                {
                  icon: Globe,
                  title: "Portable & Interoperable",
                  description:
                    "Your credentials belong to you. Share them anywhere, integrate with any platform, never lose your data.",
                  gradient: "from-green-600 to-emerald-700",
                },
              ].map((feature, index) => (
                <motion.div key={feature.title} variants={fadeInUp}>
                  <Card className="card-clean h-full group cursor-pointer hover:shadow-lg transition-all duration-300">
                    <CardHeader className="text-center pb-4">
                      <div
                        className={`mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-sm group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-green-800">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-gray-600 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Credential Types Section */}
        <section className="py-24 bg-green-gradient-subtle">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Supported <span className="gradient-text">Credential Types</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-gray-600 max-w-2xl mx-auto">
                CREDiT supports a comprehensive range of verifiable credentials for your complete professional profile
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {[
                {
                  title: "Certificates & Courses",
                  example: "Google Data Analytics, AWS Architect",
                  verifier: "Google, Coursera, Udemy",
                  icon: "🎓",
                },
                {
                  title: "Work Experience",
                  example: "6-month internship at tech startup",
                  verifier: "Company HR or supervisor",
                  icon: "💼",
                },
                {
                  title: "Freelance Work",
                  example: "Web app built for client",
                  verifier: "Client/Platform (Upwork)",
                  icon: "🚀",
                },
                {
                  title: "Volunteering & NGOs",
                  example: "Community coding mentor",
                  verifier: "NGO manager",
                  icon: "❤️",
                },
                {
                  title: "Soft Skills",
                  example: "Great communication, Team leadership",
                  verifier: "Peer reviews + reputation",
                  icon: "🤝",
                },
                {
                  title: "Hackathon Wins",
                  example: "GNEC Finalist, iThink Top 10",
                  verifier: "Organizers or partners",
                  icon: "🏆",
                },
                {
                  title: "Formal Education",
                  example: "Bachelor's in IT, Dean's List",
                  verifier: "School registrar",
                  icon: "🎯",
                },
                {
                  title: "Personal Projects",
                  example: "GitHub repo + live demo",
                  verifier: "Self-verified, endorsed",
                  icon: "⚡",
                },
              ].map((credential, index) => (
                <motion.div key={credential.title} variants={fadeInUp}>
                  <Card className="card-clean h-full group cursor-pointer hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{credential.icon}</span>
                        <CardTitle className="text-sm font-semibold text-green-800">{credential.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Example:</span> {credential.example}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Verified by:</span> {credential.verifier}
                        </p>
                      </div>
                      <div className="h-1 w-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                How It <span className="gradient-text">Works</span>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid gap-12 lg:grid-cols-3"
            >
              {[
                {
                  step: "1",
                  title: "Add Credentials",
                  description:
                    "Upload your certificates, add work experience, or document your projects. Each entry is stored in your personal ICP canister.",
                  icon: CheckCircle,
                  color: "green",
                },
                {
                  step: "2",
                  title: "Get Verified",
                  description:
                    "Invite verifiers (employers, institutions, clients) to digitally sign your credentials. Each signature is cryptographically secured.",
                  icon: Lock,
                  color: "emerald",
                },
                {
                  step: "3",
                  title: "Share & Prove",
                  description:
                    "Share your public profile with recruiters. They can instantly verify the authenticity of your credentials on-chain.",
                  icon: Zap,
                  color: "green",
                },
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  variants={fadeInUp}
                  className="flex flex-col items-center text-center space-y-6"
                >
                  <div className="relative">
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm`}
                    >
                      {step.step}
                    </div>
                    <div className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-sm">
                      <step.icon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-green-800">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 green-gradient" />
          <div className="absolute inset-0 bg-black/10" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center text-white"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Ready to Build Your Decentralized Resume?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Join the future of verifiable credentials. Own your professional identity.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-green-800 hover:bg-gray-100 px-8 py-6 text-lg font-semibold group shadow-sm"
                >
                  <Link href="/auth">
                    Start Building
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-green-200 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">© 2025 CREDiT. Built on Internet Computer Protocol.</p>
            <nav className="flex gap-6">
              <Link className="text-sm text-gray-600 hover:text-green-600 transition-colors" href="#">
                Terms of Service
              </Link>
              <Link className="text-sm text-gray-600 hover:text-green-600 transition-colors" href="#">
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
