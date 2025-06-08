/**
 * Certificate Generator Utility
 * Generates and downloads professional certificates as PNG images
 * Uses browser's built-in Canvas API - no external dependencies required
 */

export interface CertificateData {
  tokenId: string
  title: string
  recipientName: string
  issuerName: string
  issuedDate: string
  description?: string
  metadata?: { [key: string]: string }
  template?: 'professional' | 'academic' | 'corporate' | 'achievement' | 'excellence'
  credentialType?: string
}

export interface CertificateTemplate {
  id: string
  name: string
  backgroundColor: string
  primaryColor: string
  secondaryColor: string
  borderColor: string
  fontFamily: string
}

// Professional certificate templates with enhanced aesthetics
export const CERTIFICATE_TEMPLATES: CertificateTemplate[] = [
  {
    id: 'professional',
    name: 'Professional Elegance',
    backgroundColor: '#f8fafc',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    borderColor: '#1e40af',
    fontFamily: 'Georgia, serif'
  },
  {
    id: 'academic',
    name: 'Academic Prestige',
    backgroundColor: '#1a365d',
    primaryColor: '#f7fafc',
    secondaryColor: '#ffd700',
    borderColor: '#f7fafc',
    fontFamily: 'Times New Roman, serif'
  },
  {
    id: 'corporate',
    name: 'Corporate Modern',
    backgroundColor: '#2d3748',
    primaryColor: '#ffffff',
    secondaryColor: '#4299e1',
    borderColor: '#4a5568',
    fontFamily: 'Arial, sans-serif'
  },
  {
    id: 'achievement',
    name: 'Achievement Luxury',
    backgroundColor: '#fefdf8',
    primaryColor: '#92400e',
    secondaryColor: '#d97706',
    borderColor: '#92400e',
    fontFamily: 'Georgia, serif'
  },
  {
    id: 'excellence',
    name: 'Excellence Premium',
    backgroundColor: '#faf5ff',
    primaryColor: '#7c3aed',
    secondaryColor: '#a855f7',
    borderColor: '#7c3aed',
    fontFamily: 'Arial, sans-serif'
  }
]

