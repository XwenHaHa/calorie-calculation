<p align="center">
  <img src="src/assets/hero.svg" alt="Calmorie" width="100%" />
</p>

<h1 align="center">Calmorie</h1>

<p align="center">
  <strong>A minimalist calorie tracking app to quickly log your daily food intake and exercise burn</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

<p align="center">
  <a href="README.md">中文</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#features">Features</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#contributing">Contributing</a>
</p>

---

## Features

### Core
- **Quick Logging** - Log a meal in under 5 seconds
- **Food Intake** - Track daily food calories
- **Exercise Burn** - Track exercise calories burned
- **Daily Summary** - Real-time intake, burn & net calories
- **Calendar View** - Browse history by date
- **Monthly Stats** - Visualize calorie trends with charts
- **AI Insights** - Generate personalized health tips from your data

### Interaction
- Quick input mode (e.g., `Chicken 500`, `Running -300`)
- Quick-select for common foods & exercises
- Mobile-first, single-hand friendly
- Local storage, no login required
- Bilingual support (Chinese / English)

## Demo

<!-- ![Calmorie Demo](demo.gif) -->

> **Tip**: Record a GIF and place it here. Recommended tools: [ScreenToGif](https://www.screentogif.com/) or [Kap](https://getkap.co/).

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repo
git clone https://github.com/XwenHaHa/calorie-calculation.git
cd calorie-calculation

# Install dependencies
npm install

# Setup env variables
cp .env.example .env
# Edit .env and fill in your AI API credentials

# Start dev server
npm run dev
```

Visit http://101.96.208.101:5188 to view the app.

### Build

```bash
npm run build       # Build for production
npm run preview     # Preview the build
```

### Lint

```bash
npm run lint
```

## Tech Stack

| Tech | Purpose |
|------|---------|
| **React 19** | Frontend framework |
| **TypeScript 6** | Type safety |
| **Vite 8** | Build tool |
| **Tailwind CSS 4** | Styling |
| **React Router Dom 7** | Routing |
| **date-fns** | Date utilities |
| **ECharts** | Charts |
| **LocalStorage** | Data persistence |
| **i18next** | Internationalization (zh / en) |
| **OpenAI-compatible API** | AI capabilities |

## Project Structure

```
src/
├── components/       # Shared components
│   ├── BottomNav.tsx
│   ├── Card.tsx
│   └── FloatingButton.tsx
├── pages/            # Page components
│   ├── HomePage.tsx
│   ├── CalendarPage.tsx
│   ├── StatsPage.tsx
│   ├── AIPage.tsx
│   └── AddRecordModal.tsx
├── i18n/             # i18n config & locale files
│   ├── index.ts
│   └── locales/      # zh / en language resources
├── store/            # State (Context + useReducer)
├── services/         # Services
│   ├── storage.ts
│   └── ai.ts
├── utils/            # Utilities
├── types/            # Type definitions
├── constants/        # Constants
└── assets/           # Static assets
```

## Usage

### Adding Records

1. Tap the green **+** button at bottom-right
2. Select "Food" or "Exercise"
3. Enter name & calories (or use quick input)
4. Tap "Add" to save

### Quick Input Format

```bash
# Food intake
Chicken 500
Rice 200

# Exercise burn (negative = burn)
Running -300
Swimming -200
```

### View Stats

- **Home**: Today's calorie summary
- **Calendar**: Browse history by date
- **Stats**: Monthly trend charts
- **AI**: Data-driven health tips

## Data Models

```typescript
// Record
interface Transaction {
  id: string;
  type: 'food' | 'exercise';
  title: string;
  calories: number;  // positive=intake, negative=burn
  date: string;      // ISO string
  note?: string;
}

// Daily Summary
interface DailySummary {
  date: string;
  totalIntake: number;
  totalBurn: number;
  netCalories: number;
  recordCount: number;
}
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and fill in your config:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_AI_BASE_URL` | AI API endpoint | `https://yxai.chat/v1` |
| `VITE_AI_API_KEY` | AI API key | `your-api-key` |
| `VITE_AI_MODEL` | Model name | `gpt-5.3-chat` |

Compatible with any OpenAI API-compatible service.

> **Note**: `.env` is gitignored and will not be committed.

## Browser Support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png" alt="Safari" width="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png" alt="Edge" width="24px" />](http://godban.github.io/browsers-support-badges/)<br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox |
|:---:|:---:|:---:|:---:|
| ✅ | ✅ | ✅ | ✅ |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repo
2. Create a branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE)

---

<p align="center">
  If you find this helpful, give it a ⭐️ Star!
</p>
