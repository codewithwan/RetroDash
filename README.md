# RetroDash

A productivity dashboard inspired by 1980s terminal aesthetics. Features to-do lists, Pomodoro timer, and weather information with a retro CRT screen effect. **Now built with React.js!**

## Features

### 🎨 1980s Terminal Aesthetics
- **Pixel Font**: VT323 monospace font for authentic terminal feel
- **Monochrome Palette**: Classic green-on-black CRT display (#00ff41 on #0a0a0a)
- **CRT Effects**: Scanlines, flicker animation, and screen glow
- **No Gradients or Emojis**: Pure retro terminal style

### 📋 To-Do List Module
- Add, complete, and delete tasks
- Persistent storage using localStorage
- Task counter showing completed/total
- Keyboard shortcuts for quick actions
- Clear completed tasks function

### ⏰ Pomodoro Timer Module
- 25-minute work sessions / 5-minute breaks
- Start, pause, and reset controls
- Session counter to track productivity
- Audio notifications on completion
- Visual status indicators

### 🌤️ Weather Information Module
- City-based weather lookup
- Displays temperature, conditions, humidity, and wind
- Cached data for offline viewing (1 hour freshness)
- Mock data generation for offline mode

### ⚡ Performance Features
- **Fast Loading**: Built with React + Vite for optimal performance
- **Offline Support**: Full localStorage implementation
- **Modern Stack**: React 19 with hooks and functional components
- **Responsive**: Works on desktop and mobile devices
- **Hot Module Replacement**: Fast development experience

## Tech Stack

- **React 19** - Modern UI library with latest features
- **Vite** - Lightning-fast build tool and dev server
- **Custom Hooks** - `useLocalStorage`, `useKeyboardShortcuts`
- **CSS3** - Original retro CRT styling preserved
- **ESLint** - Code quality and consistency

## Keyboard Shortcuts

### Navigation
- `1` - Focus To-Do List
- `2` - Focus Pomodoro Timer
- `3` - Focus Weather Module
- `TAB` - Navigate between input fields
- `ESC` - Clear focus / Close modal

### To-Do List
- `ENTER` - Add new task
- `X` - Mark task complete (in task list)
- `D` - Delete task (in task list)
- `C` - Clear all completed tasks

### Pomodoro Timer
- `S` - Start timer
- `P` - Pause timer
- `R` - Reset timer

### General
- `?` - Toggle help modal
- `CTRL+K` - Clear all data (confirmation required)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codewithwan/RetroDash.git
   cd RetroDash
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

## Preview Production Build

```bash
npm run preview
```

## Development

### Project Structure

```
RetroDash/
├── src/
│   ├── components/       # React components
│   │   ├── Header.jsx
│   │   ├── TodoModule.jsx
│   │   ├── PomodoroModule.jsx
│   │   ├── WeatherModule.jsx
│   │   └── HelpModal.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useLocalStorage.js
│   │   └── useKeyboardShortcuts.js
│   ├── utils/            # Utility functions
│   │   ├── storage.js
│   │   ├── sound.js
│   │   └── helpers.js
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # React entry point
│   └── styles.css        # Global styles (retro CRT theme)
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite configuration
```

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Usage

### To-Do List
1. Type your task in the input field at the top of the To-Do List module
2. Press `ENTER` to add the task
3. Click the `[X]` button to mark a task as complete
4. Click the `[D]` button to delete a task
5. Press `C` to clear all completed tasks

### Pomodoro Timer
1. Click `START [S]` or press `S` to begin a 25-minute work session
2. Click `PAUSE [P]` or press `P` to pause the timer
3. Click `RESET [R]` or press `R` to reset the timer
4. After a work session completes, a 5-minute break automatically begins
5. Session count tracks your completed work sessions

### Weather Information
1. Enter a city name in the Weather module input field
2. Press `ENTER` to fetch weather data
3. Data is cached for 1 hour for offline viewing
4. **Note**: Currently uses mock data for offline mode. To use real data, integrate OpenWeather API with your own API key.

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## Local Storage

All data is stored locally in your browser using localStorage:
- **To-Do List**: Tasks with completion status
- **Pomodoro Timer**: Session count
- **Weather**: Last fetched weather data (cached for 1 hour)

To clear all data, press `CTRL+K` and confirm.

## Customization

### Change Timer Duration
Edit the timer values in `src/components/PomodoroModule.jsx`:
```javascript
const [workMinutes] = useState(25);  // Change work session length
const [breakMinutes] = useState(5);   // Change break length
```

### Change Color Scheme
Edit CSS variables in `src/styles.css`:
```css
:root {
    --terminal-bg: #0a0a0a;      /* Background color */
    --terminal-fg: #00ff41;      /* Foreground/text color */
    --terminal-dim: #00aa2b;     /* Dimmed text */
    --terminal-bright: #80ff80;  /* Highlighted text */
}
```

### Integrate Real Weather API
Replace the mock weather function in `src/components/WeatherModule.jsx` with OpenWeather API:
```javascript
async function fetchWeather() {
    const city = inputValue.trim();
    const apiKey = 'YOUR_API_KEY'; // Get from openweathermap.org
    
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        // Process and display data
    } catch (error) {
        console.error('Weather API error:', error);
    }
}
```

## Migration from Vanilla JS

This project was originally built with vanilla JavaScript and has been migrated to React.js while preserving all original functionality and aesthetics. The migration brings:

- ✅ Better code organization with component-based architecture
- ✅ Improved state management with React hooks
- ✅ Hot Module Replacement for faster development
- ✅ Modern build tooling with Vite
- ✅ All original features and styling preserved
- ✅ Same keyboard shortcuts and user experience

The original vanilla JS version is preserved in the `original-files` directory for reference.

## Features Roadmap

- [ ] Add task categories and filtering
- [ ] Export/import data functionality
- [ ] Customizable timer durations (UI controls)
- [ ] Multiple weather locations
- [ ] Daily statistics and analytics
- [ ] Sound effect customization
- [ ] Additional themes (amber, white, etc.)
- [ ] TypeScript migration
- [ ] Unit and integration tests

## License

MIT License - Feel free to use and modify for your own projects.

## Credits

- Font: VT323 from Google Fonts
- Inspired by classic 1980s terminal interfaces
- Built with React.js, Vite, and modern web technologies
- Original vanilla JS version by codewithwan

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Made with <3 for retro computing enthusiasts**