export function generateCertificateHTML(data: CertificateData): string {
  const template = data.template || 'professional'
  
  const templates = {
    professional: `
      <div style="width: 800px; height: 600px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: 'Georgia', serif; position: relative; padding: 60px; box-sizing: border-box;">
        <div style="border: 3px solid white; height: 100%; padding: 40px; position: relative;">
          <div style="text-align: center;">
            <h1 style="font-size: 48px; margin: 0 0 20px 0; font-weight: bold;">CERTIFICATE</h1>
            <h2 style="font-size: 24px; margin: 0 0 40px 0; font-weight: normal;">OF ACHIEVEMENT</h2>
            
            <div style="margin: 60px 0;">
              <p style="font-size: 18px; margin: 0 0 20px 0;">This is to certify that</p>
              <h3 style="font-size: 36px; margin: 0 0 20px 0; border-bottom: 2px solid white; padding-bottom: 10px; display: inline-block;">${data.recipientName}</h3>
              <p style="font-size: 18px; margin: 0 0 40px 0;">has successfully completed</p>
              <h4 style="font-size: 28px; margin: 0 0 40px 0; font-style: italic;">${data.title}</h4>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: end; margin-top: 80px;">
              <div style="text-align: left;">
                <p style="margin: 0; font-size: 14px;">Issued by:</p>
                <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">${data.issuerName}</p>
              </div>
              <div style="text-align: center;">
                <p style="margin: 0; font-size: 14px;">Token ID:</p>
                <p style="margin: 5px 0 0 0; font-size: 16px; font-family: monospace;">${data.tokenId}</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-size: 14px;">Date:</p>
                <p style="margin: 5px 0 0 0; font-size: 18px;">${data.issuedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    
    academic: `
      <div style="width: 800px; height: 600px; background: #1a365d; color: #f7fafc; font-family: 'Times New Roman', serif; position: relative; padding: 60px; box-sizing: border-box;">
        <div style="border: 4px double #f7fafc; height: 100%; padding: 40px; position: relative;">
          <div style="text-align: center;">
            <div style="margin-bottom: 30px;">
              <div style="width: 80px; height: 80px; border: 3px solid #f7fafc; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 36px;">🎓</span>
              </div>
            </div>
            
            <h1 style="font-size: 42px; margin: 0 0 10px 0; font-weight: bold; letter-spacing: 2px;">ACADEMIC CERTIFICATE</h1>
            <div style="width: 200px; height: 2px; background: #f7fafc; margin: 0 auto 40px;"></div>
            
            <div style="margin: 50px 0;">
              <p style="font-size: 20px; margin: 0 0 30px 0;">This certifies that</p>
              <h3 style="font-size: 38px; margin: 0 0 30px 0; color: #ffd700; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">${data.recipientName}</h3>
              <p style="font-size: 20px; margin: 0 0 20px 0;">has successfully completed the requirements for</p>
              <h4 style="font-size: 30px; margin: 0 0 40px 0; font-style: italic; line-height: 1.2;">${data.title}</h4>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: end; margin-top: 60px;">
              <div style="text-align: left;">
                <div style="border-top: 2px solid #f7fafc; width: 150px; margin-bottom: 5px;"></div>
                <p style="margin: 0; font-size: 16px;">${data.issuerName}</p>
                <p style="margin: 0; font-size: 14px; opacity: 0.8;">Institution</p>
              </div>
              <div style="text-align: center;">
                <p style="margin: 0; font-size: 12px; opacity: 0.8;">Blockchain Verified</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; font-family: monospace;">${data.tokenId}</p>
              </div>
              <div style="text-align: right;">
                <div style="border-top: 2px solid #f7fafc; width: 120px; margin-bottom: 5px; margin-left: auto;"></div>
                <p style="margin: 0; font-size: 16px;">${data.issuedDate}</p>
                <p style="margin: 0; font-size: 14px; opacity: 0.8;">Date Issued</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    
    corporate: `
      <div style="width: 800px; height: 600px; background: linear-gradient(45deg, #2d3748 0%, #4a5568 100%); color: white; font-family: 'Arial', sans-serif; position: relative; padding: 50px; box-sizing: border-box;">
        <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); height: 100%; padding: 50px; backdrop-filter: blur(10px);">
          <div style="text-align: center;">
            <div style="margin-bottom: 40px;">
              <h1 style="font-size: 44px; margin: 0; font-weight: 300; letter-spacing: 3px;">CERTIFICATE</h1>
              <div style="width: 100px; height: 3px; background: linear-gradient(90deg, #4299e1, #63b3ed); margin: 20px auto;"></div>
              <h2 style="font-size: 20px; margin: 0; font-weight: 400; opacity: 0.9;">OF PROFESSIONAL COMPLETION</h2>
            </div>
            
            <div style="margin: 60px 0;">
              <p style="font-size: 18px; margin: 0 0 25px 0; opacity: 0.9;">We hereby certify that</p>
              <h3 style="font-size: 40px; margin: 0 0 25px 0; font-weight: 600; background: linear-gradient(90deg, #4299e1, #63b3ed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${data.recipientName}</h3>
              <p style="font-size: 18px; margin: 0 0 20px 0; opacity: 0.9;">has successfully completed</p>
              <h4 style="font-size: 26px; margin: 0 0 30px 0; font-weight: 500; line-height: 1.3;">${data.title}</h4>
              ${data.description ? `<p style="font-size: 16px; margin: 0; opacity: 0.8; font-style: italic;">${data.description}</p>` : ''}
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 80px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.3);">
              <div style="text-align: left;">
                <p style="margin: 0 0 5px 0; font-size: 14px; opacity: 0.7;">ISSUED BY</p>
                <p style="margin: 0; font-size: 18px; font-weight: 600;">${data.issuerName}</p>
              </div>
              <div style="text-align: center;">
                <p style="margin: 0 0 5px 0; font-size: 12px; opacity: 0.7;">BLOCKCHAIN TOKEN</p>
                <p style="margin: 0; font-size: 14px; font-family: monospace; background: rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 4px;">${data.tokenId}</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0 0 5px 0; font-size: 14px; opacity: 0.7;">DATE ISSUED</p>
                <p style="margin: 0; font-size: 18px; font-weight: 600;">${data.issuedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
  
  return templates[template] || templates.professional
}

/**
 * Generates a certificate image and downloads it as PNG using Canvas API
 */
export async function downloadCertificateAsPNG(data: CertificateData): Promise<void> {
  try {
    console.log('🎨 Generating certificate...', data)

    // Get template
    const templateId = data.template || 'professional'
    const template = CERTIFICATE_TEMPLATES.find(t => t.id === templateId) || CERTIFICATE_TEMPLATES[0]

    // Create canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas context not available')
    }

    // Set canvas size (A4 landscape proportions)
    canvas.width = 1200
    canvas.height = 850

    // Draw certificate
    await drawCertificate(ctx, canvas, data, template)

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to generate certificate blob')
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `certificate-${data.tokenId}-${data.recipientName.replace(/\s+/g, '-')}.png`

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup
      URL.revokeObjectURL(url)

      console.log('✅ Certificate downloaded successfully!')
    }, 'image/png', 0.95)

  } catch (error) {
    console.error('❌ Certificate generation failed:', error)

    // Fallback: open certificate in new window for manual save
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certificate - ${data.tokenId}</title>
            <style>
              body { margin: 0; padding: 20px; background: #f0f0f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            </style>
          </head>
          <body>
            ${generateCertificateHTML(data)}
            <script>
              setTimeout(() => window.print(), 1000);
            </script>
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }
}

/**
 * Draws the certificate on the canvas with beautiful, professional designs
 */
async function drawCertificate(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  data: CertificateData,
  template: CertificateTemplate
): Promise<void> {
  const { width, height } = canvas

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Draw template-specific design
  switch (template.id) {
    case 'professional':
      await drawProfessionalTemplate(ctx, canvas, data, template)
      break
    case 'academic':
      await drawAcademicTemplate(ctx, canvas, data, template)
      break
    case 'corporate':
      await drawCorporateTemplate(ctx, canvas, data, template)
      break
    case 'achievement':
      await drawAchievementTemplate(ctx, canvas, data, template)
      break
    case 'excellence':
      await drawExcellenceTemplate(ctx, canvas, data, template)
      break
    default:
      await drawProfessionalTemplate(ctx, canvas, data, template)
  }

  console.log('🎨 Certificate drawn successfully')
}

/**
 * Professional Blue Template - Elegant and modern
 */
async function drawProfessionalTemplate(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  data: CertificateData,
  template: CertificateTemplate
): Promise<void> {
  const { width, height } = canvas

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f8fafc')
  gradient.addColorStop(1, '#e2e8f0')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Decorative border with gradient
  const borderGradient = ctx.createLinearGradient(0, 0, width, 0)
  borderGradient.addColorStop(0, '#1e40af')
  borderGradient.addColorStop(0.5, '#3b82f6')
  borderGradient.addColorStop(1, '#1e40af')

  ctx.strokeStyle = borderGradient
  ctx.lineWidth = 12
  ctx.strokeRect(30, 30, width - 60, height - 60)

  // Inner decorative frame
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 2
  ctx.strokeRect(50, 50, width - 100, height - 100)

  // Top decorative elements
  drawDecorativeCorners(ctx, width, height, '#1e40af')

  // Header section with elegant typography
  ctx.fillStyle = '#1e40af'
  ctx.font = 'bold 56px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('CERTIFICATE', width / 2, 150)

  // Elegant subtitle
  ctx.font = '28px Georgia, serif'
  ctx.fillStyle = '#64748b'
  ctx.fillText('of Achievement', width / 2, 190)

  // Decorative line with ornaments
  drawDecorativeLine(ctx, width / 2 - 150, 220, 300, '#3b82f6')

  // Main content area
  ctx.font = '22px Georgia, serif'
  ctx.fillStyle = '#475569'
  ctx.fillText('This is to certify that', width / 2, 280)

  // Recipient name with elegant styling
  ctx.font = 'bold 48px Georgia, serif'
  ctx.fillStyle = '#1e40af'
  ctx.fillText(data.recipientName, width / 2, 340)

  // Elegant underline
  const nameWidth = ctx.measureText(data.recipientName).width
  const underlineGradient = ctx.createLinearGradient(width / 2 - nameWidth / 2, 0, width / 2 + nameWidth / 2, 0)
  underlineGradient.addColorStop(0, 'transparent')
  underlineGradient.addColorStop(0.2, '#3b82f6')
  underlineGradient.addColorStop(0.8, '#3b82f6')
  underlineGradient.addColorStop(1, 'transparent')
  ctx.fillStyle = underlineGradient
  ctx.fillRect(width / 2 - nameWidth / 2, 355, nameWidth, 3)

  // Achievement description
  ctx.font = '22px Georgia, serif'
  ctx.fillStyle = '#475569'
  ctx.fillText('has successfully completed', width / 2, 400)

  // Course title with emphasis
  ctx.font = 'bold 36px Georgia, serif'
  ctx.fillStyle = '#1e40af'
  ctx.fillText(data.title, width / 2, 450)

  // Description if provided
  if (data.description && data.description.length < 80) {
    ctx.font = 'italic 20px Georgia, serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText(data.description, width / 2, 490)
  }

  // Bottom section with professional layout
  drawBottomSection(ctx, width, height, data, template)

  // Seal/Badge
  drawProfessionalSeal(ctx, width - 150, height - 200, '#1e40af')
}

/**
 * Academic Navy Template - Traditional and prestigious
 */
async function drawAcademicTemplate(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  data: CertificateData,
  template: CertificateTemplate
): Promise<void> {
  const { width, height } = canvas

  // Deep navy background
  ctx.fillStyle = '#1a365d'
  ctx.fillRect(0, 0, width, height)

  // Ornate border design
  ctx.strokeStyle = '#f7fafc'
  ctx.lineWidth = 8
  ctx.strokeRect(40, 40, width - 80, height - 80)

  // Inner decorative border
  ctx.strokeStyle = '#ffd700'
  ctx.lineWidth = 4
  ctx.strokeRect(60, 60, width - 120, height - 120)

  // Academic corners with flourishes
  drawAcademicCorners(ctx, width, height)

  // Institution crest area (top center)
  drawAcademicCrest(ctx, width / 2, 120)

  // Elegant header
  ctx.fillStyle = '#f7fafc'
  ctx.font = 'bold 52px Times, serif'
  ctx.textAlign = 'center'
  ctx.fillText('ACADEMIC CERTIFICATE', width / 2, 200)

  // Gold accent line
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(width / 2 - 200, 220, 400, 4)

  // Latin motto or subtitle
  ctx.font = 'italic 24px Times, serif'
  ctx.fillStyle = '#cbd5e0'
  ctx.fillText('Excellentia in Educatione', width / 2, 260)

  // Main certification text
  ctx.font = '24px Times, serif'
  ctx.fillStyle = '#f7fafc'
  ctx.fillText('This is to certify that', width / 2, 320)

  // Student name with gold highlighting
  ctx.font = 'bold 46px Times, serif'
  ctx.fillStyle = '#ffd700'
  ctx.fillText(data.recipientName, width / 2, 380)

  // Academic achievement text
  ctx.font = '24px Times, serif'
  ctx.fillStyle = '#f7fafc'
  ctx.fillText('has fulfilled the requirements for', width / 2, 430)

  // Degree/Course title
  ctx.font = 'bold 38px Times, serif'
  ctx.fillStyle = '#f7fafc'
  ctx.fillText(data.title, width / 2, 480)

  // Academic bottom section
  drawAcademicBottomSection(ctx, width, height, data)
}

/**
 * Corporate Gray Template - Modern and sleek
 */
async function drawCorporateTemplate(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  data: CertificateData,
  template: CertificateTemplate
): Promise<void> {
  const { width, height } = canvas

  // Modern gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, width, height)
  bgGradient.addColorStop(0, '#2d3748')
  bgGradient.addColorStop(1, '#1a202c')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, width, height)

  // Geometric design elements
  drawGeometricElements(ctx, width, height)

  // Modern header
  ctx.fillStyle = '#ffffff'
  ctx.font = '300 54px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('CERTIFICATE', width / 2, 140)

  // Blue accent
  ctx.fillStyle = '#4299e1'
  ctx.fillRect(width / 2 - 100, 160, 200, 4)

  // Subtitle
  ctx.font = '400 26px Arial, sans-serif'
  ctx.fillStyle = '#a0aec0'
  ctx.fillText('of Professional Completion', width / 2, 200)

  // Main content with modern typography
  ctx.font = '400 22px Arial, sans-serif'
  ctx.fillStyle = '#e2e8f0'
  ctx.fillText('We hereby certify that', width / 2, 280)

  // Name with gradient effect
  const nameGradient = ctx.createLinearGradient(0, 320, 0, 360)
  nameGradient.addColorStop(0, '#4299e1')
  nameGradient.addColorStop(1, '#63b3ed')
  ctx.fillStyle = nameGradient
  ctx.font = 'bold 48px Arial, sans-serif'
  ctx.fillText(data.recipientName, width / 2, 340)

  // Achievement text
  ctx.font = '400 22px Arial, sans-serif'
  ctx.fillStyle = '#e2e8f0'
  ctx.fillText('has successfully completed', width / 2, 390)

  // Course title
  ctx.font = '600 36px Arial, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(data.title, width / 2, 440)

  // Corporate bottom section
  drawCorporateBottomSection(ctx, width, height, data)
}

/**
 * Achievement Gold Template - Celebratory and prestigious
 */
async function drawAchievementTemplate(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  data: CertificateData,
  template: CertificateTemplate
): Promise<void> {
  const { width, height } = canvas

  // Warm gradient background
  const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2)
  bgGradient.addColorStop(0, '#fefdf8')
  bgGradient.addColorStop(1, '#fef3c7')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, width, height)

  // Ornate golden border
  drawGoldenBorder(ctx, width, height)

  // Achievement stars
  drawAchievementStars(ctx, width, height)

  // Elegant header
  ctx.fillStyle = '#92400e'
  ctx.font = 'bold 52px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('ACHIEVEMENT AWARD', width / 2, 150)

  // Golden ribbon effect
  drawGoldenRibbon(ctx, width / 2, 180)

  // Main content
  ctx.font = '24px Georgia, serif'
  ctx.fillStyle = '#78350f'
  ctx.fillText('Presented to', width / 2, 280)

  // Recipient name with golden glow
  ctx.font = 'bold 48px Georgia, serif'
  ctx.fillStyle = '#92400e'
  ctx.fillText(data.recipientName, width / 2, 340)

  // Achievement description
  ctx.font = '24px Georgia, serif'
  ctx.fillStyle = '#78350f'
  ctx.fillText('for outstanding achievement in', width / 2, 390)

  // Achievement title
  ctx.font = 'bold 38px Georgia, serif'
  ctx.fillStyle = '#d97706'
  ctx.fillText(data.title, width / 2, 440)

  // Achievement bottom section
  drawAchievementBottomSection(ctx, width, height, data)
}

/**
 * Excellence Purple Template - Luxurious and modern
 */
async function drawExcellenceTemplate(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  data: CertificateData,
  template: CertificateTemplate
): Promise<void> {
  const { width, height } = canvas

  // Luxurious gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, width, height)
  bgGradient.addColorStop(0, '#faf5ff')
  bgGradient.addColorStop(0.5, '#f3e8ff')
  bgGradient.addColorStop(1, '#faf5ff')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, width, height)

  // Purple geometric patterns
  drawPurplePatterns(ctx, width, height)

  // Excellence crown/badge
  drawExcellenceBadge(ctx, width / 2, 100)

  // Elegant header
  ctx.fillStyle = '#7c3aed'
  ctx.font = 'bold 54px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('EXCELLENCE', width / 2, 180)

  // Subtitle
  ctx.font = '28px Arial, sans-serif'
  ctx.fillStyle = '#a855f7'
  ctx.fillText('CERTIFICATE', width / 2, 220)

  // Decorative elements
  drawPurpleDecorations(ctx, width / 2, 240)

  // Main content
  ctx.font = '24px Arial, sans-serif'
  ctx.fillStyle = '#6b21a8'
  ctx.fillText('This certificate recognizes', width / 2, 300)

  // Recipient name with purple gradient
  const nameGradient = ctx.createLinearGradient(0, 330, 0, 370)
  nameGradient.addColorStop(0, '#7c3aed')
  nameGradient.addColorStop(1, '#a855f7')
  ctx.fillStyle = nameGradient
  ctx.font = 'bold 48px Arial, sans-serif'
  ctx.fillText(data.recipientName, width / 2, 350)

  // Excellence description
  ctx.font = '24px Arial, sans-serif'
  ctx.fillStyle = '#6b21a8'
  ctx.fillText('for demonstrating excellence in', width / 2, 400)

  // Excellence area
  ctx.font = 'bold 38px Arial, sans-serif'
  ctx.fillStyle = '#7c3aed'
  ctx.fillText(data.title, width / 2, 450)

  // Excellence bottom section
  drawExcellenceBottomSection(ctx, width, height, data)
}

// Helper functions for decorative elements
function drawDecorativeCorners(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  ctx.fillStyle = color
  const cornerSize = 40

  // Top-left corner
  ctx.fillRect(50, 50, cornerSize, 8)
  ctx.fillRect(50, 50, 8, cornerSize)

  // Top-right corner
  ctx.fillRect(width - 50 - cornerSize, 50, cornerSize, 8)
  ctx.fillRect(width - 58, 50, 8, cornerSize)

  // Bottom-left corner
  ctx.fillRect(50, height - 58, cornerSize, 8)
  ctx.fillRect(50, height - 50 - cornerSize, 8, cornerSize)

  // Bottom-right corner
  ctx.fillRect(width - 50 - cornerSize, height - 58, cornerSize, 8)
  ctx.fillRect(width - 58, height - 50 - cornerSize, 8, cornerSize)
}

function drawDecorativeLine(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, color: string) {
  const gradient = ctx.createLinearGradient(x, y, x + width, y)
  gradient.addColorStop(0, 'transparent')
  gradient.addColorStop(0.2, color)
  gradient.addColorStop(0.8, color)
  gradient.addColorStop(1, 'transparent')

  ctx.fillStyle = gradient
  ctx.fillRect(x, y, width, 3)

  // Add small decorative diamonds
  ctx.fillStyle = color
  const diamondSize = 8
  ctx.save()
  ctx.translate(x + width / 2, y + 1.5)
  ctx.rotate(Math.PI / 4)
  ctx.fillRect(-diamondSize / 2, -diamondSize / 2, diamondSize, diamondSize)
  ctx.restore()
}

function drawProfessionalSeal(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  // Draw circular seal
  ctx.beginPath()
  ctx.arc(x, y, 35, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()

  // Inner circle
  ctx.beginPath()
  ctx.arc(x, y, 25, 0, 2 * Math.PI)
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.stroke()

  // Star in center
  drawStar(ctx, x, y, 15, '#ffffff')
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5
    const px = x + Math.cos(angle) * size
    const py = y + Math.sin(angle) * size
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
}

function drawBottomSection(ctx: CanvasRenderingContext2D, width: number, height: number, data: CertificateData, template: CertificateTemplate) {
  const bottomY = height - 150

  // Decorative line above bottom section
  const lineGradient = ctx.createLinearGradient(100, bottomY - 20, width - 100, bottomY - 20)
  lineGradient.addColorStop(0, 'transparent')
  lineGradient.addColorStop(0.5, template.secondaryColor)
  lineGradient.addColorStop(1, 'transparent')
  ctx.fillStyle = lineGradient
  ctx.fillRect(100, bottomY - 20, width - 200, 2)

  // Left: Date
  ctx.textAlign = 'left'
  ctx.font = '16px Georgia, serif'
  ctx.fillStyle = template.primaryColor
  ctx.fillText('Date of Issue', 100, bottomY)
  ctx.font = 'bold 20px Georgia, serif'
  ctx.fillText(data.issuedDate, 100, bottomY + 25)

  // Center: Token ID
  ctx.textAlign = 'center'
  ctx.font = '16px Georgia, serif'
  ctx.fillStyle = template.primaryColor
  ctx.fillText('Certificate ID', width / 2, bottomY)
  ctx.font = 'bold 18px monospace'
  ctx.fillText(data.tokenId, width / 2, bottomY + 25)

  // Right: Issuer with signature line
  ctx.textAlign = 'right'
  ctx.font = '16px Georgia, serif'
  ctx.fillStyle = template.primaryColor
  ctx.fillText('Issued by', width - 100, bottomY)
  ctx.font = 'bold 20px Georgia, serif'
  ctx.fillText(data.issuerName, width - 100, bottomY + 25)

  // Signature line
  ctx.strokeStyle = template.primaryColor
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(width - 250, bottomY + 50)
  ctx.lineTo(width - 100, bottomY + 50)
  ctx.stroke()

  ctx.font = '14px Georgia, serif'
  ctx.fillStyle = template.secondaryColor
  ctx.fillText('Authorized Signature', width - 100, bottomY + 70)
}

function drawAcademicCorners(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = '#ffd700'
  ctx.lineWidth = 3

  // Ornate corner designs
  const cornerSize = 60

  // Top corners
  ctx.beginPath()
  ctx.moveTo(60, 60 + cornerSize)
  ctx.lineTo(60, 60)
  ctx.lineTo(60 + cornerSize, 60)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(width - 60 - cornerSize, 60)
  ctx.lineTo(width - 60, 60)
  ctx.lineTo(width - 60, 60 + cornerSize)
  ctx.stroke()

  // Bottom corners
  ctx.beginPath()
  ctx.moveTo(60, height - 60 - cornerSize)
  ctx.lineTo(60, height - 60)
  ctx.lineTo(60 + cornerSize, height - 60)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(width - 60 - cornerSize, height - 60)
  ctx.lineTo(width - 60, height - 60)
  ctx.lineTo(width - 60, height - 60 - cornerSize)
  ctx.stroke()
}

function drawAcademicCrest(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Shield shape
  ctx.fillStyle = '#ffd700'
  ctx.beginPath()
  ctx.moveTo(x, y - 30)
  ctx.lineTo(x - 25, y - 15)
  ctx.lineTo(x - 25, y + 15)
  ctx.lineTo(x, y + 30)
  ctx.lineTo(x + 25, y + 15)
  ctx.lineTo(x + 25, y - 15)
  ctx.closePath()
  ctx.fill()

  // Inner design
  ctx.fillStyle = '#1a365d'
  ctx.font = 'bold 24px serif'
  ctx.textAlign = 'center'
  ctx.fillText('★', x, y + 8)
}

// Additional helper functions for other templates
function drawAcademicBottomSection(ctx: CanvasRenderingContext2D, width: number, height: number, data: CertificateData) {
  const bottomY = height - 120

  // Academic seal
  ctx.fillStyle = '#ffd700'
  ctx.beginPath()
  ctx.arc(150, bottomY - 20, 30, 0, 2 * Math.PI)
  ctx.fill()

  // Date and details
  ctx.textAlign = 'center'
  ctx.font = '18px Times, serif'
  ctx.fillStyle = '#f7fafc'
  ctx.fillText(data.issuedDate, width / 2, bottomY)

  ctx.font = '16px Times, serif'
  ctx.fillStyle = '#cbd5e0'
  ctx.fillText(data.tokenId, width / 2, bottomY + 25)

  // Institution name
  ctx.font = 'bold 20px Times, serif'
  ctx.fillStyle = '#f7fafc'
  ctx.fillText(data.issuerName, width / 2, bottomY + 50)
}

function drawGeometricElements(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Modern geometric patterns
  ctx.fillStyle = 'rgba(66, 153, 225, 0.1)'

  // Triangular elements
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(200, 0)
  ctx.lineTo(0, 200)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(width, height)
  ctx.lineTo(width - 200, height)
  ctx.lineTo(width, height - 200)
  ctx.closePath()
  ctx.fill()
}

function drawCorporateBottomSection(ctx: CanvasRenderingContext2D, width: number, height: number, data: CertificateData) {
  const bottomY = height - 120

  // Modern bottom bar
  const barGradient = ctx.createLinearGradient(0, bottomY - 40, width, bottomY - 40)
  barGradient.addColorStop(0, 'rgba(66, 153, 225, 0.2)')
  barGradient.addColorStop(1, 'rgba(99, 179, 237, 0.2)')
  ctx.fillStyle = barGradient
  ctx.fillRect(80, bottomY - 40, width - 160, 80)

  // Information layout
  ctx.font = '16px Arial, sans-serif'
  ctx.fillStyle = '#a0aec0'
  ctx.textAlign = 'left'
  ctx.fillText('ISSUED', 120, bottomY - 10)
  ctx.font = 'bold 18px Arial, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(data.issuedDate, 120, bottomY + 15)

  ctx.textAlign = 'center'
  ctx.font = '16px Arial, sans-serif'
  ctx.fillStyle = '#a0aec0'
  ctx.fillText('CERTIFICATE ID', width / 2, bottomY - 10)
  ctx.font = 'bold 16px monospace'
  ctx.fillStyle = '#4299e1'
  ctx.fillText(data.tokenId, width / 2, bottomY + 15)

  ctx.textAlign = 'right'
  ctx.font = '16px Arial, sans-serif'
  ctx.fillStyle = '#a0aec0'
  ctx.fillText('ORGANIZATION', width - 120, bottomY - 10)
  ctx.font = 'bold 18px Arial, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(data.issuerName, width - 120, bottomY + 15)
}

function drawGoldenBorder(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const borderGradient = ctx.createLinearGradient(0, 0, width, 0)
  borderGradient.addColorStop(0, '#d97706')
  borderGradient.addColorStop(0.5, '#fbbf24')
  borderGradient.addColorStop(1, '#d97706')

  ctx.strokeStyle = borderGradient
  ctx.lineWidth = 10
  ctx.strokeRect(25, 25, width - 50, height - 50)

  // Inner golden line
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 2
  ctx.strokeRect(45, 45, width - 90, height - 90)
}

function drawAchievementStars(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const starPositions = [
    { x: 100, y: 100 },
    { x: width - 100, y: 100 },
    { x: 100, y: height - 100 },
    { x: width - 100, y: height - 100 }
  ]

  starPositions.forEach(pos => {
    drawStar(ctx, pos.x, pos.y, 20, '#f59e0b')
  })
}

function drawGoldenRibbon(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const ribbonGradient = ctx.createLinearGradient(x - 150, y, x + 150, y)
  ribbonGradient.addColorStop(0, 'transparent')
  ribbonGradient.addColorStop(0.2, '#f59e0b')
  ribbonGradient.addColorStop(0.8, '#f59e0b')
  ribbonGradient.addColorStop(1, 'transparent')

  ctx.fillStyle = ribbonGradient
  ctx.fillRect(x - 150, y, 300, 8)
}

function drawAchievementBottomSection(ctx: CanvasRenderingContext2D, width: number, height: number, data: CertificateData) {
  const bottomY = height - 120

  // Golden frame for bottom section
  ctx.strokeStyle = '#d97706'
  ctx.lineWidth = 3
  ctx.strokeRect(80, bottomY - 60, width - 160, 100)

  // Content
  ctx.textAlign = 'center'
  ctx.font = '18px Georgia, serif'
  ctx.fillStyle = '#92400e'
  ctx.fillText(`Awarded on ${data.issuedDate}`, width / 2, bottomY - 20)

  ctx.font = '16px Georgia, serif'
  ctx.fillStyle = '#78350f'
  ctx.fillText(`By ${data.issuerName}`, width / 2, bottomY + 5)

  ctx.font = '14px monospace'
  ctx.fillStyle = '#a16207'
  ctx.fillText(`ID: ${data.tokenId}`, width / 2, bottomY + 30)
}

function drawPurplePatterns(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Subtle geometric patterns
  ctx.fillStyle = 'rgba(124, 58, 237, 0.05)'

  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.arc(width * 0.2 * i, height * 0.3, 50, 0, 2 * Math.PI)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(width * 0.2 * i, height * 0.7, 30, 0, 2 * Math.PI)
    ctx.fill()
  }
}

function drawExcellenceBadge(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Crown-like badge
  ctx.fillStyle = '#7c3aed'
  ctx.beginPath()
  ctx.arc(x, y, 40, 0, 2 * Math.PI)
  ctx.fill()

  // Inner design
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 32px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('★', x, y + 10)
}

function drawPurpleDecorations(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Decorative elements around the header
  ctx.fillStyle = '#a855f7'

  // Left decoration
  ctx.beginPath()
  ctx.arc(x - 200, y, 8, 0, 2 * Math.PI)
  ctx.fill()

  // Right decoration
  ctx.beginPath()
  ctx.arc(x + 200, y, 8, 0, 2 * Math.PI)
  ctx.fill()

  // Center line
  ctx.fillRect(x - 100, y - 2, 200, 4)
}

function drawExcellenceBottomSection(ctx: CanvasRenderingContext2D, width: number, height: number, data: CertificateData) {
  const bottomY = height - 120

  // Purple gradient background for bottom section
  const bgGradient = ctx.createLinearGradient(0, bottomY - 40, 0, bottomY + 40)
  bgGradient.addColorStop(0, 'rgba(124, 58, 237, 0.1)')
  bgGradient.addColorStop(1, 'rgba(168, 85, 247, 0.1)')
  ctx.fillStyle = bgGradient
  ctx.fillRect(60, bottomY - 40, width - 120, 80)

  // Excellence badge
  drawStar(ctx, width - 120, bottomY, 25, '#7c3aed')

  // Information
  ctx.textAlign = 'center'
  ctx.font = '18px Arial, sans-serif'
  ctx.fillStyle = '#7c3aed'
  ctx.fillText(`Excellence recognized on ${data.issuedDate}`, width / 2, bottomY - 10)

  ctx.font = '16px Arial, sans-serif'
  ctx.fillStyle = '#6b21a8'
  ctx.fillText(`Certified by ${data.issuerName}`, width / 2, bottomY + 15)

  ctx.font = '14px monospace'
  ctx.fillStyle = '#a855f7'
  ctx.fillText(`Certificate: ${data.tokenId}`, width / 2, bottomY + 35)
}

/**
 * Preview certificate as data URL
 */
export async function previewCertificate(data: CertificateData): Promise<string> {
  const templateId = data.template || 'professional'
  const template = CERTIFICATE_TEMPLATES.find(t => t.id === templateId) || CERTIFICATE_TEMPLATES[0]

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas context not available')
  }

  canvas.width = 1200
  canvas.height = 850

  await drawCertificate(ctx, canvas, data, template)

  return canvas.toDataURL('image/png', 0.95)
}

/**
 * Legacy function for HTML preview (kept for backward compatibility)
 */
export function previewCertificateHTML(data: CertificateData): string {
  return generateCertificateHTML(data)
}
