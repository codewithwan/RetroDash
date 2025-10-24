import { useEffect } from 'react';

function HelpModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e) => {
        if (e.target.classList.contains('modal')) {
          onClose();
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>KEYBOARD SHORTCUTS</h2>
        <div className="shortcuts-grid">
          <div className="shortcut-section">
            <h3>NAVIGATION</h3>
            <p>[1] Focus Todo List</p>
            <p>[2] Focus Pomodoro Timer</p>
            <p>[3] Focus Weather Module</p>
            <p>[TAB] Next Input Field</p>
            <p>[ESC] Clear Focus/Close Modal</p>
          </div>
          <div className="shortcut-section">
            <h3>TODO LIST</h3>
            <p>[ENTER] Add Task</p>
            <p>[X] Mark Complete (when focused)</p>
            <p>[D] Delete Task (when focused)</p>
            <p>[C] Clear Completed</p>
          </div>
          <div className="shortcut-section">
            <h3>POMODORO TIMER</h3>
            <p>[S] Start Timer</p>
            <p>[P] Pause Timer</p>
            <p>[R] Reset Timer</p>
          </div>
          <div className="shortcut-section">
            <h3>GENERAL</h3>
            <p>[?] Toggle Help</p>
            <p>[CTRL+K] Clear All Data</p>
          </div>
        </div>
        <p className="modal-close-hint">Press [ESC] or click outside to close</p>
      </div>
    </div>
  );
}

export default HelpModal;
