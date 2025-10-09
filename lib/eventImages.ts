// Predefined category images from Unsplash
const categoryImages: { [key: string]: string } = {
  'Technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
  'Design': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
  'Business': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  'Education': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
  'Health': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
  'Entertainment': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
  'Other': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop'
};

// Category color schemes for dynamic thumbnails (fallback)
const categoryColors: { [key: string]: { primary: string; secondary: string; accent: string; icon: string } } = {
  'Technology': {
    primary: '#3B82F6', // Blue
    secondary: '#1E40AF', // Dark blue
    accent: '#60A5FA', // Light blue
    icon: '💻'
  },
  'Design': {
    primary: '#8B5CF6', // Purple
    secondary: '#5B21B6', // Dark purple
    accent: '#A78BFA', // Light purple
    icon: '🎨'
  },
  'Business': {
    primary: '#059669', // Green
    secondary: '#047857', // Dark green
    accent: '#34D399', // Light green
    icon: '💼'
  },
  'Education': {
    primary: '#DC2626', // Red
    secondary: '#991B1B', // Dark red
    accent: '#F87171', // Light red
    icon: '📚'
  },
  'Health': {
    primary: '#0891B2', // Cyan
    secondary: '#0E7490', // Dark cyan
    accent: '#22D3EE', // Light cyan
    icon: '🏥'
  },
  'Entertainment': {
    primary: '#EA580C', // Orange
    secondary: '#C2410C', // Dark orange
    accent: '#FB923C', // Light orange
    icon: '🎭'
  },
  'Other': {
    primary: '#6B7280', // Gray
    secondary: '#374151', // Dark gray
    accent: '#9CA3AF', // Light gray
    icon: '📅'
  }
};

// Generate a simple hash from string for consistent colors
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Generate dynamic SVG thumbnail
export const generateEventThumbnail = (title: string, category: string): string => {
  const colors = categoryColors[category] || categoryColors['Other'];
  const titleHash = hashString(title);
  const categoryHash = hashString(category);
  
  // Generate consistent gradient direction based on title
  const gradientAngle = (titleHash % 360);
  
  // Generate pattern based on title length and category
  const patternType = titleHash % 3; // 0: circles, 1: squares, 2: lines
  
  // Create SVG with dynamic content
  const svg = `
    <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${gradientAngle})">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
        <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          ${patternType === 0 ? 
            `<circle cx="20" cy="20" r="8" fill="${colors.accent}" opacity="0.1"/>` :
            patternType === 1 ?
            `<rect x="10" y="10" width="20" height="20" fill="${colors.accent}" opacity="0.1"/>` :
            `<line x1="0" y1="20" x2="40" y2="20" stroke="${colors.accent}" stroke-width="2" opacity="0.1"/>
             <line x1="20" y1="0" x2="20" y2="40" stroke="${colors.accent}" stroke-width="2" opacity="0.1"/>`
          }
        </pattern>
      </defs>
      
      <!-- Background -->
      <rect width="400" height="300" fill="url(#bg)"/>
      <rect width="400" height="300" fill="url(#pattern)"/>
      
      <!-- Category Icon -->
      <text x="50" y="80" font-size="48" fill="white" opacity="0.9">${colors.icon}</text>
      
      <!-- Category Badge -->
      <rect x="40" y="100" width="120" height="30" rx="15" fill="white" opacity="0.2"/>
      <text x="100" y="120" font-size="14" font-weight="bold" fill="white" text-anchor="middle">${category.toUpperCase()}</text>
      
      <!-- Event Title -->
      <text x="200" y="150" font-size="24" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${title.length > 30 ? title.substring(0, 30) + '...' : title}
      </text>
      
      <!-- Decorative Elements -->
      <circle cx="350" cy="50" r="20" fill="white" opacity="0.1"/>
      <circle cx="350" cy="250" r="15" fill="white" opacity="0.1"/>
      <circle cx="50" cy="250" r="25" fill="white" opacity="0.1"/>
    </svg>
  `;
  
  // Encode SVG properly for base64, handling Unicode characters
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
};

// Get predefined category image or generate dynamic thumbnail
export const getEventImage = (category: string, title: string): string => {
  return categoryImages[category] || generateEventThumbnail(title, category);
};

// Get predefined category image
export const getCategoryImage = (category: string): string => {
  return categoryImages[category] || categoryImages['Other'];
};
