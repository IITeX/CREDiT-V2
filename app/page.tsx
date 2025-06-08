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
            <div className="w-fit h-fit flex flex-col">
              <p className="text-sm text-gray-600 mb-2">© 2025 CREDiT. Built on Internet Computer Protocol.</p>
              <svg width="150" height="54.07" viewBox="0 0 172 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M33.8352 23.3125H26.3693C26.233 22.3466 25.9545 21.4886 25.5341 20.7386C25.1136 19.9773 24.5739 19.3295 23.9148 18.7955C23.2557 18.2614 22.4943 17.8523 21.6307 17.5682C20.7784 17.2841 19.8523 17.142 18.8523 17.142C17.0455 17.142 15.4716 17.5909 14.1307 18.4886C12.7898 19.375 11.75 20.6705 11.0114 22.375C10.2727 24.0682 9.90341 26.125 9.90341 28.5455C9.90341 31.0341 10.2727 33.125 11.0114 34.8182C11.7614 36.5114 12.8068 37.7898 14.1477 38.6534C15.4886 39.517 17.0398 39.9489 18.8011 39.9489C19.7898 39.9489 20.7045 39.8182 21.5455 39.5568C22.3977 39.2955 23.1534 38.9148 23.8125 38.4148C24.4716 37.9034 25.017 37.2841 25.4489 36.5568C25.892 35.8295 26.1989 35 26.3693 34.0682L33.8352 34.1023C33.642 35.7045 33.1591 37.25 32.3864 38.7386C31.625 40.2159 30.5966 41.5398 29.3011 42.7102C28.017 43.8693 26.483 44.7898 24.6989 45.4716C22.9261 46.142 20.9205 46.4773 18.6818 46.4773C15.5682 46.4773 12.7841 45.7727 10.3295 44.3636C7.88636 42.9545 5.95455 40.9148 4.53409 38.2443C3.125 35.5739 2.42045 32.3409 2.42045 28.5455C2.42045 24.7386 3.13636 21.5 4.56818 18.8295C6 16.1591 7.94318 14.125 10.3977 12.7273C12.8523 11.3182 15.6136 10.6136 18.6818 10.6136C20.7045 10.6136 22.5795 10.8977 24.3068 11.4659C26.0455 12.0341 27.5852 12.8636 28.9261 13.9545C30.267 15.0341 31.358 16.358 32.1989 17.9261C33.0511 19.4943 33.5966 21.2898 33.8352 23.3125ZM34.3278 46V11.0909H48.1006C50.7369 11.0909 52.9869 11.5625 54.8506 12.5057C56.7256 13.4375 58.1517 14.7614 59.129 16.4773C60.1176 18.1818 60.6119 20.1875 60.6119 22.4943C60.6119 24.8125 60.1119 26.8068 59.1119 28.4773C58.1119 30.1364 56.6631 31.4091 54.7653 32.2955C52.879 33.1818 50.5949 33.625 47.9131 33.625H38.6915V27.6932H46.7199C48.129 27.6932 49.2994 27.5 50.2313 27.1136C51.1631 26.7273 51.8563 26.1477 52.3108 25.375C52.7767 24.6023 53.0097 23.642 53.0097 22.4943C53.0097 21.3352 52.7767 20.358 52.3108 19.5625C51.8563 18.767 51.1574 18.1648 50.2142 17.7557C49.2824 17.3352 48.1063 17.125 46.6858 17.125H41.7085V46H34.3278ZM53.1801 30.1136L61.8563 46H53.7085L45.2199 30.1136H53.1801ZM61.0278 46V11.0909H84.5506V17.1761H68.4085V25.4943H83.3403V31.5795H68.4085V39.9148H84.6188V46H61.0278ZM97.9935 46H85.6185V11.0909H98.0957C101.607 11.0909 104.63 11.7898 107.164 13.1875C109.698 14.5739 111.647 16.5682 113.011 19.1705C114.386 21.7727 115.073 24.8864 115.073 28.5114C115.073 32.1477 114.386 35.2727 113.011 37.8864C111.647 40.5 109.687 42.5057 107.13 43.9034C104.584 45.3011 101.539 46 97.9935 46ZM92.9991 39.6761H97.6866C99.8685 39.6761 101.704 39.2898 103.192 38.517C104.692 37.733 105.817 36.5227 106.567 34.8864C107.329 33.2386 107.709 31.1136 107.709 28.5114C107.709 25.9318 107.329 23.8239 106.567 22.1875C105.817 20.5511 104.698 19.3466 103.209 18.5739C101.721 17.8011 99.8855 17.4148 97.7037 17.4148H92.9991V39.6761Z" fill="#124a99" />
                <circle cx="128" cy="17" r="6.5" stroke="#124a99" strokeWidth="5" />
                <path d="M122.843 27.54C124.382 28.471 126.138 28.9999 128.003 29C129.863 29 131.613 28.4726 133.148 27.5469L138.99 46H117L122.843 27.54Z" fill="#124a99" />
                <path d="M141.253 20.8625L144.695 7.70017C144.955 6.70412 146.369 6.70412 146.63 7.70017L150.065 20.8375C150.16 21.2032 150.454 21.4838 150.824 21.5626L155.255 22.5071C156.311 22.732 156.311 24.2382 155.255 24.4631L151.012 25.3675C150.551 25.4658 150.221 25.8735 150.221 26.3455L150.221 33.9345C150.221 34.7309 151.106 35.2077 151.771 34.7694L170.45 22.4561C171.114 22.0178 171.581 22.3913 171.1 23.0259C167.49 27.7889 154.067 40.6151 150.221 44.5085C145.95 48.8327 142.577 46.5958 141.264 44.7471C141.155 44.5936 141.104 44.4086 141.104 44.2203L141.104 26.3146C141.104 25.8568 140.793 25.4575 140.349 25.3452L136.83 24.4545C135.824 24.1999 135.824 22.7703 136.83 22.5157L140.531 21.579C140.884 21.4896 141.161 21.2151 141.253 20.8625Z" fill="#124a99" />
              </svg>
            </div>
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
