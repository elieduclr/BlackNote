// Icon Generator for BlackNote.js PWA
// Generates SVG icons that can be converted to PNG

export function generateBlackNoteIcon(size: number): string {
  const iconSvg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background circle -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#bgGradient)" />
      
      <!-- Shield icon -->
      <g transform="translate(${size * 0.25}, ${size * 0.2})">
        <path d="M${size * 0.25} ${size * 0.1}L${size * 0.4} ${size * 0.05}C${size * 0.42} ${size * 0.04} ${size * 0.45} ${size * 0.04} ${size * 0.47} ${size * 0.05}L${size * 0.62} ${size * 0.1}C${size * 0.65} ${size * 0.11} ${size * 0.67} ${size * 0.14} ${size * 0.67} ${size * 0.17}V${size * 0.35}C${size * 0.67} ${size * 0.45} ${size * 0.6} ${size * 0.54} ${size * 0.5} ${size * 0.58}L${size * 0.47} ${size * 0.6}C${size * 0.45} ${size * 0.61} ${size * 0.42} ${size * 0.61} ${size * 0.4} ${size * 0.6}L${size * 0.37} ${size * 0.58}C${size * 0.27} ${size * 0.54} ${size * 0.2} ${size * 0.45} ${size * 0.2} ${size * 0.35}V${size * 0.17}C${size * 0.2} ${size * 0.14} ${size * 0.22} ${size * 0.11} ${size * 0.25} ${size * 0.1}Z" fill="url(#shieldGradient)" />
        
        <!-- Lock symbol inside shield -->
        <rect x="${size * 0.35}" y="${size * 0.28}" width="${size * 0.17}" height="${size * 0.15}" rx="${size * 0.02}" fill="#0f172a" />
        <path d="M${size * 0.38} ${size * 0.28}V${size * 0.24}C${size * 0.38} ${size * 0.21} ${size * 0.41} ${size * 0.18} ${size * 0.44} ${size * 0.18}C${size * 0.47} ${size * 0.18} ${size * 0.5} ${size * 0.21} ${size * 0.5} ${size * 0.24}V${size * 0.28}" stroke="#0f172a" stroke-width="${size * 0.015}" fill="none" />
      </g>
      
      <!-- Sparkle effects -->
      <circle cx="${size * 0.8}" cy="${size * 0.2}" r="${size * 0.02}" fill="#ffffff" opacity="0.8" />
      <circle cx="${size * 0.15}" cy="${size * 0.75}" r="${size * 0.015}" fill="#ffffff" opacity="0.6" />
      <circle cx="${size * 0.85}" cy="${size * 0.85}" r="${size * 0.01}" fill="#ffffff" opacity="0.7" />
    </svg>
  `;
  
  return iconSvg;
}

export function generateScreenshotPlaceholder(width: number, height: number, label: string): string {
  const screenshotSvg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
      
      <!-- Header mockup -->
      <rect x="0" y="0" width="${width}" height="${height * 0.1}" fill="#1e293b" opacity="0.8" />
      
      <!-- Content area mockup -->
      <rect x="${width * 0.05}" y="${height * 0.15}" width="${width * 0.9}" height="${height * 0.2}" rx="8" fill="#334155" opacity="0.6" />
      <rect x="${width * 0.05}" y="${height * 0.4}" width="${width * 0.42}" height="${height * 0.15}" rx="8" fill="#334155" opacity="0.6" />
      <rect x="${width * 0.53}" y="${height * 0.4}" width="${width * 0.42}" height="${height * 0.15}" rx="8" fill="#334155" opacity="0.6" />
      <rect x="${width * 0.05}" y="${height * 0.6}" width="${width * 0.42}" height="${height * 0.15}" rx="8" fill="#334155" opacity="0.6" />
      <rect x="${width * 0.53}" y="${height * 0.6}" width="${width * 0.42}" height="${height * 0.15}" rx="8" fill="#334155" opacity="0.6" />
      
      <!-- BlackNote.js logo mockup -->
      <circle cx="${width * 0.1}" cy="${height * 0.05}" r="${height * 0.02}" fill="#06b6d4" />
      
      <!-- Label -->
      <text x="${width/2}" y="${height * 0.85}" text-anchor="middle" fill="#06b6d4" font-family="system-ui, sans-serif" font-size="${Math.min(width, height) * 0.03}" font-weight="600">
        ${label}
      </text>
      <text x="${width/2}" y="${height * 0.9}" text-anchor="middle" fill="#64748b" font-family="system-ui, sans-serif" font-size="${Math.min(width, height) * 0.02}">
        BlackNote.js v2.0.1 - Ultra-Secure Local Notes
      </text>
    </svg>
  `;
  
  return screenshotSvg;
}

// Convert SVG to data URL for use in HTML
export function svgToDataUrl(svgString: string): string {
  const encoded = encodeURIComponent(svgString);
  return `data:image/svg+xml,${encoded}`;
}