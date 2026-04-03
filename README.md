# Finask — Ethiopia's University Discovery Platform

A modern, AI-powered web platform helping Ethiopian 12th-grade students explore, compare, and choose the right university.

## Features

- 🗺️ Interactive map of Ethiopian universities with real coordinates
- 🔍 Search and filter by region, rating, and featured status
- 🎓 Programs directory organized by field of study
- 🌙 Full dark mode support
- 📱 Responsive design for all screen sizes

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Leaflet (interactive map)
- Framer Motion / Motion
- React Router v7
- Lucide Icons

## Getting Started

**Prerequisites:** Node.js 18+

1. Clone the repo:
   ```bash
   git clone git@github.com:ermiasdesalegn/Finask-Frontend.git
   cd Finask-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the env example and add your keys:
   ```bash
   cp .env.example .env.local
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```

App runs at `http://localhost:3000`

## Project Structure

```
src/
├── assets/          # Images and static files
├── components/
│   ├── home/        # Hero, EthiopiaMap, DiscoveryHub, etc.
│   ├── layout/      # Navbar, Footer
│   ├── ui/          # FlickeringGrid, AnimatedGridPattern
│   └── utils/       # ScrollToTop
├── pages/           # HomePage, UniversitiesPage, University, ProgramsPage, AboutPage
├── constants.ts     # University and region data
├── types.ts         # TypeScript interfaces
└── App.tsx          # Router and dark mode logic
```

## License

MIT
