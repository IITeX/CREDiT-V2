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

// Professional certificate templates
export const CERTIFICATE_TEMPLATES: CertificateTemplate[] = [
  {
    id: 'professional',
    name: 'Professional Blue',
    backgroundColor: '#ffffff',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    borderColor: '#1e40af',
    fontFamily: 'Arial, sans-serif'
  },
  {
    id: 'academic',
    name: 'Academic Navy',
    backgroundColor: '#1a365d',
    primaryColor: '#f7fafc',
    secondaryColor: '#ffd700',
    borderColor: '#f7fafc',
    fontFamily: 'Times New Roman, serif'
  },
  {
    id: 'corporate',
    name: 'Corporate Gray',
    backgroundColor: '#2d3748',
    primaryColor: '#ffffff',
    secondaryColor: '#4299e1',
    borderColor: '#4a5568',
    fontFamily: 'Arial, sans-serif'
  },
  {
    id: 'achievement',
    name: 'Achievement Gold',
    backgroundColor: '#fefdf8',
    primaryColor: '#92400e',
    secondaryColor: '#d97706',
    borderColor: '#92400e',
    fontFamily: 'Georgia, serif'
  },
  {
    id: 'excellence',
    name: 'Excellence Purple',
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
 * Draws the certificate on the canvas
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

  // Background
  ctx.fillStyle = template.backgroundColor
  ctx.fillRect(0, 0, width, height)

  // Border
  ctx.strokeStyle = template.borderColor
  ctx.lineWidth = 8
  ctx.strokeRect(20, 20, width - 40, height - 40)

  // Inner border
  ctx.strokeStyle = template.secondaryColor
  ctx.lineWidth = 2
  ctx.strokeRect(40, 40, width - 80, height - 80)

  // Header decoration
  ctx.fillStyle = template.primaryColor
  ctx.fillRect(60, 60, width - 120, 8)

  // Title "CERTIFICATE"
  ctx.fillStyle = template.primaryColor
  ctx.font = `bold 48px ${template.fontFamily}`
  ctx.textAlign = 'center'
  ctx.fillText('CERTIFICATE', width / 2, 140)

  // Subtitle based on template
  ctx.font = `24px ${template.fontFamily}`
  ctx.fillStyle = template.secondaryColor
  const subtitle = template.id === 'academic' ? 'OF ACADEMIC ACHIEVEMENT' :
                   template.id === 'corporate' ? 'OF PROFESSIONAL COMPLETION' :
                   'OF ACHIEVEMENT'
  ctx.fillText(subtitle, width / 2, 180)

  // Decorative line
  ctx.fillStyle = template.secondaryColor
  ctx.fillRect(width / 2 - 100, 200, 200, 2)

  // "This is to certify that"
  ctx.font = `18px ${template.fontFamily}`
  ctx.fillStyle = template.primaryColor
  ctx.fillText('This is to certify that', width / 2, 250)

  // Recipient name (large, prominent)
  ctx.font = `bold 42px ${template.fontFamily}`
  ctx.fillStyle = template.id === 'academic' ? template.secondaryColor : template.primaryColor
  ctx.fillText(data.recipientName, width / 2, 310)

  // Underline for name
  const nameWidth = ctx.measureText(data.recipientName).width
  ctx.fillRect(width / 2 - nameWidth / 2, 320, nameWidth, 2)

  // Achievement text
  ctx.font = `20px ${template.fontFamily}`
  ctx.fillStyle = template.primaryColor
  ctx.fillText('has successfully completed', width / 2, 360)

  // Course/Achievement title
  ctx.font = `bold 32px ${template.fontFamily}`
  ctx.fillStyle = template.secondaryColor
  ctx.fillText(data.title, width / 2, 410)

  // Description (if provided and not too long)
  if (data.description && data.description.length < 100) {
    ctx.font = `18px ${template.fontFamily}`
    ctx.fillStyle = template.primaryColor
    ctx.fillText(data.description, width / 2, 450)
  }

  // Bottom section with details
  const bottomY = height - 180

  // Left side - Issue date
  ctx.textAlign = 'left'
  ctx.font = `16px ${template.fontFamily}`
  ctx.fillStyle = template.primaryColor
  ctx.fillText('Date of Issue:', 100, bottomY)
  ctx.font = `bold 18px ${template.fontFamily}`
  ctx.fillText(data.issuedDate, 100, bottomY + 25)

  // Center - Token ID
  ctx.textAlign = 'center'
  ctx.font = `16px ${template.fontFamily}`
  ctx.fillStyle = template.primaryColor
  ctx.fillText('Certificate ID:', width / 2, bottomY)
  ctx.font = `bold 18px ${template.fontFamily}`
  ctx.fillText(data.tokenId, width / 2, bottomY + 25)

  // Right side - Issuer
  ctx.textAlign = 'right'
  ctx.font = `16px ${template.fontFamily}`
  ctx.fillStyle = template.primaryColor
  ctx.fillText('Issued by:', width - 100, bottomY)
  ctx.font = `bold 18px ${template.fontFamily}`
  ctx.fillText(data.issuerName, width - 100, bottomY + 25)

  // Signature line
  ctx.strokeStyle = template.primaryColor
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(width - 250, bottomY + 60)
  ctx.lineTo(width - 100, bottomY + 60)
  ctx.stroke()

  ctx.textAlign = 'right'
  ctx.font = `14px ${template.fontFamily}`
  ctx.fillStyle = template.secondaryColor
  ctx.fillText('Authorized Signature', width - 100, bottomY + 80)

  // Footer decoration
  ctx.fillStyle = template.secondaryColor
  ctx.fillRect(60, height - 68, width - 120, 8)

  // Credential type badge (top right)
  if (data.credentialType) {
    const badgeX = width - 200
    const badgeY = 100
    ctx.fillStyle = template.secondaryColor
    ctx.fillRect(badgeX - 10, badgeY - 10, 140, 40)
    ctx.fillStyle = template.backgroundColor
    ctx.font = `bold 14px ${template.fontFamily}`
    ctx.textAlign = 'center'
    ctx.fillText(data.credentialType.toUpperCase(), badgeX + 60, badgeY + 15)
  }

  console.log('🎨 Certificate drawn successfully')
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
