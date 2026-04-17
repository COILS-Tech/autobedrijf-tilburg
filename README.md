# Autobedrijf Smolders B.V. Website

Modern, responsive website for Autobedrijf Smolders B.V. in Tilburg.

## Features

- ✨ Modern design with smooth animations and glass-morphism effects
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Fast loading static site (no build process)
- 🎨 Enhanced interactions with hover effects and parallax scrolling
- ♿ Accessible with keyboard navigation support
- 🔍 SEO optimized

## Tech Stack

- Pure HTML5, CSS3, JavaScript (ES6+)
- No build process required
- No dependencies

## Local Development

Simply open `index.html` in a browser or run a local server:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js
npx serve

# Using PHP
php -S localhost:8080
```

Then visit `http://localhost:8080`

## Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Using Vercel Dashboard (Easiest)
1. Visit [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select `COILS-Tech/autobedrijf-tilburg`
4. Click "Deploy" (no configuration needed!)
5. Your site will be live in ~30 seconds

#### Option 2: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Other Deployment Options

**Netlify:**
```bash
npm i -g netlify-cli
netlify deploy
netlify deploy --prod
```

**GitHub Pages:**
1. Go to repository Settings > Pages
2. Select branch: `main`
3. Select folder: `/ (root)`
4. Save

**Cloudflare Pages:**
1. Visit [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Build settings: None (static site)
4. Deploy

## Project Structure

```
/
├── index.html          # Homepage
├── script.js           # Main JavaScript with animations
├── site-data.js        # All content data
├── styles.css          # Complete styling
├── vercel.json         # Vercel configuration
├── assets/             # Images and media
│   └── images/
└── [service-name]/     # Individual service pages
    └── index.html
```

## Content Management

All content is managed in `site-data.js`. Update this file to change:
- Services and descriptions
- Contact information
- Opening hours
- Company details
- Navigation structure

## Services Included

### Bandenservice
- Autobanden, Zomerbanden, Winterbanden
- All-seasonsbanden, Run-flatbanden
- Bestelwagenbanden, Banden wisselen, Banden opslag

### Onderhoud
- Grote beurt, Kleine beurt
- Remmen, Olie verversen, Uitlaten
- Accus, Overige service

### Verkoop & Acties
- Verkoop, Occasions
- APK, Airco
- Acties, Winter controle dag
- Lucht in banden dag

### Contact & Info
- Contact, Privacy policy, Cookie policy

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight (~50KB total size excluding images)
- Fast First Contentful Paint
- Optimized animations with GPU acceleration
- Lazy loading for reveal animations

## License

© 2026 Autobedrijf Smolders B.V. All rights reserved.

## Contact

- **Address:** Spaubeekstraat 95-09, 5035 JV Tilburg
- **Phone:** 013 234 0650
- **Email:** autobedrijf@smoldersbv.nl
