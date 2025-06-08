// Mock data for development and testing

export interface MockIssuer {
  id: string
  email: string
  organizationName: string
  role: string
  verificationStatus: string
  tokenPrefix: string
  description: string
  website?: string
  logoUrl?: string
}

export interface MockCertificate {
  tokenId: string
  title: string
  description: string
  issuer: MockIssuer
  recipient: string
  recipientName: string
  issuedAt: string
  type: 'issuer-created' | 'individual-created'
  documentUrl?: string
  metadata: { [key: string]: string }
}

// Mock verified issuers
export const mockVerifiedIssuers: MockIssuer[] = [
  {
    id: "ed-university",
    email: "education@university.edu",
    organizationName: "State University",
    role: "Educational",
    verificationStatus: "Approved",
    tokenPrefix: "ED",
    description: "Leading educational institution providing quality education and certification programs.",
    website: "https://university.edu",
    logoUrl: "/logos/university.png"
  },
  {
    id: "techcorp-inc",
    email: "hr@techcorp.com",
    organizationName: "TechCorp Inc.",
    role: "Company",
    verificationStatus: "Approved",
    tokenPrefix: "CO",
    description: "Technology company specializing in software development and digital solutions.",
    website: "https://techcorp.com",
    logoUrl: "/logos/techcorp.png"
  },
  {
    id: "cert-authority",
    email: "verify@certauthority.org",
    organizationName: "Global Certification Authority",
    role: "Certification Body",
    verificationStatus: "Approved",
    tokenPrefix: "CB",
    description: "International certification body providing professional certifications and standards.",
    website: "https://certauthority.org",
    logoUrl: "/logos/cert-authority.png"
  },
  {
    id: "green-ngo",
    email: "contact@greenfuture.org",
    organizationName: "Green Future NGO",
    role: "NGO/Non-Profit",
    verificationStatus: "Approved",
    tokenPrefix: "NG",
    description: "Environmental NGO focused on sustainability education and certification.",
    website: "https://greenfuture.org",
    logoUrl: "/logos/green-ngo.png"
  },
  {
    id: "skill-platform",
    email: "support@skillplatform.com",
    organizationName: "SkillPlatform Marketplace",
    role: "Platform/Marketplace",
    verificationStatus: "Approved",
    tokenPrefix: "PL",
    description: "Online learning marketplace connecting learners with verified skill certifications.",
    website: "https://skillplatform.com",
    logoUrl: "/logos/skill-platform.png"
  },
  {
    id: "cert-body",
    email: "certs@certbody.org",
    organizationName: "Professional Certification Body",
    role: "CertificationBody",
    verificationStatus: "Approved",
    tokenPrefix: "CB",
    description: "Authorized certification body for professional standards and qualifications.",
    website: "https://certbody.org",
    logoUrl: "/logos/certbody.png"
  },
  {
    id: "community-ngo",
    email: "admin@ngo.org",
    organizationName: "Community NGO",
    role: "NGO",
    verificationStatus: "Approved",
    tokenPrefix: "NG",
    description: "Non-profit organization focused on community development and social impact.",
    website: "https://communityngo.org",
    logoUrl: "/logos/ngo.png"
  },
  {
    id: "skills-marketplace",
    email: "platform@marketplace.com",
    organizationName: "Skills Marketplace",
    role: "Platform",
    verificationStatus: "Approved",
    tokenPrefix: "PL",
    description: "Digital platform connecting professionals with skill verification and opportunities.",
    website: "https://skillsmarketplace.com",
    logoUrl: "/logos/marketplace.png"
  }
]

