# RaceDeck

A client-side Formula 1 season dashboard built with React. Browse the full race calendar, see each Grand Prix in your own time zone, track which race is next, and drill into any weekend's full session schedule — powered by the live Jolpica/Ergast F1 API.

🔗 **[Live Demo](https://racedeck.netlify.app/)** &nbsp;•&nbsp; 💻 **[Source Code](https://github.com/ei7mo/RaceDeck)**

![Screenshot](https://i.postimg.cc/ZY1dLy76/image.png)
![Screenshot](https://i.postimg.cc/c44VXrvY/image.png)

---

## ✨ Features

- Browse the full F1 season calendar in a responsive card grid
- Country flags resolved automatically from the race location
- All session times converted to the visitor's local time zone
- "Next race" highlighted with an animated pulse glow
- Finished / upcoming status per race, with human countdowns ("In 3 days")
- Race detail page with the full weekend schedule (practice, qualifying, race)
- Automatic Sprint-weekend handling — sessions sorted chronologically and grouped by day
- Loading, error, and empty states throughout
- Fully responsive — mobile-friendly layout on all pages

---

## 🛠️ Tech Stack

- **React 19 + TypeScript** — UI and component logic
- **Vite 8** — build tool and dev server
- **Tailwind CSS 4** — utility-first styling via `@tailwindcss/vite`
- **React Router DOM 7** — client-side routing
- **Jolpica/Ergast F1 API** — live race and session data
- **country-codes-list** — country name → ISO code lookup for flags
- **flagcdn** — flag images

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Sticky top navigation bar
│   └── RaceCard.tsx        # Calendar grid: fetches races, renders status cards
├── pages/
│   ├── Home.tsx            # Calendar page (navbar + race grid)
│   └── RaceDetails.tsx     # Single race weekend schedule
├── services/
│   └── api.ts              # F1 API calls (getRaces, getRaceByRound)
├── types/
│   └── raceType.ts         # Race and Session type definitions
├── App.tsx                 # Routes
├── main.tsx                # Entry point (BrowserRouter)
└── index.css               # Tailwind import + theme tokens (colors, fonts, animations)
```
