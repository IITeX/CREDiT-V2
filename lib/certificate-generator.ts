// Certificate generation and download functionality

export interface CertificateData {
  tokenId: string
  title: string
  recipientName: string
  issuerName: string
  issuedDate: string
  description?: string
  metadata?: { [key: string]: string }
  template?: 'professional' | 'academic' | 'corporate' | 'achievement' | 'excellence'
}

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

export async function downloadCertificateAsPNG(data: CertificateData): Promise<void> {
  try {
    // Create a temporary div to render the certificate
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = generateCertificateHTML(data)
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '-9999px'
    document.body.appendChild(tempDiv)

    // Use html2canvas to convert to image
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
      width: 800,
      height: 600,
      scale: 2, // Higher resolution
      backgroundColor: null,
      logging: false,
      useCORS: true
    })

    // Clean up
    document.body.removeChild(tempDiv)

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `certificate-${data.tokenId}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    }, 'image/png', 1.0)

  } catch (error) {
    console.error('Error generating certificate:', error)
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
              // Auto-print dialog
              setTimeout(() => window.print(), 1000);
            </script>
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }
}

export function previewCertificate(data: CertificateData): string {
  return generateCertificateHTML(data)
}
