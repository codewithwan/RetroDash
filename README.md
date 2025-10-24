# RetroDash

A productivity dashboard inspired by 1980s terminal aesthetics. Features to-do lists, Pomodoro timer, and weather information with a retro CRT screen effect.

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
- **Fast Loading**: No external dependencies except Google Fonts
- **Offline Support**: Full localStorage implementation
- **Lightweight**: Pure vanilla JavaScript, HTML, and CSS
- **Responsive**: Works on desktop and mobile devices

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

2. Open `index.html` in your web browser:
   ```bash
   open index.html
   # or simply double-click the file
   ```

That's it! No build process or dependencies required.

## Usage

### To-Do List
1. Type your task in the input field at the top of the To-Do List module
2. Press `ENTER` or click to add the task
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

## File Structure

```
RetroDash/
├── index.html      # Main HTML structure
├── styles.css      # 1980s terminal styling with CRT effects
├── app.js          # All JavaScript functionality
└── README.md       # Documentation
```

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
Edit the timer values in `app.js`:
```javascript
const state = {
    timer: {
        workMinutes: 25,    // Change work session length
        breakMinutes: 5,    // Change break length
        // ...
    }
};
```

### Change Color Scheme
Edit CSS variables in `styles.css`:
```css
:root {
    --terminal-bg: #0a0a0a;      /* Background color */
    --terminal-fg: #00ff41;      /* Foreground/text color */
    --terminal-dim: #00aa2b;     /* Dimmed text */
    --terminal-bright: #80ff80;  /* Highlighted text */
}
```

### Integrate Real Weather API
Replace the mock weather function in `app.js` with OpenWeather API:
```javascript
async function fetchWeather() {
    const city = document.getElementById('weather-input').value.trim();
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

## Features Roadmap

- [ ] Add task categories and filtering
- [ ] Export/import data functionality
- [ ] Customizable timer durations
- [ ] Multiple weather locations
- [ ] Daily statistics and analytics
- [ ] Sound effect customization
- [ ] Additional themes (amber, white, etc.)

## License

MIT License - Feel free to use and modify for your own projects.

## Credits

- Font: VT323 from Google Fonts
- Inspired by classic 1980s terminal interfaces
- Built with vanilla JavaScript, HTML, and CSS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Made with ❤️ for retro computing enthusiasts**