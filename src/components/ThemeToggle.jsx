import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import './ThemeToggle.css'

const ThemeToggle = ({ isSidebarOpen }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-button 
        ${!isSidebarOpen ? 'theme-toggle-button--fixed' : ''}
        ${isDark ? 'theme-toggle-button--dark' : 'theme-toggle-button--light'}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="icon-size" />
      ) : (
        <Moon className="icon-size" />
      )}
    </button>
  );
};

export default ThemeToggle;
