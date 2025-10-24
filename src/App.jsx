import { useState } from 'react';
import './styles.css';
import Header from './components/Header';
import TodoModule from './components/TodoModule';
import PomodoroModule from './components/PomodoroModule';
import WeatherModule from './components/WeatherModule';
import HelpModal from './components/HelpModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  const [showHelp, setShowHelp] = useState(false);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    onToggleHelp: () => setShowHelp(!showHelp),
    onCloseHelp: () => setShowHelp(false),
  });

  return (
    <>
      <div className="crt-overlay"></div>
      <div className="scanlines"></div>
      
      <div className="container">
        <Header />

        <div className="help-text">
          <p>Press [?] for keyboard shortcuts</p>
        </div>

        <main className="dashboard">
          <TodoModule />
          <PomodoroModule />
          <WeatherModule />
        </main>

        <footer className="footer">
          <div className="footer-shortcuts">
            [1-3] Focus Module | [TAB] Next Field | [ESC] Clear Focus | [?] Help
          </div>
        </footer>
      </div>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
}

export default App;
