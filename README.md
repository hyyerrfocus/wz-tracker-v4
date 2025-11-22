🏆 WZ Tracker - The Hyyerr Guild Point Tracker

An unofficial point tracking application for the World Zero Roblox game community. Track your daily dungeon runs, boss kills, tower completions, and guild quests to monitor your contribution to The Hyyerr Guild.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)

## ✨ Features

- **Daily Point Tracking** - Track points from dungeons, bosses, towers, and guild quests
- **10 World Support** - All dungeons and bosses from Worlds 1-10
- **Tower Tracking** - 7 towers including Prison, Atlantis, Mezuvian, Oasis, Aether, Arcane, and Celestial
- **Infinite Tower Calculator** - Automatically calculates points for floors above 150
- **Guild Quests** - Easy (25pts), Medium (50pts), and Hard (100pts) quest tracking
- **Season Calendar** - View and edit historical data by date
- **Analytics Dashboard** - Track streaks, averages, goal completion rates, and best days
- **Data Backup/Restore** - Export and import your data as JSON files
- **Local Storage** - All data saved locally to your browser
- **Responsive Design** - Works on desktop and mobile devices

## 🎯 Point System

| Activity | Points |
|----------|--------|
| World 1-2 Dungeons (Normal) | 1 pt |
| World 1-2 Dungeons (Challenge) | 2 pts |
| World 3-4 Dungeons (Normal) | 2-3 pts |
| World 3-4 Dungeons (Challenge) | 3-4 pts |
| World 5-10 Dungeons (Normal) | 3-7 pts |
| World 5-10 Dungeons (Challenge) | 4-8 pts |
| World Bosses | 1 pt each |
| Towers | 15 pts each |
| Infinite Tower | 5 pts per 5 floors (above floor 150) |
| Easy Guild Quest | 25 pts |
| Medium Guild Quest | 50 pts |
| Hard Guild Quest | 100 pts |

**Daily Goal: 300 points**

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hyyerrfocus/wz-tracker-v4.git
cd wz-tracker-v4
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 📁 Project Structure

```
wz-tracker-v4/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── src/
    ├── main.tsx            # React entry point
    ├── index.css           # Global styles (Tailwind imports)
    ├── App.tsx             # Main application component
    ├── styles/
    │   └── quests.css      # Custom quest card styles
    └── components/
        └── ui/             # Reusable UI components
            ├── badge.tsx
            ├── button.tsx
            ├── card.tsx
            ├── dialog.tsx
            ├── input.tsx
            ├── label.tsx
            └── scroll-area.tsx
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Zustand** - State management (available)
- **date-fns** - Date utilities

## ☁️ Deployment (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New..." → "Project"
4. Select your GitHub repository
5. Keep default settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

### Troubleshooting Deployment

If changes aren't appearing after deployment:

1. Go to Vercel Dashboard → Deployments
2. Click the three dots (⋮) on latest deployment
3. Click "Redeploy"
4. **Uncheck** "Use existing Build Cache"
5. Click "Redeploy"

## 💾 Data Storage

All data is stored in the browser's `localStorage`:

| Key | Description |
|-----|-------------|
| `hyyerr_player_name` | Saved username |
| `hyyerr_player_{date}` | Daily player data |
| `hyyerr_points_history_season{n}` | Points history per season |
| `hyyerr_notes_season{n}` | Notes per season |
| `hyyerr_season_start_season{n}` | Season start dates |
| `hyyerr_current_season` | Current season number |

## 🔗 Links

- **Live App**: [wz-tracker-v4.vercel.app](https://wz-tracker-v4.vercel.app)
- **World Zero Discord**: [discord.gg/RRvcg9hMwK](https://discord.gg/RRvcg9hMwK)
- **World Zero Game**: [Roblox](https://www.roblox.com/games/2727067538/World-Zero-Anime-RPG)

## 📝 License

This is an unofficial fan project. World Zero is owned by Red Manta LLC.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions or support, contact **HyyerrFocus** on Discord.

---

Made with ❤️ for The Hyyerr Guild