// Mock sample certificates for testing search functionality
export const mockSampleCertificates: MockCertificate[] = [
  {
    tokenId: "ED-2025-001",
    title: "Bachelor of Computer Science",
    description: "Degree in Computer Science with specialization in Software Engineering",
    issuer: mockVerifiedIssuers[0], // State University
    recipient: "john.doe@email.com",
    recipientName: "John Doe",
    issuedAt: "2025-01-15T10:00:00Z",
    type: "issuer-created",
    documentUrl: "/certificates/ed-2025-001.png",
    metadata: {
      "GPA": "3.8",
      "Major": "Computer Science",
      "Graduation Date": "May 2025",
      "Honors": "Magna Cum Laude"
    }
  },
  {
    tokenId: "CO-2025-042",
    title: "Full Stack Developer Certification",
    description: "Comprehensive training in modern web development technologies",
    issuer: mockVerifiedIssuers[1], // TechCorp Inc.
    recipient: "jane.smith@email.com",
    recipientName: "Jane Smith",
    issuedAt: "2025-01-10T14:30:00Z",
    type: "issuer-created",
    documentUrl: "/certificates/co-2025-042.png",
    metadata: {
      "Technologies": "React, Node.js, MongoDB",
      "Duration": "6 months",
      "Score": "95%",
      "Project": "E-commerce Platform"
    }
  },
  {
    tokenId: "CB-2025-015",
    title: "Project Management Professional (PMP)",
    description: "Certified Project Management Professional credential",
    issuer: mockVerifiedIssuers[2], // Professional Certification Body
    recipient: "mike.johnson@email.com",
    recipientName: "Mike Johnson",
    issuedAt: "2025-01-08T09:15:00Z",
    type: "issuer-created",
    documentUrl: "/certificates/cb-2025-015.png",
    metadata: {
      "Certification ID": "PMP-2025-015",
      "Valid Until": "2028-01-08",
      "PDUs Required": "60",
      "Exam Score": "Above Target"
    }
  },
  {
    tokenId: "NG-2025-003",
    title: "Community Leadership Certificate",
    description: "Recognition for outstanding community service and leadership",
    issuer: mockVerifiedIssuers[3], // Community NGO
    recipient: "sarah.wilson@email.com",
    recipientName: "Sarah Wilson",
    issuedAt: "2025-01-05T16:45:00Z",
    type: "issuer-created",
    documentUrl: "/certificates/ng-2025-003.png",
    metadata: {
      "Service Hours": "200+",
      "Projects Led": "5",
      "Impact Area": "Education & Youth Development",
      "Recognition Level": "Outstanding"
    }
  },
  {
    tokenId: "PL-2025-128",
    title: "Digital Marketing Specialist",
    description: "Verified expertise in digital marketing strategies and tools",
    issuer: mockVerifiedIssuers[4], // Skills Marketplace
    recipient: "alex.brown@email.com",
    recipientName: "Alex Brown",
    issuedAt: "2025-01-03T11:20:00Z",
    type: "issuer-created",
    documentUrl: "/certificates/pl-2025-128.png",
    metadata: {
      "Specialization": "Social Media & SEO",
      "Campaigns Managed": "15+",
      "ROI Improvement": "150%",
      "Certification Level": "Advanced"
    }
  },
  {
    tokenId: "CREDiT-1001",
    title: "AWS Solutions Architect",
    description: "Professional certification for cloud architecture expertise",
    issuer: {
      id: "individual-user",
      email: "user@example.com",
      organizationName: "Individual User",
      role: "Individual",
      verificationStatus: "Verified",
      tokenPrefix: "CREDiT",
      description: "Individual user credential"
    },
    recipient: "david.lee@email.com",
    recipientName: "David Lee",
    issuedAt: "2025-01-01T08:00:00Z",
    type: "individual-created",
    metadata: {
      "Issuer": "Amazon Web Services",
      "Certification ID": "AWS-SAA-C03",
      "Valid Until": "2028-01-01",
      "Verification Email": "verify@aws.amazon.com"
    }
  }
]

// Helper functions for mock data
export function getMockIssuerByTokenId(tokenId: string): MockIssuer | null {
  const certificate = mockSampleCertificates.find(cert => cert.tokenId === tokenId)
  return certificate?.issuer || null
}

export function getMockCertificateByTokenId(tokenId: string): MockCertificate | null {
  return mockSampleCertificates.find(cert => cert.tokenId === tokenId) || null
}

export function getMockIssuersByRole(role: string): MockIssuer[] {
  return mockVerifiedIssuers.filter(issuer => issuer.role === role)
}

export function getRandomMockCertificate(): MockCertificate {
  const randomIndex = Math.floor(Math.random() * mockSampleCertificates.length)
  return mockSampleCertificates[randomIndex]
}

// AI Verification Demo States
export interface AIVerificationState {
  step: number
  status: 'idle' | 'processing' | 'success' | 'error'
  message: string
  progress: number
}

export const aiVerificationSteps: AIVerificationState[] = [
  {
    step: 1,
    status: 'processing',
    message: 'Analyzing uploaded document...',
    progress: 20
  },
  {
    step: 2,
    status: 'error',
    message: 'Upload Failed: Not a Document',
    progress: 40
  },
  {
    step: 3,
    status: 'processing',
    message: 'Processing... Document detected',
    progress: 70
  },
  {
    step: 4,
    status: 'processing',
    message: 'Verifying document authenticity...',
    progress: 90
  },
  {
    step: 5,
    status: 'success',
    message: 'Upload Successful: Document verified',
    progress: 100
  }
]

export function simulateAIVerification(): Promise<AIVerificationState[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(aiVerificationSteps)
    }, 3000) // 3 second simulation
  })
}

// Mock verified issuer for testing issuer dashboard
export const mockVerifiedIssuerUser = {
  id: 'test-issuer-ed-001',
  email: 'test@university.edu',
  role: { Educational: null },
  verificationStatus: { Approved: null },
  organizationName: 'Test University',
  createdAt: BigInt(Date.now() * 1000000),
  updatedAt: BigInt(Date.now() * 1000000)
}

// Function to simulate issuer login for testing
export function simulateIssuerLogin() {
  // Store mock issuer data in localStorage for testing
  localStorage.setItem('mock_issuer_user', JSON.stringify(mockVerifiedIssuerUser))
  console.log('🎓 Mock issuer login simulated:', mockVerifiedIssuerUser)
  return mockVerifiedIssuerUser
}
