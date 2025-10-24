import { useEffect } from 'react';

export function useKeyboardShortcuts({ onToggleHelp, onCloseHelp }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts when typing in input fields (except Escape)
      if (e.target.tagName === 'INPUT' && e.key !== 'Escape') {
        return;
      }

      // Help modal toggle
      if (e.key === '?') {
        e.preventDefault();
        onToggleHelp();
        return;
      }

      // Close modal with Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseHelp();
        // Clear focus from any element
        document.activeElement.blur();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onToggleHelp, onCloseHelp]);
}
